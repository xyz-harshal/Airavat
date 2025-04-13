from flask import Flask, request, jsonify
import mne
import numpy as np
import pandas as pd
import os
from flask_cors import CORS
import torch
import requests
import sys
import json
import traceback
import logging
import pickle
# Import the Net class directly - this is crucial for loading the model
from mdl_4 import Net
# Import timm which is required by the model
import timm

# Add Net to PyTorch's safe globals
torch.serialization.add_safe_globals([Net])

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable CORS for the Flask app
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}}, supports_credentials=True)

# Preprocessing function for .fif EEG files
def preprocess_eeg(file_path):
    # Add validation for missing measurement data in preprocess_eeg
    try:
        raw = mne.io.read_raw_fif(file_path, preload=True)
        if raw.info['nchan'] == 0 or raw.n_times == 0:
            raise ValueError("No measurement data found in the EEG file.")
    except Exception as e:
        return None, f"Failed to load EEG file: {str(e)}"
    
    # Basic preprocessing
    raw.filter(1, 45)  # Bandpass filter (1-45 Hz)
    raw.notch_filter(freqs=[50, 60])  # Remove line noise
    
    # Detect and remove artifacts
    # Check for EOG channels before applying ICA
    if not any(ch for ch in raw.ch_names if 'EOG' in ch):
        logger.info("No EOG channels found. Skipping EOG artifact removal.")
    else:
        ica = mne.preprocessing.ICA(n_components=15, random_state=42)
        ica.fit(raw)
        ica.exclude = []
        # Find and exclude components related to eye blinks/movements
        eog_indices, eog_scores = ica.find_bads_eog(raw)
        ica.exclude = eog_indices
        ica.apply(raw)
    
    return raw, None

# Convert model outputs to condition probabilities
def calculate_condition_probabilities(predictions):
    # Extract votes from the model predictions
    # Assuming predictions has the format: [eeg_id, lpd_vote, gpd_vote, lrda_vote, grda_vote, other_vote]
    lpd_vote = predictions[1]  # Lateralized Periodic Discharges
    gpd_vote = predictions[2]  # Generalized Periodic Discharges
    lrda_vote = predictions[3]  # Lateralized Rhythmic Delta Activity
    grda_vote = predictions[4]  # Generalized Rhythmic Delta Activity
    other_vote = predictions[5]  # Other patterns
    
    # Calculate epilepsy probability (higher weight to GPD and LPD)
    epilepsy_probability = (0.4 * gpd_vote + 0.4 * lpd_vote + 0.2 * lrda_vote) / (gpd_vote + lpd_vote + lrda_vote + 0.001)
    
    # Calculate cognitive stress probability (higher weight to LRDA)
    cognitive_stress_probability = (0.6 * lrda_vote + 0.2 * grda_vote + 0.2 * other_vote) / (lrda_vote + grda_vote + other_vote + 0.001)
    
    # Calculate depression probability (mix of patterns)
    depression_probability = (0.3 * lrda_vote + 0.3 * grda_vote + 0.4 * other_vote) / (lrda_vote + grda_vote + other_vote + 0.001)
    
    # Ensure probabilities are between 0 and 1
    epilepsy_probability = min(max(epilepsy_probability, 0), 1)
    cognitive_stress_probability = min(max(cognitive_stress_probability, 0), 1)
    depression_probability = min(max(depression_probability, 0), 1)
    
    return {
        "epilepsy": float(epilepsy_probability),
        "cognitive_stress": float(cognitive_stress_probability),
        "depression": float(depression_probability)
    }

# Helper function to inspect the model file structure
def inspect_model_file(model_path):
    try:
        # Use a simpler approach that works across PyTorch versions
        try:
            # Try with weights_only=False but catch potential security errors
            loaded = torch.load(model_path, map_location='cpu', weights_only=False)
        except RuntimeError as e:
            if "weights_only" in str(e):
                # For PyTorch versions that enforce weights_only security
                logger.warning("Loading with weights_only=True due to PyTorch security policy")
                loaded = torch.load(model_path, map_location='cpu', weights_only=True)
            else:
                raise
        
        # Collect model info
        model_info = {
            "type": type(loaded).__name__,
            "attributes": []
        }
        
        # Get attributes or keys depending on the type
        if isinstance(loaded, dict):
            model_info["is_dictionary"] = True
            model_info["keys"] = list(loaded.keys())
        else:
            model_info["is_dictionary"] = False
            model_info["attributes"] = [attr for attr in dir(loaded) if not attr.startswith('_')]
            model_info["has_predict"] = hasattr(loaded, "predict")
            model_info["is_callable"] = callable(loaded)
        
        return model_info
    except Exception as e:
        logger.error(f"Error inspecting model: {e}")
        return {"error": str(e), "traceback": traceback.format_exc()}

@app.route('/upload', methods=['POST'])
def upload_eeg():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.endswith('.fif'):
        return jsonify({"error": "Only .fif files are supported"}), 400

    # Save the uploaded file temporarily
    temp_fif_path = "temp_eeg.fif"
    file.save(temp_fif_path)

    try:
        # Process the EEG data
        raw, error = preprocess_eeg(temp_fif_path)
        if error:
            return jsonify({"error": error}), 500

        # Convert raw data to DataFrame and save as .parquet
        raw_data = raw.get_data()
        raw_df = pd.DataFrame(raw_data.T, columns=raw.ch_names)
        parquet_path = "temp_eeg.parquet"
        raw_df.to_parquet(parquet_path)
        
        logger.info(f"Successfully converted .fif to .parquet: {parquet_path}")
        logger.info(f"DataFrame shape: {raw_df.shape}")
        logger.info(f"Column names: {raw_df.columns.tolist()[:10]}...")  # Show first 10 columns

        # Get model info first - attempt to inspect without loading
        model_path = "/home/ghruank/programming/hackathons/airavat/final/single_model.pt"
        model_info = inspect_model_file(model_path)
        logger.info(f"Model info: {json.dumps(model_info, indent=2)}")
        
        # Try multiple approaches to load the model with detailed error reporting
        model_loaded = False
        error_details = []
        predictions = None

        # Approach 1: Direct load with weights_only=False
        try:
            logger.info("Attempting to load model with torch.load and weights_only=False")
            # Add the parent directory to sys.path to find any modules if needed
            sys.path.append(os.path.dirname("/home/ghruank/programming/hackathons/airavat/final/"))
            
            # Use a context manager to allow unsafe loading
            model = torch.load(model_path, map_location='cpu', weights_only=False)
            logger.info(f"Model loaded directly with torch.load, type: {type(model)}")
            
            # Check if predict method exists
            if hasattr(model, 'predict'):
                logger.info("Model has predict method, using it")
                predictions = model.predict(raw_df)
                model_loaded = True
            else:
                logger.warning("Model doesn't have predict method, trying to use it as a callable")
                input_tensor = torch.tensor(raw_df.values, dtype=torch.float32)
                predictions = model(input_tensor)
                if isinstance(predictions, torch.Tensor):
                    predictions = predictions.detach().numpy()
                model_loaded = True
            
        except Exception as std_error:
            error_msg = f"Direct model loading failed: {str(std_error)}\n{traceback.format_exc()}"
            logger.error(error_msg)
            error_details.append({"method": "torch.load direct", "error": error_msg})
            
            # Approach 2: Try loading with torch.jit.load
            try:
                logger.info("Attempting to load model with torch.jit.load")
                model = torch.jit.load(model_path, map_location='cpu')
                logger.info(f"Model loaded with torch.jit.load, type: {type(model)}")
                
                # If successful, prepare input and run model
                input_tensor = torch.tensor(raw_df.values, dtype=torch.float32)
                logger.info(f"Input tensor shape: {input_tensor.shape}")
                
                predictions = model(input_tensor)
                if isinstance(predictions, torch.Tensor):
                    predictions = predictions.detach().numpy()
                    
                logger.info(f"Got predictions with shape: {predictions.shape if hasattr(predictions, 'shape') else 'not a numpy array'}")
                model_loaded = True
                
            except Exception as jit_error:
                error_msg = f"JIT model loading failed: {str(jit_error)}\n{traceback.format_exc()}"
                logger.error(error_msg)
                error_details.append({"method": "torch.jit.load", "error": error_msg})
                
                # Approach 3: Try with pickle directly
                try:
                    logger.info("Attempting to load model directly with pickle")
                    with open(model_path, 'rb') as f:
                        model = pickle.load(f)
                    logger.info(f"Model loaded with pickle directly, type: {type(model)}")
                    
                    # Check if predict method exists
                    if hasattr(model, 'predict'):
                        predictions = model.predict(raw_df)
                        model_loaded = True
                    else:
                        # Try model as a callable
                        input_tensor = torch.tensor(raw_df.values, dtype=torch.float32)
                        predictions = model(input_tensor)
                        if isinstance(predictions, torch.Tensor):
                            predictions = predictions.detach().numpy()
                        model_loaded = True
                        
                except Exception as pickle_error:
                    error_msg = f"Pickle loading failed: {str(pickle_error)}\n{traceback.format_exc()}"
                    logger.error(error_msg)
                    error_details.append({"method": "direct pickle", "error": error_msg})
        
        # If all approaches failed, try one more with a context manager
        if not model_loaded:
            try:
                logger.info("Final attempt: loading with context manager for safe_globals")
                with torch.serialization.safe_globals(['Net']):
                    model = torch.load(model_path, map_location='cpu')
                    
                logger.info(f"Model loaded with safe_globals context, type: {type(model)}")
                
                # Check if predict method exists
                if hasattr(model, 'predict'):
                    predictions = model.predict(raw_df)
                    model_loaded = True
                else:
                    # Try model as a callable
                    input_tensor = torch.tensor(raw_df.values, dtype=torch.float32)
                    predictions = model(input_tensor)
                    if isinstance(predictions, torch.Tensor):
                        predictions = predictions.detach().numpy()
                    model_loaded = True
                    
            except Exception as ctx_error:
                error_msg = f"Context manager loading failed: {str(ctx_error)}\n{traceback.format_exc()}"
                logger.error(error_msg)
                error_details.append({"method": "safe_globals context", "error": error_msg})

        # If all approaches failed, use mock predictions
        if not model_loaded:
            logger.warning("All model loading approaches failed, using mock predictions")
            predictions = np.array([1, 0.3, 0.2, 0.7, 0.4, 0.6])
            
        # Calculate condition probabilities
        condition_probabilities = calculate_condition_probabilities(predictions)
        
        return jsonify({
            "success": True,
            "fif_path": temp_fif_path,
            "parquet_path": parquet_path,
            "model_loaded_successfully": model_loaded,
            "raw_predictions": predictions.tolist() if hasattr(predictions, 'tolist') else predictions,
            "condition_probabilities": condition_probabilities,
            "error_details": error_details if not model_loaded else []
        })
            
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}\n{traceback.format_exc()}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500
    finally:
        # We won't remove the temp files since they might be useful for debugging
        pass

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)