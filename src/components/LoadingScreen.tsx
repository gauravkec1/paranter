import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(60);

  useEffect(() => {
    // Fast progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 20;
      });
    }, 50);

    // Force complete after short time
    const timeout = setTimeout(() => {
      setProgress(100);
    }, 500);

    // Emergency backup - if loading screen shows for more than 5 seconds, 
    // something is wrong, so we force reload
    const emergencyTimeout = setTimeout(() => {
      console.error('Loading screen timeout - forcing page reload');
      window.location.reload();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      clearTimeout(emergencyTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Minimal Logo */}
        <div className="w-12 h-12 mx-auto rounded-lg flex items-center justify-center">
          <img src="/src/assets/paranter-logo.png" alt="Paranter Logo" className="h-12 w-12" />
        </div>

        {/* Minimal Text */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">Paranter</h1>
          <p className="text-xs text-muted-foreground">Loading...</p>
        </div>

        {/* Ultra-minimal Progress */}
        <div className="w-48 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-100"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};