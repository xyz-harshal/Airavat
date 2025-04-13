'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import BrainModel from './BrainModel'; // Assuming BrainModel is in the same directory

export default function BrainViewer() {
  const [brainData, setBrainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeIndex, setTimeIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [colorScale, setColorScale] = useState('rainbow'); // rainbow, heatmap, etc.
  const [tab, setTab] = useState('3d');

  useEffect(() => {
    // Fetch brain data from the API
    const fetchBrainData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/brain/data');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setBrainData(data);
      } catch (err) {
        console.error('Failed to fetch brain data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrainData();
  }, []);

  // Handle animation playback
  useEffect(() => {
    let animationId;

    if (playing && brainData?.times) {
      animationId = setInterval(() => {
        setTimeIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= brainData.activation_data.length) {
            return 0; // Loop back to start
          }
          return nextIndex;
        });
      }, 200); // Update every 200ms
    }

    return () => {
      if (animationId) clearInterval(animationId);
    };
  }, [playing, brainData]);

  // Calculate current time in seconds
  const currentTime = brainData?.times?.[timeIndex] || 0;

  // Create time traces for selected vertex (placeholder for now)
  const timeTrace = brainData?.times?.map((time, i) => ({
    time,
    value: brainData.activation_data[i][0] // Just show first vertex as example
  }));

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Error Loading Brain Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            <p>Make sure the server is running and brain data is available.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Loading Brain Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>3D Brain Activation Viewer</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="3d">3D Model</TabsTrigger>
              <TabsTrigger value="time">Time Trace</TabsTrigger>
            </TabsList>
            
            <TabsContent value="3d" className="w-full">
              <div className="h-[60vh] w-full rounded-md border overflow-hidden">
                <Canvas camera={{ position: [0, 0, 1], fov: 60 }}>
                  <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 2]} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    
                    {brainData && (
                      <BrainModel 
                        vertices={brainData.vertices}
                        faces={brainData.faces}
                        activationData={brainData.activation_data}
                        currentTimeIndex={timeIndex}
                        colorScale={colorScale}
                        scale={1.8}
                      />
                    )}
                    
                    <OrbitControls enablePan enableZoom enableRotate />
                    <Environment preset="sunset" />
                  </Suspense>
                </Canvas>
              </div>
            </TabsContent>
            
            <TabsContent value="time" className="w-full">
              <div className="h-64 w-full rounded-md border p-4">
                {/* Placeholder for time series chart - would use a library like recharts here */}
                <div className="h-full w-full flex items-center justify-center">
                  <p>Time series visualization would be implemented here</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setPlaying(!playing)}
              >
                {playing ? '❚❚' : '▶'}
              </Button>
              <div className="flex-1">
                <Slider 
                  value={[timeIndex]}
                  min={0}
                  max={brainData?.times?.length - 1 || 0}
                  step={1}
                  onValueChange={(value) => setTimeIndex(value[0])}
                />
              </div>
              <span className="text-sm w-16 text-right">
                {currentTime.toFixed(3)} s
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Color Scale:</span>
                <select 
                  value={colorScale}
                  onChange={(e) => setColorScale(e.target.value)}
                  className="text-sm p-1 border rounded"
                >
                  <option value="rainbow">Rainbow</option>
                  <option value="heatmap">Heat Map</option>
                  <option value="blueRed">Blue-Red</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
