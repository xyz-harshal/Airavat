import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AnalysisResults({ response }) {
  if (!response) return null;

  const { digital_twin, condition_probabilities, interpretation } = response;

  return (
    <Card className="max-w-3xl mx-auto mt-8 bg-gray-50 text-gray-900">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Digital Twin</h3>
            <div className="bg-gray-100 p-4 rounded-md text-sm space-y-4">
              <div>
                <h4 className="font-medium">Asymmetry Metrics</h4>
                <ul className="list-disc pl-5">
                  {Object.entries(digital_twin.asymmetry_metrics).map(([key, value]) => (
                    <li key={key}>
                      <span className="capitalize font-medium">{key.replace('_', ' ')}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium">Biomarkers</h4>
                {Object.entries(digital_twin.biomarkers).map(([condition, metrics]) => (
                  <div key={condition} className="mb-2">
                    <h5 className="capitalize font-medium">{condition.replace('_', ' ')}</h5>
                    <ul className="list-disc pl-5">
                      {Object.entries(metrics).map(([metric, value]) => (
                        <li key={metric}>
                          <span className="capitalize font-medium">{metric.replace('_', ' ')}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-medium">Brain Regions</h4>
                {Object.entries(digital_twin.brain_regions).map(([region, channels]) => (
                  <div key={region} className="mb-2">
                    <h5 className="capitalize font-medium">{region}</h5>
                    {Object.keys(channels).length > 0 ? (
                      <ul className="list-disc pl-5">
                        {Object.entries(channels).map(([channel, bands]) => (
                          <li key={channel}>
                            <span className="font-medium">{channel}:</span> {JSON.stringify(bands)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">No data available</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Condition Probabilities</h3>
            <ul className="bg-gray-100 p-4 rounded-md text-sm">
              {Object.entries(condition_probabilities).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="capitalize font-medium">{key.replace('_', ' ')}</span>
                  <span>{(value * 100).toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Interpretations</h3>
            <ul className="bg-gray-100 p-4 rounded-md text-sm">
              {Object.entries(interpretation).map(([key, value]) => (
                <li key={key} className="mb-2">
                  <span className="capitalize font-medium">{key.replace('_', ' ')}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}