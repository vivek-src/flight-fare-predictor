from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from ml.flight_price_model import FlightPricePredictor

# -------------------------------------------------
# App setup
# -------------------------------------------------
app = FastAPI(title="Flight Fare Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Load model ONCE at startup
# -------------------------------------------------
# main.py is inside backend/app/
# so backend is one level up
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "app",
    "models",
    "flight_price_model.joblib"
)

predictor = FlightPricePredictor()

try:
    predictor.load_model(MODEL_PATH)
    print("✅ Model loaded")
    print("✅ Encoders:", predictor.label_encoders.keys())
except Exception as e:
    raise RuntimeError(f"❌ Failed to load model: {e}")

# -------------------------------------------------
# Request schema (EXACT match)
# -------------------------------------------------
class FlightRequest(BaseModel):
    airline: str
    source: str
    destination: str
    date_of_journey: str
    dep_time: str
    arrival_time: str
    duration: str
    total_stops: int
    additional_info: str

# -------------------------------------------------
# Health check
# -------------------------------------------------
@app.get("/")
def health():
    return {"status": "API is running"}

# -------------------------------------------------
# Prediction endpoint
# -------------------------------------------------
@app.post("/predict")
def predict_flight_price(data: FlightRequest):
    try:
        required_encoders = {"Airline", "Source", "Destination", "Additional_Info"}
        if not required_encoders.issubset(predictor.label_encoders.keys()):
            raise RuntimeError("Model encoders missing. Retrain the model.")

        price = predictor.predict_price(
            airline=data.airline,
            source=data.source,
            destination=data.destination,
            date_of_journey=data.date_of_journey,
            dep_time=data.dep_time,
            arrival_time=data.arrival_time,
            duration=data.duration,
            total_stops=data.total_stops,
            additional_info=data.additional_info
        )

        return {
            "predicted_price": round(float(price), 2)
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
