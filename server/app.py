from flask import Flask, request, jsonify
import mne
import numpy as np
import pandas as pd
import pickle
import os
import json
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC

app = Flask(__name__)

# Load models (in a real application, you'd store and load these properly)
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# This would be populated after training
MODELS = {
    "epilepsy": None,
    "cognitive_stress": None,
    "depression": None
}

# Preprocessing function
def preprocess_eeg(file_path):
    # Add validation for missing measurement data in preprocess_eeg
    try:
        raw = mne.io.read_raw_fif(file_path, preload=True)
        if raw.info['nchan'] == 0 or raw.n_times == 0:
            raise ValueError("No measurement data found in the EEG file.")
    except Exception as e:
        return jsonify({"error": f"Failed to load EEG file: {str(e)}"}), 400
    
    # Basic preprocessing
    raw.filter(1, 45)  # Bandpass filter (1-45 Hz)
    raw.notch_filter(freqs=[50, 60])  # Remove line noise
    
    # Detect and remove artifacts
    # Check for EOG channels before applying ICA
    if not any(ch for ch in raw.ch_names if 'EOG' in ch):
        print("No EOG channels found. Skipping EOG artifact removal.")
    else:
        ica = mne.preprocessing.ICA(n_components=15, random_state=42)
        ica.fit(raw)
        ica.exclude = []
        # Find and exclude components related to eye blinks/movements
        eog_indices, eog_scores = ica.find_bads_eog(raw)
        ica.exclude = eog_indices
        ica.apply(raw)
    
    return raw

# Feature extraction function
from mne.time_frequency import psd_array_welch

def extract_features(raw):
    # Extract power spectral density features
    psd, freqs = psd_array_welch(raw.get_data(), sfreq=raw.info['sfreq'], fmin=1, fmax=45, 
                                             n_fft=2048, n_overlap=1024)
    
    # Calculate band powers
    delta_idx = np.logical_and(freqs >= 1, freqs <= 4)
    theta_idx = np.logical_and(freqs >= 4, freqs <= 8)
    alpha_idx = np.logical_and(freqs >= 8, freqs <= 13)
    beta_idx = np.logical_and(freqs >= 13, freqs <= 30)
    gamma_idx = np.logical_and(freqs >= 30, freqs <= 45)
    
    # Extract mean band power for each channel
    features = {}
    for i, ch_name in enumerate(raw.ch_names):
        features[f"{ch_name}_delta"] = np.mean(psd[i, delta_idx])
        features[f"{ch_name}_theta"] = np.mean(psd[i, theta_idx])
        features[f"{ch_name}_alpha"] = np.mean(psd[i, alpha_idx])
        features[f"{ch_name}_beta"] = np.mean(psd[i, beta_idx])
        features[f"{ch_name}_gamma"] = np.mean(psd[i, gamma_idx])
        features[f"{ch_name}_theta_beta_ratio"] = features[f"{ch_name}_theta"] / features[f"{ch_name}_beta"]
    
    # Add condition-specific features
    features = add_epilepsy_specific_features(raw, features)
    features = add_cognitive_stress_features(raw, features)
    features = add_depression_features(raw, features)
    
    return features

# Condition-specific feature extraction functions
def add_epilepsy_specific_features(raw, features):
    # Line length (good for seizure detection)
    data = raw.get_data()
    for i, ch_name in enumerate(raw.ch_names):
        # Calculate line length in windows
        window_size = int(raw.info['sfreq'] * 2)  # 2-second windows
        n_windows = data.shape[1] // window_size
        
        line_lengths = []
        for w in range(n_windows):
            segment = data[i, w*window_size:(w+1)*window_size]
            line_length = np.sum(np.abs(np.diff(segment)))
            line_lengths.append(line_length)
        
        features[f"{ch_name}_line_length_mean"] = np.mean(line_lengths)
        features[f"{ch_name}_line_length_var"] = np.var(line_lengths)
    
    return features

def add_cognitive_stress_features(raw, features):
    # Frontal alpha asymmetry (indicator of stress)
    frontal_left = [ch for ch in raw.ch_names if ch.startswith('F') and ch[1:].isdigit() and int(ch[1:]) % 2 != 0]
    frontal_right = [ch for ch in raw.ch_names if ch.startswith('F') and ch[1:].isdigit() and int(ch[1:]) % 2 == 0]
    
    # Calculate average alpha power in left vs right frontal regions if channels exist
    if frontal_left and frontal_right:
        alpha_left = np.mean([features[f"{ch}_alpha"] for ch in frontal_left if f"{ch}_alpha" in features])
        alpha_right = np.mean([features[f"{ch}_alpha"] for ch in frontal_right if f"{ch}_alpha" in features])
        
        # Asymmetry index
        if alpha_right + alpha_left > 0:
            features['frontal_alpha_asymmetry'] = (alpha_right - alpha_left) / (alpha_right + alpha_left)
    
    # Theta/beta ratio at Fz (if available) - indicator of attention/focus
    if 'Fz_theta' in features and 'Fz_beta' in features:
        features['fz_theta_beta_ratio'] = features['Fz_theta'] / features['Fz_beta']
    
    return features

def add_depression_features(raw, features):
    # Alpha asymmetry (frontal and parietal) - key depression biomarker
    
    # Frontal asymmetry
    f3_alpha = features.get('F3_alpha', 0)
    f4_alpha = features.get('F4_alpha', 0)
    if f3_alpha > 0 and f4_alpha > 0:
        features['frontal_alpha_asymmetry_depression'] = np.log(f4_alpha) - np.log(f3_alpha)
    
    # Parietal asymmetry
    p3_alpha = features.get('P3_alpha', 0)
    p4_alpha = features.get('P4_alpha', 0)
    if p3_alpha > 0 and p4_alpha > 0:
        features['parietal_alpha_asymmetry'] = np.log(p4_alpha) - np.log(p3_alpha)
    
    # Theta connectivity between frontal and parietal regions
    frontal_channels = [ch for ch in raw.ch_names if ch.startswith('F')]
    parietal_channels = [ch for ch in raw.ch_names if ch.startswith('P')]
    
    # Add average theta power in key regions if channels exist
    if frontal_channels:
        features['avg_frontal_theta'] = np.mean([features[f"{ch}_theta"] for ch in frontal_channels 
                                               if f"{ch}_theta" in features])
    if parietal_channels:
        features['avg_parietal_theta'] = np.mean([features[f"{ch}_theta"] for ch in parietal_channels 
                                                if f"{ch}_theta" in features])
    
    return features

# Model training functions (these would be used initially to train your models)
def train_epilepsy_model(X_train, y_train):
    model = xgb.XGBClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        objective='binary:logistic'
    )
    model.fit(X_train, y_train)
    return model

def train_cognitive_stress_model(X_train, y_train):
    model = SVC(kernel='rbf', C=1.0, gamma='scale', probability=True)
    model.fit(X_train, y_train)
    return model

def train_depression_model(X_train, y_train):
    model = GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=3,
        random_state=42
    )
    model.fit(X_train, y_train)
    return model

# Function to create a digital twin representation
def create_digital_twin(features, condition_probabilities):
    # In a full implementation, this would be more sophisticated
    # For the hackathon, we'll create a simplified digital twin representation
    
    # Extract key brain regions and their activity levels
    regions = {
        "frontal": {},
        "temporal": {},
        "parietal": {},
        "occipital": {}
    }
    
    # Populate regions with relevant features
    for feature_name, value in features.items():
        parts = feature_name.split('_')
        if len(parts) >= 2:
            channel = parts[0]
            band = parts[1]
            
            # Map channel to region
            if channel.startswith('F'):
                region = "frontal"
            elif channel.startswith('T'):
                region = "temporal"
            elif channel.startswith('P'):
                region = "parietal"
            elif channel.startswith('O'):
                region = "occipital"
            else:
                continue
            
            # Store band power
            if band in ['delta', 'theta', 'alpha', 'beta', 'gamma']:
                if channel not in regions[region]:
                    regions[region][channel] = {}
                regions[region][channel][band] = value
    
    # Create the digital twin representation
    digital_twin = {
        "brain_regions": regions,
        "condition_probabilities": condition_probabilities,
        "asymmetry_metrics": {
            "frontal_alpha_asymmetry": features.get("frontal_alpha_asymmetry", 0),
            "parietal_alpha_asymmetry": features.get("parietal_alpha_asymmetry", 0)
        },
        "biomarkers": {
            "epilepsy": {
                "line_length_variability": np.mean([v for k, v in features.items() if "line_length_var" in k])
            },
            "cognitive_stress": {
                "frontal_theta_beta_ratio": features.get("fz_theta_beta_ratio", 0)
            },
            "depression": {
                "frontal_alpha_asymmetry": features.get("frontal_alpha_asymmetry_depression", 0)
            }
        }
    }
    
    return digital_twin

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
    temp_path = "temp_eeg.fif"
    file.save(temp_path)
    
    try:
        # Process the EEG data
        raw = preprocess_eeg(temp_path)
        features = extract_features(raw)
        
        # Convert features dictionary to a vector for model input
        feature_df = pd.DataFrame([features])
        
        # Predict conditions
        condition_probabilities = {}
        
        # Check if models exist before prediction
        if MODELS["epilepsy"]:
            epilepsy_prob = MODELS["epilepsy"].predict_proba(feature_df)[0][1]
            condition_probabilities["epilepsy"] = float(epilepsy_prob)
        else:
            # For demo purposes, generate random probability
            condition_probabilities["epilepsy"] = float(np.random.random() * 0.3)  # Lower probability for demo
        
        if MODELS["cognitive_stress"]:
            stress_prob = MODELS["cognitive_stress"].predict_proba(feature_df)[0][1]
            condition_probabilities["cognitive_stress"] = float(stress_prob)
        else:
            # For demo purposes
            condition_probabilities["cognitive_stress"] = float(np.random.random() * 0.5)
        
        if MODELS["depression"]:
            depression_prob = MODELS["depression"].predict_proba(feature_df)[0][1]
            condition_probabilities["depression"] = float(depression_prob)
        else:
            # For demo purposes
            condition_probabilities["depression"] = float(np.random.random() * 0.4)
        
        # Create the digital twin
        digital_twin = create_digital_twin(features, condition_probabilities)
        
        # Return the analysis results
        return jsonify({
            "success": True,
            "digital_twin": digital_twin,
            "condition_probabilities": condition_probabilities,
            "interpretation": {
                "epilepsy": interpret_epilepsy_risk(condition_probabilities["epilepsy"]),
                "cognitive_stress": interpret_stress_level(condition_probabilities["cognitive_stress"]),
                "depression": interpret_depression_risk(condition_probabilities["depression"])
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

# Interpretation functions
def interpret_epilepsy_risk(probability):
    if probability < 0.2:
        return "Low risk of epileptic patterns detected."
    elif probability < 0.5:
        return "Moderate indicators of potential epileptic activity. Further monitoring recommended."
    else:
        return "High probability of epileptic patterns detected. Clinical evaluation strongly recommended."

def interpret_stress_level(probability):
    if probability < 0.3:
        return "Low cognitive stress levels detected."
    elif probability < 0.6:
        return "Moderate cognitive stress indicators present."
    else:
        return "High cognitive stress patterns detected."

def interpret_depression_risk(probability):
    if probability < 0.3:
        return "Low probability of depression-related EEG patterns."
    elif probability < 0.6:
        return "Moderate indicators of depression-related EEG patterns. Further assessment recommended."
    else:
        return "Strong indicators of depression-related EEG patterns. Clinical evaluation recommended."

# API endpoint to simulate a medication or intervention
@app.route('/simulate_intervention', methods=['POST'])
def simulate_intervention():
    data = request.json
    if not data or 'digital_twin' not in data or 'intervention' not in data:
        return jsonify({"error": "Invalid request data"}), 400
    
    digital_twin = data['digital_twin']
    intervention = data['intervention']
    
    # In a real application, you would have a more sophisticated simulation model
    # For the hackathon, we'll use a simplified approach
    
    # Example simulated effects for different interventions
    simulated_effects = {
        "epilepsy": {
            "anticonvulsant_medication": {
                "effect_multiplier": 0.6,  # Reduces epilepsy probability by 40%
                "affected_biomarkers": ["line_length_variability"],
                "biomarker_effects": {"line_length_variability": 0.7}  # Reduces by 30%
            },
            "ketogenic_diet": {
                "effect_multiplier": 0.8,  # Reduces epilepsy probability by 20%
                "affected_biomarkers": ["line_length_variability"],
                "biomarker_effects": {"line_length_variability": 0.85}  # Reduces by 15%
            }
        },
        "cognitive_stress": {
            "mindfulness_training": {
                "effect_multiplier": 0.7,  # Reduces stress probability by 30%
                "affected_biomarkers": ["frontal_theta_beta_ratio"],
                "biomarker_effects": {"frontal_theta_beta_ratio": 1.2}  # Increases by 20%
            },
            "stress_medication": {
                "effect_multiplier": 0.5,  # Reduces stress probability by 50%
                "affected_biomarkers": ["frontal_theta_beta_ratio"],
                "biomarker_effects": {"frontal_theta_beta_ratio": 1.4}  # Increases by 40%
            }
        },
        "depression": {
            "ssri_medication": {
                "effect_multiplier": 0.6,  # Reduces depression probability by 40%
                "affected_biomarkers": ["frontal_alpha_asymmetry"],
                "biomarker_effects": {"frontal_alpha_asymmetry": 0.7}  # Reduces asymmetry by 30%
            },
            "cbt_therapy": {
                "effect_multiplier": 0.8,  # Reduces depression probability by 20%
                "affected_biomarkers": ["frontal_alpha_asymmetry"],
                "biomarker_effects": {"frontal_alpha_asymmetry": 0.9}  # Reduces asymmetry by 10%
            }
        }
    }
    
    # Check if the intervention exists in our simulation database
    intervention_type = intervention.get("type", "")
    target_condition = intervention.get("target_condition", "")
    
    if target_condition not in simulated_effects or intervention_type not in simulated_effects[target_condition]:
        return jsonify({"error": "Unknown intervention or target condition"}), 400
    
    # Get the intervention effects
    effects = simulated_effects[target_condition][intervention_type]
    
    # Create a copy of the digital twin to simulate changes
    simulated_twin = json.loads(json.dumps(digital_twin))  # Deep copy
    
    # Apply effects to condition probabilities
    if target_condition in simulated_twin["condition_probabilities"]:
        original_prob = simulated_twin["condition_probabilities"][target_condition]
        simulated_twin["condition_probabilities"][target_condition] = original_prob * effects["effect_multiplier"]
    
    # Apply effects to biomarkers
    for biomarker in effects["affected_biomarkers"]:
        if biomarker in simulated_twin["biomarkers"][target_condition]:
            original_value = simulated_twin["biomarkers"][target_condition][biomarker]
            simulated_twin["biomarkers"][target_condition][biomarker] = original_value * effects["biomarker_effects"][biomarker]
    
    # Return the simulated results
    return jsonify({
        "original_digital_twin": digital_twin,
        "simulated_digital_twin": simulated_twin,
        "intervention": intervention,
        "estimated_improvement": {
            "condition_probability_change": {
                target_condition: {
                    "before": digital_twin["condition_probabilities"][target_condition],
                    "after": simulated_twin["condition_probabilities"][target_condition],
                    "percent_change": ((digital_twin["condition_probabilities"][target_condition] - 
                                      simulated_twin["condition_probabilities"][target_condition]) / 
                                      digital_twin["condition_probabilities"][target_condition]) * 100
                }
            },
            "biomarker_changes": {
                biomarker: {
                    "before": digital_twin["biomarkers"][target_condition].get(biomarker, 0),
                    "after": simulated_twin["biomarkers"][target_condition].get(biomarker, 0),
                    "percent_change": ((digital_twin["biomarkers"][target_condition].get(biomarker, 0) - 
                                       simulated_twin["biomarkers"][target_condition].get(biomarker, 0)) / 
                                       digital_twin["biomarkers"][target_condition].get(biomarker, 1)) * 100
                } for biomarker in effects["affected_biomarkers"]
            }
        }
    })

# API endpoint for model training (for demonstration purposes)
@app.route('/train_models', methods=['POST'])
def train_models_endpoint():
    # In a real application, this would load actual training data
    # For the hackathon, this is a placeholder to demonstrate functionality
    
    try:
        # Simulate training data
        # In reality, you would load labeled EEG data and extract features
        np.random.seed(42)
        n_samples = 100
        n_features = 50
        
        # Generate random feature names (this would be your actual feature set)
        feature_names = [f"feature_{i}" for i in range(n_features)]
        
        # Create synthetic training data
        X = np.random.rand(n_samples, n_features)
        X_df = pd.DataFrame(X, columns=feature_names)
        
        # Create synthetic labels
        y_epilepsy = np.random.binomial(1, 0.3, n_samples)  # 30% positive rate
        y_stress = np.random.binomial(1, 0.4, n_samples)    # 40% positive rate
        y_depression = np.random.binomial(1, 0.25, n_samples)  # 25% positive rate
        
        # Train the models
        MODELS["epilepsy"] = train_epilepsy_model(X_df, y_epilepsy)
        MODELS["cognitive_stress"] = train_cognitive_stress_model(X_df, y_stress)
        MODELS["depression"] = train_depression_model(X_df, y_depression)
        
        # Save the models (in a real app, you'd use proper versioning and storage)
        with open(os.path.join(MODEL_DIR, "epilepsy_model.pkl"), 'wb') as f:
            pickle.dump(MODELS["epilepsy"], f)
        with open(os.path.join(MODEL_DIR, "cognitive_stress_model.pkl"), 'wb') as f:
            pickle.dump(MODELS["cognitive_stress"], f)
        with open(os.path.join(MODEL_DIR, "depression_model.pkl"), 'wb') as f:
            pickle.dump(MODELS["depression"], f)
        
        return jsonify({
            "success": True,
            "message": "Models trained successfully",
            "models": list(MODELS.keys())
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Load existing models if available
def load_models():
    for condition in MODELS.keys():
        model_path = os.path.join(MODEL_DIR, f"{condition}_model.pkl")
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                MODELS[condition] = pickle.load(f)
                print(f"Loaded model for {condition}")

# API endpoint to get brain regions of interest for a condition
@app.route('/brain_regions_of_interest', methods=['GET'])
def brain_regions_of_interest():
    condition = request.args.get('condition')
    if not condition:
        return jsonify({"error": "Condition parameter required"}), 400
    
    # Define regions of interest for each condition
    regions = {
        "epilepsy": {
            "primary": ["temporal", "frontal"],
            "secondary": ["central", "parietal"],
            "channels": {
                "high_importance": ["T3", "T4", "F7", "F8"],
                "medium_importance": ["C3", "C4", "P3", "P4"]
            },
            "description": "Epileptic activity often originates in the temporal lobe, but can spread to other regions. Focal seizures may show distinctive patterns in specific channels."
        },
        "cognitive_stress": {
            "primary": ["prefrontal", "frontal"],
            "secondary": ["parietal"],
            "channels": {
                "high_importance": ["Fp1", "Fp2", "F3", "F4", "Fz"],
                "medium_importance": ["P3", "P4", "Pz"]
            },
            "description": "Cognitive stress typically manifests in prefrontal and frontal regions with characteristic changes in alpha and beta band activity."
        },
        "depression": {
            "primary": ["prefrontal", "frontal"],
            "secondary": ["parietal", "anterior cingulate"],
            "channels": {
                "high_importance": ["F3", "F4", "Fp1", "Fp2"],
                "medium_importance": ["P3", "P4", "Cz"]
            },
            "description": "Depression-related EEG patterns often show frontal alpha asymmetry and changes in prefrontal activity."
        }
    }
    
    if condition not in regions:
        return jsonify({"error": "Unknown condition"}), 400
    
    return jsonify({
        "condition": condition,
        "regions_of_interest": regions[condition]
    })

# API endpoint to get recommendations based on analysis
@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    data = request.json
    if not data or 'condition_probabilities' not in data:
        return jsonify({"error": "Invalid request data"}), 400
    
    condition_probabilities = data['condition_probabilities']
    recommendations = {
        "clinical": [],
        "lifestyle": [],
        "monitoring": []
    }
    
    # Generate recommendations based on detected probabilities
    # Epilepsy recommendations
    epilepsy_prob = condition_probabilities.get("epilepsy", 0)
    if epilepsy_prob > 0.7:
        recommendations["clinical"].append({
            "type": "immediate_referral",
            "description": "Urgent referral to a neurologist for comprehensive evaluation.",
            "priority": "high"
        })
    elif epilepsy_prob > 0.4:
        recommendations["clinical"].append({
            "type": "specialist_consultation",
            "description": "Consultation with a neurologist to evaluate potential epileptic activity.",
            "priority": "medium"
        })
    
    if epilepsy_prob > 0.3:
        recommendations["monitoring"].append({
            "type": "continued_eeg",
            "description": "Regular EEG monitoring to track potential epileptiform activity.",
            "frequency": "monthly"
        })
        recommendations["lifestyle"].append({
            "type": "sleep_hygiene",
            "description": "Maintain regular sleep patterns as sleep deprivation can trigger seizures.",
            "priority": "medium"
        })
    
    # Cognitive stress recommendations
    stress_prob = condition_probabilities.get("cognitive_stress", 0)
    if stress_prob > 0.6:
        recommendations["clinical"].append({
            "type": "psychological_evaluation",
            "description": "Psychological evaluation to assess stress levels and coping mechanisms.",
            "priority": "medium"
        })
        recommendations["lifestyle"].append({
            "type": "mindfulness_practice",
            "description": "Daily mindfulness meditation to reduce stress levels.",
            "frequency": "daily",
            "duration": "15-30 minutes"
        })
    elif stress_prob > 0.3:
        recommendations["lifestyle"].append({
            "type": "stress_management",
            "description": "Implement stress management techniques such as deep breathing exercises.",
            "frequency": "daily"
        })
    
    # Depression recommendations
    depression_prob = condition_probabilities.get("depression", 0)
    if depression_prob > 0.7:
        recommendations["clinical"].append({
            "type": "psychiatric_evaluation",
            "description": "Comprehensive psychiatric evaluation for depression assessment and treatment.",
            "priority": "high"
        })
    elif depression_prob > 0.4:
        recommendations["clinical"].append({
            "type": "psychological_counseling",
            "description": "Psychological counseling to evaluate and address potential depression.",
            "priority": "medium"
        })
    
    if depression_prob > 0.3:
        recommendations["lifestyle"].append({
            "type": "physical_activity",
            "description": "Regular physical activity to help improve mood and reduce depression symptoms.",
            "frequency": "3-5 times per week",
            "duration": "30 minutes"
        })
        recommendations["monitoring"].append({
            "type": "mood_tracking",
            "description": "Daily mood tracking to monitor emotional patterns.",
            "frequency": "daily"
        })
    
    return jsonify({
        "condition_probabilities": condition_probabilities,
        "recommendations": recommendations,
        "overall_risk_assessment": calculate_overall_risk(condition_probabilities)
    })

# Helper function to calculate overall risk
def calculate_overall_risk(condition_probabilities):
    # Simple weighted average for overall risk
    weights = {
        "epilepsy": 0.4,
        "cognitive_stress": 0.3,
        "depression": 0.3
    }
    
    overall_risk = sum(condition_probabilities.get(condition, 0) * weight 
                     for condition, weight in weights.items())
    
    if overall_risk < 0.3:
        risk_level = "low"
        description = "Low overall risk detected. Continue regular monitoring."
    elif overall_risk < 0.6:
        risk_level = "moderate"
        description = "Moderate overall risk. Follow recommended actions and consider follow-up evaluation."
    else:
        risk_level = "high"
        description = "High overall risk detected. Clinical evaluation strongly recommended."
    
    return {
        "risk_score": overall_risk,
        "risk_level": risk_level,
        "description": description
    }

# API endpoint for longitudinal analysis
@app.route('/longitudinal_analysis', methods=['POST'])
def longitudinal_analysis():
    data = request.json
    if not data or 'historical_data' not in data:
        return jsonify({"error": "Historical data required"}), 400
    
    historical_data = data['historical_data']
    
    # Analyze trends over time
    trends = {}
    for condition in ["epilepsy", "cognitive_stress", "depression"]:
        # Extract probabilities over time
        timestamps = []
        probabilities = []
        
        for entry in historical_data:
            if 'timestamp' in entry and 'condition_probabilities' in entry:
                if condition in entry['condition_probabilities']:
                    timestamps.append(entry['timestamp'])
                    probabilities.append(entry['condition_probabilities'][condition])
        
        if len(probabilities) > 1:
            # Calculate trend (simple linear regression)
            x = np.arange(len(probabilities))
            slope, intercept = np.polyfit(x, probabilities, 1)
            
            # Determine trend direction
            if slope > 0.05:
                trend_direction = "increasing"
                concern_level = "high" if probabilities[-1] > 0.5 else "moderate"
            elif slope < -0.05:
                trend_direction = "decreasing"
                concern_level = "low"
            else:
                trend_direction = "stable"
                concern_level = "medium" if probabilities[-1] > 0.4 else "low"
            
            trends[condition] = {
                "trend_direction": trend_direction,
                "slope": float(slope),
                "latest_value": probabilities[-1],
                "concern_level": concern_level,
                "data_points": len(probabilities)
            }
    
    # Generate insights based on trends
    insights = []
    for condition, trend in trends.items():
        if trend["trend_direction"] == "increasing" and trend["concern_level"] in ["moderate", "high"]:
            insights.append(f"{condition.capitalize()} indicators show an increasing trend that requires attention.")
        elif trend["trend_direction"] == "decreasing":
            insights.append(f"{condition.capitalize()} indicators show improvement over time.")
    
    return jsonify({
        "trends": trends,
        "insights": insights,
        "recommendation": generate_longitudinal_recommendation(trends)
    })

def generate_longitudinal_recommendation(trends):
    recommendations = []
    
    # Generate specific recommendations based on trends
    for condition, trend in trends.items():
        if trend["trend_direction"] == "increasing" and trend["concern_level"] == "high":
            if condition == "epilepsy":
                recommendations.append({
                    "condition": condition,
                    "action": "clinical_intervention",
                    "description": "Schedule a neurological evaluation within 2 weeks due to increasing epilepsy indicators.",
                    "urgency": "high"
                })
            elif condition == "cognitive_stress":
                recommendations.append({
                    "condition": condition,
                    "action": "intervention_program",
                    "description": "Begin a structured stress reduction program to address increasing stress indicators.",
                    "urgency": "medium"
                })
            elif condition == "depression":
                recommendations.append({
                    "condition": condition,
                    "action": "mental_health_evaluation",
                    "description": "Schedule a mental health evaluation to address increasing depression indicators.",
                    "urgency": "high"
                })
    
    # General recommendations based on data availability
    if all(trend["data_points"] < 5 for trend in trends.values()):
        recommendations.append({
            "condition": "general",
            "action": "increased_monitoring",
            "description": "Increase EEG monitoring frequency to establish a more robust baseline.",
            "urgency": "medium"
        })
    
    return recommendations

# Initialize the app
@app.before_request
def initialize():
    load_models()

if __name__ == '__main__':
    # Ensure model directory exists
    os.makedirs(MODEL_DIR, exist_ok=True)
    # Load existing models if available
    load_models()
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)