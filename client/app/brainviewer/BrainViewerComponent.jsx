"use client";

import React, { useEffect, useRef, useState } from 'react';

const BrainViewerComponent = () => {
  const vtkContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('Initializing viewer...');
  
  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return;

    // Script-based approach to load VTK.js
    const loadBrainViewer = async () => {
      try {
        // First load the vtk.js library directly
        setLoadingStatus('Loading VTK.js library...');
        
        await new Promise((resolve, reject) => {
          // Check if already loaded
          if (window.vtk) {
            resolve();
            return;
          }
          
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/vtk.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = (err) => reject(new Error('Failed to load vtk.js script'));
          document.body.appendChild(script);
        });
        
        // Now that vtk.js is loaded, use it
        const vtk = window.vtk;
        if (!vtk) {
          throw new Error('VTK.js failed to initialize globally');
        }
        
        setLoadingStatus('Setting up 3D renderer...');
        
        // Create the renderer and render window
        const renderWindow = vtk.Rendering.Core.vtkRenderWindow.newInstance();
        const renderer = vtk.Rendering.Core.vtkRenderer.newInstance({ 
          background: [0.1, 0.1, 0.1] 
        });
        renderWindow.addRenderer(renderer);
        
        // Create the OpenGL render window
        const openGLRenderWindow = vtk.Rendering.OpenGL.vtkRenderWindow.newInstance();
        openGLRenderWindow.setContainer(vtkContainerRef.current);
        renderWindow.addView(openGLRenderWindow);
        
        // Size the render window
        const { width, height } = vtkContainerRef.current.getBoundingClientRect();
        openGLRenderWindow.setSize(width, height);
        
        // Create the interactor
        const interactor = vtk.Rendering.Core.vtkRenderWindowInteractor.newInstance();
        interactor.setView(openGLRenderWindow);
        interactor.initialize();
        interactor.bindEvents(vtkContainerRef.current);
        
        // Set up interactor style
        const interactorStyle = vtk.Interaction.Style.vtkInteractorStyleTrackballCamera.newInstance();
        interactor.setInteractorStyle(interactorStyle);
        
        // Helper function to load a single PLY model
        const loadModel = async (filePath) => {
          setLoadingStatus(`Loading brain model...`);
          
          try {
            const response = await fetch(filePath);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${filePath}: ${response.status}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            
            const reader = vtk.IO.Geometry.vtkPLYReader.newInstance();
            reader.parseAsArrayBuffer(arrayBuffer);
            
            const actor = vtk.Rendering.Core.vtkActor.newInstance();
            const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
            
            mapper.setInputData(reader.getOutputData());
            actor.setMapper(mapper);
            
            // Set a single color for the brain model
            actor.getProperty().setColor(0.8, 0.8, 0.9); // Light blue-gray color
            
            // Add some ambient lighting to see details better
            actor.getProperty().setAmbient(0.3);
            actor.getProperty().setDiffuse(0.7);
            actor.getProperty().setSpecular(0.2);
            
            renderer.addActor(actor);
            
            return actor;
          } catch (e) {
            console.error(`Error loading model ${filePath}:`, e);
            throw e;
          }
        };
        
        // Load a single model
        try {
          // Update this path to your single PLY file
          const brainActor = await loadModel('/brain.ply');
          
          setLoadingStatus('Rendering brain model...');
          
          // Get the camera
          const camera = renderer.getActiveCamera();
          
          // Reset camera to focus on the model
          renderer.resetCamera();
          
          // Adjust camera position for a better view
          // Get the center of the actors
          const bounds = renderer.computeVisiblePropBounds();
          const center = [
            (bounds[0] + bounds[1]) / 2,
            (bounds[2] + bounds[3]) / 2,
            (bounds[4] + bounds[5]) / 2
          ];
          
          // Set focal point to the center of the brain
          camera.setFocalPoint(center[0], center[1], center[2]);
          
          // Position the camera at a distance that shows the entire brain
          const modelSize = Math.max(
            bounds[1] - bounds[0],
            bounds[3] - bounds[2],
            bounds[5] - bounds[4]
          );
          
          // View from front
          camera.setPosition(
            center[0],
            center[1] - modelSize * 1.5, // Position in front
            center[2]
          );
          
          // Set view up direction
          camera.setViewUp(0, 0, 1);
          
          // Reset the camera clipping range
          renderer.resetCameraClippingRange();
          
          // Render the scene
          renderWindow.render();
          
          setIsLoading(false);
          
          // Handle window resize
          const resizeCallback = () => {
            if (vtkContainerRef.current) {
              const { width, height } = vtkContainerRef.current.getBoundingClientRect();
              openGLRenderWindow.setSize(width, height);
              renderer.resetCameraClippingRange();
              renderWindow.render();
            }
          };
          
          window.addEventListener('resize', resizeCallback);
          
          // Return cleanup function
          return () => {
            window.removeEventListener('resize', resizeCallback);
            
            if (interactor) {
              try {
                interactor.unbindEvents();
              } catch (e) {
                console.warn('Error unbinding interactor events:', e);
              }
            }
            
            if (openGLRenderWindow) {
              try {
                openGLRenderWindow.setContainer(null);
              } catch (e) {
                console.warn('Error clearing OpenGL container:', e);
              }
            }
            
            if (renderWindow) {
              try {
                renderWindow.delete();
              } catch (e) {
                console.warn('Error deleting render window:', e);
              }
            }
          };
        } catch (loadError) {
          throw new Error(`Failed to load brain model: ${loadError.message}`);
        }
      } catch (err) {
        console.error('VTK initialization error:', err);
        setError(`${err.message || 'Unknown error initializing 3D viewer'}`);
        setIsLoading(false);
      }
    };
    
    // Give the browser a moment to initialize before setting up VTK
    const timerId = setTimeout(loadBrainViewer, 300);
    
    return () => {
      clearTimeout(timerId);
    };
  }, []);
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div 
        ref={vtkContainerRef}
        style={{ 
          width: '100vw', 
          height: '100vh', 
          overflow: 'hidden',
          backgroundColor: '#000'
        }}
      />
      
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '18px',
          zIndex: 10,
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>{loadingStatus}</div>
          <div style={{ 
            width: '50px',
            height: '50px',
            border: '5px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            borderTopColor: 'white',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}/>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '20px',
          borderRadius: '5px',
          color: 'red',
          maxWidth: '80%',
          width: '400px',
          textAlign: 'center',
          zIndex: 10
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Error Loading Brain Viewer</h3>
          <p style={{ marginBottom: '15px' }}>{error}</p>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                background: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainViewerComponent;
