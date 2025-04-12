"use server";

const API_URL = process.env.API_URL || "http://localhost:8000";

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