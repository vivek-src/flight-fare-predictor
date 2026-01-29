from flight_price_model import main as train_model_main
from test_model import main as test_model_main

def main():
    print("Start Trainning (flight_price_model.py)")
    train_model_main()

    print("\n\n Running Tests (test_model.py)")
    test_model_main()

    print("\nAll done.")

if __name__ == "__main__":
    main()
