"use server"

const API_URL = process.env.API_URL || 'http://localhost:8000'

export async function fetchPatients() {
  try {
    const response = await fetch(`${API_URL}/api/patients`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw error
  }
}

export async function createPatient(patientData) {
  try {
    // Validate that the uid is included in the data
    if (!patientData.uid) {
      throw new Error("User ID (uid) is required");
    }

    const response = await fetch(`${API_URL}/api/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API error: ${response.status}${
          errorData ? ` - ${errorData.detail}` : ""
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating patient record:", error);
    throw error;
  }
}

export async function savePatientAnalysis(patientId, userId, analysisData) {
  try {
    // Validate required fields
    if (!patientId) {
      throw new Error("Patient ID is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Prepare the request payload
    const payload = {
      patient_id: patientId,
      user_id: userId,
      raw_predictions: analysisData.raw,
      condition_probabilities: analysisData.percentage,
      medication: analysisData.medication,
      ai_content: analysisData.ai_content
    };

    const response = await fetch(`${API_URL}/api/patients/save-analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API error: ${response.status}${
          errorData ? ` - ${errorData.detail}` : ""
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving patient analysis data:", error);
    throw error;
  }
}

export async function savePatientAnalysisByName(patientName, userId, analysisData) {
  try {
    // Validate required fields
    if (!patientName) {
      throw new Error("Patient name is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Prepare the request payload
    const payload = {
      patient_name: patientName,
      user_id: userId,
      raw_predictions: analysisData.raw,
      condition_probabilities: analysisData.percentage,
      medication: analysisData.medication,
      ai_content: analysisData.ai_content
    };

    const response = await fetch(`${API_URL}/api/patients/save-analysis-by-name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API error: ${response.status}${
          errorData ? ` - ${errorData.detail}` : ""
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving patient analysis data:", error);
    throw error;
  }
}