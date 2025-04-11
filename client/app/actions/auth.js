"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function loginUser(formData) {
  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        username:"",
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return { success: false, message: "Invalid email or password" };
    }
    
    // Store token in cookies or localStorage in the client component
    return { 
      success: true, 
      token: data.token, 
      username: data.username 
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Server error. Please try again later." };
  }
}

export async function registerUser(formData) {
  try {
    const response = await fetch(`${API_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return { success: false, message: "Email already exists or invalid data" };
    }
    
    // Store token in cookies or localStorage in the client component
    return { 
      success: true, 
      token: data.token, 
      username: data.username 
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Server error. Please try again later." };
  }
}