import pandas as pd
import numpy as np
import joblib
from flight_price_model import FlightPricePredictor
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "app", "models")

TEST_DATA_PATH = os.path.join(DATA_DIR, "Data_Test.xlsx")
TRAIN_DATA_PATH = os.path.join(DATA_DIR, "Data_Train.xlsx")
MODEL_PATH = os.path.join(MODEL_DIR, "flight_price_model.joblib")

def test_model_training():
    # Test the model training process
    print("Testing Trainned Model...")
    
    try:
        predictor = FlightPricePredictor()
        
        # Load data
        df = predictor.load_data(TRAIN_DATA_PATH)
        print(f"Data loaded successfully: {df.shape}")
        
        # Preprocess data
        X_train, X_test, y_train, y_test = predictor.preprocess_data()
        print(f"Data preprocessing completed")
        print(f"   Training set: {X_train.shape}")
        print(f"   Test set: {X_test.shape}")
        
        # Train model
        mae, rmse, r2 = predictor.train_model()
        print(f"Model training completed")
        print(f"   MAE: {mae:.2f}")
        print(f"   RMSE: {rmse:.2f}")
        print(f"   R²: {r2:.4f}")
        
        # Save model
        predictor.save_model(MODEL_PATH)
        print("Model saved successfully")
        
        return True
        
    except Exception as e:
        print(f"Error in model training: {e}")
        return False

def test_model_prediction():
    # Test model prediction functionality
    print("Testing Model Prediction...")
    
    try:
        predictor = FlightPricePredictor()
        predictor.load_model(MODEL_PATH)
        
        test_cases = [
            {
                'airline': 'IndiGo',
                'source': 'Delhi',
                'destination': 'Banglore',
                'date_of_journey': '2024-01-15',
                'dep_time': '10:00',
                'arrival_time': '12:00',
                'duration': '2h 0m',
                'total_stops': 0,
                'additional_info': 'No Info'
            },
            {
                'airline': 'Air India',
                'source': 'Mumbai',
                'destination': 'Delhi',
                'date_of_journey': '2024-01-20',
                'dep_time': '14:30',
                'arrival_time': '16:45',
                'duration': '2h 15m',
                'total_stops': 1,
                'additional_info': 'No Info'
            }
        ]
        
        for i, test_case in enumerate(test_cases, 1):
            predicted_price = predictor.predict_price(**test_case)
            print(f"Test Case {i}:")
            print(f"   Route: {test_case['source']} → {test_case['destination']}")
            print(f"   Airline: {test_case['airline']}")
            print(f"   Predicted Price: ₹{predicted_price:,.2f}")
            print()
        
        return True
        
    except Exception as e:
        print(f"Error in model prediction: {e}")
        return False

def test_data_analysis():
    # Test data analysis functionality 
    print("Testing Data Analysis...")
    
    try:
        df = pd.read_excel(TRAIN_DATA_PATH)
        
        print(f"Dataset loaded: {df.shape}")
        print(f"   Columns: {list(df.columns)}")
        print(f"   Price range: ₹{df['Price'].min():,.0f} - ₹{df['Price'].max():,.0f}")
        print(f"   Average price: ₹{df['Price'].mean():,.2f}")
        
        missing_values = df.isnull().sum()
        if missing_values.sum() > 0:
            print(f"Missing values found:")
            for col, count in missing_values.items():
                if count > 0:
                    print(f"   {col}: {count}")
        else:
            print("No missing values found.")
        
        categorical_cols = ['Airline', 'Source', 'Destination', 'Total_Stops']
        for col in categorical_cols:
            unique_count = df[col].nunique()
            print(f"   {col}: {unique_count} unique values")
        
        return True
        
    except Exception as e:
        print(f"Error in data analysis: {e}")
        return False

def main():
    #Run all tests 
    print("Flight Price Predictor - Model Testing")
    print("=" * 50)
    
    data_test = test_data_analysis()
    training_test = test_model_training()
    prediction_test = test_model_prediction()
    
    print("\nTest Results Summary")
    print("=" * 30)
    print(f"Data Analysis: {'PASS' if data_test else 'FAIL'}")
    print(f"Model Training: {'PASS' if training_test else 'FAIL'}")
    print(f"Model Prediction: {'PASS' if prediction_test else 'FAIL'}")
    
    if all([data_test, training_test, prediction_test]):
        print("\nAll tests passed! The model is ready for deployment.")
        print("Run the FastAPI Backend")
    else:
        print("\nSome tests failed. Please check the errors above.")

if __name__ == "__main__":
    main()
