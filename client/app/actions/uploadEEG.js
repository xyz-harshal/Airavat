"use server";

/**
 * Server action to upload EEG data for a specific patient
 * Sends the EEG file, patient ID, patient name, and analysis type to the Flask server
 */
export async function uploadEEGData(formData) {
  try {
    if (!formData) {
      throw new Error("No form data provided");
    }
    console.log("Form data:", formData);

    // Make the request to the Flask server
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Log the detailed response data
    console.log("EEG Analysis Results:", JSON.stringify(result, null, 2));
    console.log("Model loaded successfully:", result.model_loaded_successfully);
    console.log("Raw predictions:", result.raw_predictions);
    console.log("Condition probabilities:", result.condition_probabilities);
    
    if (result.error_details && result.error_details.length > 0) {
      console.warn("Error details from server:", result.error_details);
    }
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error uploading EEG data:', error);
    return {
      success: false,
      error: error.message || "Failed to upload EEG data"
    };
  }
}