import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(20); // Start with higher initial progress

  useEffect(() => {
    // Aggressive progress updates for faster perceived loading
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        // Much faster progress increments
        return prev + Math.random() * 25 + 10;
      });
    }, 80); // Faster interval

    // Auto-complete after short duration
    const timeout = setTimeout(() => {
      setProgress(100);
    }, 800); // Much shorter total loading time

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-muted/20 flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Lightweight Logo Animation */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary-glow rounded-xl shadow-lg flex items-center justify-center">
            <Building className="h-8 w-8 text-primary-foreground" />
          </div>
          {/* Removed heavy ping animation for speed */}
        </div>

        {/* Streamlined Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            School Connect
          </h1>
          <p className="text-sm text-muted-foreground">
            Ready in {Math.max(0, Math.round((100 - progress) / 50))}s
          </p>
        </div>

        {/* Ultra-fast Progress Bar */}
        <div className="w-64 mx-auto space-y-1">
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-150 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground/70 text-center">
            {Math.round(Math.min(progress, 100))}%
          </div>
        </div>

        {/* Simplified loading indicator */}
        <div className="flex justify-center">
          <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};