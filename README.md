# Flight Fare Predictor

This repository contains an end-to-end Flight Fare Prediction application.The project demonstrates the practical application of Machine Learning, REST APIs, and a modern frontend to solve a real-world regression problem.

## Project Overview

The goal of this project is to predict flight ticket prices based on various travel-related parameters such as airline, source, destination, journey date, duration, and number of stops.

The system is divided into three major parts:

- Machine Learning Model
- Backend API
- Frontend UI

## Machine Learning Details

- **Algorithm Used:** Random Forest Regressor
- **Problem Type:** Regression
- **Dataset Size:** ~10,600 flight records
- **Target Variable:** Flight Price

The trained model is serialized using joblib and served through an API.

---

## Project Structure

| Parent Folder | Sub-Modules | Description                                                                                                    |
| ------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| **Backend**   | App         | FastAPI-based backend service that exposes REST APIs to interact with the trained flight fare prediction model |
|               | Models      | Saved trained model files (`.joblib`) used by the API for inference                                            |
|               | ML          | Contains machine learning code including model training, testing, and prediction logic                         |
|               | Data        | Stores training and test datasets used for building and validating the model                                   |
| **Frontend**  | React UI    | React-based web application that allows users to input flight details and view predicted fares                 |

## Technologies Used

#### Backend & Machine Learning

![Python](https://img.shields.io/badge/Python-3.14+-blue?style=flat-square&logo=python)
![Pandas](https://img.shields.io/badge/Pandas--150458?style=flat-square&logo=pandas)
![NumPy](https://img.shields.io/badge/NumPy--013243?style=flat-square&logo=numpy)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-F7931E?style=flat-square&logo=scikit-learn)
![FastAPI](https://img.shields.io/badge/FastAPI--009688?style=flat-square&logo=fastapi)
![Joblib](https://img.shields.io/badge/Joblib--555555?style=flat-square)

#### Frontend

![React](https://img.shields.io/badge/React--61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript--3178C6?style=flat-square&logo=typescript)
![Tailwind%20CSS](https://img.shields.io/badge/Tailwind%20CSS--06B6D4?style=flat-square&logo=tailwindcss)
![Axios](https://img.shields.io/badge/Axios--5A29E4?style=flat-square)

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js (v16+ recommended)
- npm / yarn / pnpm

#### 1. Clone the Repo

```bash
git clone https://github.com/viveek-sh/flight-fare-predictor.git
cd flight-fare-predictor
```

#### 2. Backend Setup

```bash
#cd to backend folder
cd backend

#Create a python virtual environment
python3 -m venv venv

#Activate virtual environment
source venv/bin/activate

#Install Python Dependencies
pip install -r requirements.txt

#Train the Machine Learning Model
python3 ml/train.py

#Start the FastAPI Server
uvicorn app.main:app --reload
#server will start at 'http://127.0.0.1:8000', test in browser 'http://127.0.0.1:8000/docs'
```

> The setup process is slightly different for Windows environments

#### 3. Frontend Setup

```bash
#Open a new terminal and run
cd frontend
npm install
npm run dev

#The frontend UI will be available at http://localhost:5173
```

> Use the Frontend UI or API endpoint to Use the model

```json
#example payload

{
  "airline": "IndiGo",
  "source": "Delhi",
  "destination": "Cochin",
  "date_of_journey": "2024-06-10",
  "dep_time": "10:00",
  "arrival_time": "12:30",
  "duration": "2h 30m",
  "total_stops": 0,
  "additional_info": "No Info"
}
```

## Screenshot

![UI](ui.png)

## Model Performance

The Random Forest Regression model was trained on approximately **10,600 flight records**.

### Evaluation Metrics

- **Mean Absolute Error (MAE):** 695.47
- **Root Mean Square Error (RMSE):** 1654.54
- **R² Score:** 0.87

## Limitations

- Flight duration has a higher influence on predictions than some other features.
- Predictions may fail for cities or routes not seen during training.
- Real-time factors such as demand, holidays, and seat availability are not considered.
