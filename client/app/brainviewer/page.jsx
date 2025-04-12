"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Create a placeholder for the loading state
const LoadingPlaceholder = () => (
  <div style={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  }}>
    Loading Brain 3D Viewer...
  </div>
);

// Completely isolate VTK.js in a separate file to avoid any SSR issues
const Brain3DViewer = dynamic(
  () => import('./BrainViewerComponent').catch(err => {
    console.error("Failed to load BrainViewer:", err);
    // Return a fallback component
    return () => (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
        color: 'red',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2>Failed to load 3D Brain Viewer</h2>
        <p>There was an error initializing the 3D viewer. Please check the console for details.</p>
      </div>
    );
  }),
  {
    loading: LoadingPlaceholder,
    ssr: false
  }
);

// Simple wrapper page component
const BrainViewerPage = () => {
  return <Brain3DViewer />;
};

export default BrainViewerPage;
