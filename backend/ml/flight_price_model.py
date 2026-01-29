import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "app", "models")

class FlightPricePredictor:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.feature_columns = []
        
    def load_data(self, file_path):
        """Load the training data"""
        print("Loading data...")
        self.df = pd.read_excel(file_path)
        print(f"Data loaded: {self.df.shape}")
        return self.df
    
    def preprocess_data(self):
        """Preprocess the data for modeling"""
        print("Preprocessing data...")
        
        # Create a copy for preprocessing
        df = self.df.copy()
        
        # Convert Date_of_Journey to datetime
        df['Date_of_Journey'] = pd.to_datetime(df['Date_of_Journey'])
        df['Day_of_Week'] = df['Date_of_Journey'].dt.dayofweek
        df['Month'] = df['Date_of_Journey'].dt.month
        df['Day'] = df['Date_of_Journey'].dt.day
        
        # Extract time features from Dep_Time and Arrival_Time
        def parse_time(time_str):
            try:
                if ':' in str(time_str):
                    time_parts = str(time_str).split(':')
                    if len(time_parts) == 2:
                        hour = int(time_parts[0])
                        minute = int(time_parts[1])
                        return hour, minute
                return 0, 0
            except:
                return 0, 0
        
        dep_times = df['Dep_Time'].apply(parse_time)
        arr_times = df['Arrival_Time'].apply(parse_time)
        
        df['Dep_Hour'] = [time[0] for time in dep_times]
        df['Dep_Minute'] = [time[1] for time in dep_times]
        df['Arrival_Hour'] = [time[0] for time in arr_times]
        df['Arrival_Minute'] = [time[1] for time in arr_times]
        
        # Convert Duration to minutes
        df['Duration_Minutes'] = df['Duration'].apply(self.convert_duration_to_minutes)
        
        # Handle Total_Stops
        df['Total_Stops'] = df['Total_Stops'].map({
            'non-stop': 0,
            '1 stop': 1,
            '2 stops': 2,
            '3 stops': 3,
            '4 stops': 4
        })
        
        # Create route features
        df['Route_Count'] = df['Route'].str.count('→') + 1
        
        # Handle Additional_Info
        df['Additional_Info'] = df['Additional_Info'].fillna('No Info')
        
        categorical_features = ['Airline', 'Source', 'Destination', 'Additional_Info']
        numerical_features = [
            'Day_of_Week', 'Month', 'Day', 'Dep_Hour', 'Dep_Minute',
            'Arrival_Hour', 'Arrival_Minute', 'Duration_Minutes',
            'Total_Stops', 'Route_Count'
        ]
        
        # Encode categorical variables
        for feature in categorical_features:
            le = LabelEncoder()
            df[f'{feature}_Encoded'] = le.fit_transform(df[feature])
            self.label_encoders[feature] = le
        
        feature_columns = [f'{feature}_Encoded' for feature in categorical_features] + numerical_features
        self.feature_columns = feature_columns
        
        X = df[feature_columns]
        y = df['Price']
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale numerical features 
        numerical_indices = [i for i, col in enumerate(feature_columns) if col in numerical_features]
        
        X_train_scaled = X_train.copy().astype(float)
        X_test_scaled = X_test.copy().astype(float)
        
        X_train_scaled.iloc[:, numerical_indices] = self.scaler.fit_transform(
            X_train.iloc[:, numerical_indices].astype(float)
        )
        X_test_scaled.iloc[:, numerical_indices] = self.scaler.transform(
            X_test.iloc[:, numerical_indices].astype(float)
        )
        
        self.X_train = X_train_scaled
        self.X_test = X_test_scaled
        self.y_train = y_train
        self.y_test = y_test
        
        print("Data preprocessing completed!")
        return X_train_scaled, X_test_scaled, y_train, y_test

    
    def convert_duration_to_minutes(self, duration_str):
        """Convert duration string to minutes"""
        try:
            if 'h' in duration_str and 'm' in duration_str:
                hours = int(duration_str.split('h')[0])
                minutes = int(duration_str.split('h')[1].split('m')[0])
                return hours * 60 + minutes
            elif 'h' in duration_str:
                hours = int(duration_str.split('h')[0])
                return hours * 60
            elif 'm' in duration_str:
                minutes = int(duration_str.split('m')[0])
                return minutes
            else:
                return 0
        except:
            return 0
    
    def train_model(self):
        """Train the Random Forest model"""
        print("Training model...")
        
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(self.X_train, self.y_train)
        
        # Make predictions
        y_pred = self.model.predict(self.X_test)
        
        # Calculate metrics
        mae = mean_absolute_error(self.y_test, y_pred)
        mse = mean_squared_error(self.y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(self.y_test, y_pred)
        
        print(f"Model Training Completed!")
        print(f"Mean Absolute Error: ₹{mae:.2f}")
        print(f"Root Mean Square Error: ₹{rmse:.2f}")
        print(f"R² Score: {r2:.4f}")
        
        return mae, rmse, r2
    
    def save_model(self, filepath=None):
        """Save the trained model and encoders"""
        
        # If no filepath is given OR a directory is passed, save to default file
        if filepath is None or os.path.isdir(filepath):
            filepath = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                "app",
                "models",
                "flight_price_model.joblib"
            )

        model_data = {
            'model': self.model,
            'label_encoders': self.label_encoders,
            'scaler': self.scaler,
            'feature_columns': self.feature_columns
        }

        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}") 
        
    def load_model(self, filepath='flight_price_model.joblib'):
        """Load the trained model and encoders"""
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.label_encoders = model_data['label_encoders']
        self.scaler = model_data['scaler']
        self.feature_columns = model_data['feature_columns']
        print(f"Model loaded from {filepath}")
    
    def predict_price(self, airline, source, destination, date_of_journey, 
                     dep_time, arrival_time, duration, total_stops, additional_info):
        """Predict flight price for given parameters"""
        
        # Preprocess input data
        journey_date = pd.to_datetime(date_of_journey)
        
        # Parse time strings
        def parse_input_time(time_str):
            try:
                if ':' in str(time_str):
                    time_parts = str(time_str).split(':')
                    if len(time_parts) == 2:
                        hour = int(time_parts[0])
                        minute = int(time_parts[1])
                        return hour, minute
                return 0, 0
            except:
                return 0, 0
        
        dep_hour, dep_minute = parse_input_time(dep_time)
        arr_hour, arr_minute = parse_input_time(arrival_time)
        
        # Create feature vector
        features = {}
        
        # Categorical features
        features['Airline_Encoded'] = self.label_encoders['Airline'].transform([airline])[0]
        features['Source_Encoded'] = self.label_encoders['Source'].transform([source])[0]
        features['Destination_Encoded'] = self.label_encoders['Destination'].transform([destination])[0]
        features['Additional_Info_Encoded'] = self.label_encoders['Additional_Info'].transform([additional_info])[0]
        
        # Numerical features
        features['Day_of_Week'] = journey_date.dayofweek
        features['Month'] = journey_date.month
        features['Day'] = journey_date.day
        features['Dep_Hour'] = dep_hour
        features['Dep_Minute'] = dep_minute
        features['Arrival_Hour'] = arr_hour
        features['Arrival_Minute'] = arr_minute
        features['Duration_Minutes'] = self.convert_duration_to_minutes(duration)
        features['Total_Stops'] = total_stops
        features['Route_Count'] = 1  # Assuming direct route
        
        # Create feature array
        feature_array = np.array([[features[col] for col in self.feature_columns]])
        
        # Scale numerical features
        numerical_features = ['Day_of_Week', 'Month', 'Day', 'Dep_Hour', 'Dep_Minute', 
                           'Arrival_Hour', 'Arrival_Minute', 'Duration_Minutes', 
                           'Total_Stops', 'Route_Count']
        numerical_indices = [i for i, col in enumerate(self.feature_columns) if col in numerical_features]
        
        feature_array[:, numerical_indices] = self.scaler.transform(feature_array[:, numerical_indices])
        
        # Make prediction
        predicted_price = self.model.predict(feature_array)[0]
        
        return predicted_price
    
    def plot_feature_importance(self):
        """Plot feature importance"""
        if self.model is None:
            print("Model not trained yet!")
            return
        
        feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        plt.figure(figsize=(12, 8))
        sns.barplot(data=feature_importance.head(15), x='importance', y='feature')
        plt.title('Feature Importance for Flight Price Prediction')
        plt.xlabel('Importance')
        plt.ylabel('Feature')
        plt.tight_layout()
        plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def plot_prediction_vs_actual(self):
        """Plot predicted vs actual prices"""
        if self.model is None:
            print("Model not trained yet!")
            return
        
        y_pred = self.model.predict(self.X_test)
        
        plt.figure(figsize=(10, 6))
        plt.scatter(self.y_test, y_pred, alpha=0.5)
        plt.plot([self.y_test.min(), self.y_test.max()], [self.y_test.min(), self.y_test.max()], 'r--', lw=2)
        plt.xlabel('Actual Price (₹)')
        plt.ylabel('Predicted Price (₹)')
        plt.title('Predicted vs Actual Flight Prices')
        plt.tight_layout()
        plt.savefig('prediction_vs_actual.png', dpi=300, bbox_inches='tight')
        plt.show()

def main():
    """Main function to train and save the model"""
    predictor = FlightPricePredictor()

    train_path = os.path.join(DATA_DIR, "Data_Train.xlsx")

    # Load data
    df = predictor.load_data(train_path)
    
    # Preprocess data
    X_train, X_test, y_train, y_test = predictor.preprocess_data()
    
    # Train model
    mae, rmse, r2 = predictor.train_model()
    
    # Save model
    predictor.save_model()
    
    # Create visualizations
    predictor.plot_feature_importance()
    predictor.plot_prediction_vs_actual()
    
    print("\nModel training and saving completed successfully!")

if __name__ == "__main__":
    main() 