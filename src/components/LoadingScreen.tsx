import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-muted/20 flex items-center justify-center">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo Animation */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary-glow rounded-2xl shadow-2xl flex items-center justify-center animate-bounce-gentle">
            <Building className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary-glow rounded-2xl animate-ping opacity-20"></div>
        </div>

        {/* Title with gradient */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-fade-in">
            School Connect
          </h1>
          <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Loading your portal...
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="w-80 mx-auto space-y-2">
          <div className="h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-primary via-primary-glow to-primary rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {Math.round(Math.min(progress, 100))}%
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};