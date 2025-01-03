from flask import Flask, request, jsonify
import pickle
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Load the models
final_model_file = 'uts_elon_model.pkl'
conductivity_model_file = 'conductivity_model_4.pkl'
rev_model_file = 'rev_models_1.pkl'
elongation_model_file = 'elongation_prediction_model.pkl'
uts_model_file = 'uts_prediction_model.pkl'

with open(final_model_file, 'rb') as file:
    final_model = pickle.load(file)

with open(conductivity_model_file, 'rb') as file:
    conductivity_model = pickle.load(file)

with open(rev_model_file, 'rb') as file:
    rev_models = pickle.load(file)

elongation_model = joblib.load(elongation_model_file)
uts_model = joblib.load(uts_model_file)

print(type(rev_models)) 

# Ensure the reverse model file is valid
if not isinstance(rev_models, dict):
    raise ValueError("The loaded file does not contain a dictionary of reverse models.")

# Define the prediction route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from the form (JSON)
        data = request.json
        input_data = pd.DataFrame([data])

        # Feature order for final_model and conductivity_model
        model_features = [
            'emulsion_temp', 'emulsion_pr', 'rod_quench_cw_exit',
            'casting_wheel_rpm', 'cast_bar_entry_temp', 'rod_quench_cw_entry',
            'metal_temp', 'cool_water_flow', 'rm_motor_cooling_water_pressure',
            'cooling_water_pressure', 'cooling_water_temp', 'rolling_mill_rpm',
            'rolling_mill_amp', 'si', 'fe'
        ]

        # Reorder the columns in input_data to match the feature order used during model training
        model_input = input_data[model_features]

        # Predictions from final_model
        final_predictions = final_model.predict(model_input)
        uts_pred = final_predictions[0][0]  # First value in the prediction (UTS)
        elongation_pred = final_predictions[0][1]  # Second value in the prediction (Elongation)

        # Prediction from conductivity_model
        conductivity_pred = conductivity_model.predict(model_input)[0]

        # Return predictions as JSON
        return jsonify({
            'uts': uts_pred,
            'elongation': elongation_pred,
            'conductivity': conductivity_pred
        })

    except Exception as e:
        return jsonify({'error': str(e)})

# Define the reverse prediction route
reverse_model_features = ['uts', 'elongation', 'conductivity']

@app.route('/reverse_predict', methods=['POST'])
def reverse_predict():
    try:
        # Get input data
        data = request.json
        input_data = pd.DataFrame([data])  # Convert input to DataFrame

        # Ensure input data has the correct structure
        input_data = input_data[reverse_model_features]

        # Make predictions for each target
        predictions = {}
        for target, model in rev_models.items():
            predictions[target] = model.predict(input_data)[0]  # Extract the scalar value

        # Return predictions as JSON
        return jsonify(predictions)

    except Exception as e:
        return jsonify({'error': str(e)})

# Define the elongation prediction route
@app.route('/elongation_predict', methods=['POST'])
def elongation_predict():
    try:
        # Get input data from the request
        data = request.get_json()
        if 'uts' not in data:
            return jsonify({'error': 'Missing "uts" in request data'}), 400

        uts = float(data['uts'])  # Convert input to float

        # Predict elongation
        prediction = elongation_model.predict([[uts]])

        # Return the prediction
        return jsonify({
            'uts': uts,
            'elongation_prediction': round(prediction[0], 2)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Define the UTS prediction route
@app.route('/uts_predict', methods=['POST'])
def uts_predict():
    try:
        # Get input data from the request
        data = request.get_json()
        if 'elongation' not in data:
            return jsonify({'error': 'Missing "elongation" in request data'}), 400

        elongation = float(data['elongation'])  # Convert input to float

        # Predict UTS
        prediction = uts_model.predict([[elongation]])

        # Return the prediction
        return jsonify({
            'elongation': elongation,
            'uts_prediction': round(prediction[0], 2)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Run the app
if __name__ == '__main__':
    app.run(debug=True)