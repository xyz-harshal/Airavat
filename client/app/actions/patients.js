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
    const response = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating patient:', error)
    throw error
  }
}