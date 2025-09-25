import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(60); // Start even higher

  useEffect(() => {
    // Even faster progress - complete in 300ms
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 40; // Bigger jumps
      });
    }, 30); // Ultra-fast interval

    // Force complete after minimal time
    const timeout = setTimeout(() => {
      setProgress(100);
    }, 300); // Even faster completion

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Minimal Logo */}
        <div className="w-12 h-12 mx-auto bg-primary rounded-lg flex items-center justify-center">
          <Building className="h-6 w-6 text-primary-foreground" />
        </div>

        {/* Minimal Text */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">School Connect</h1>
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