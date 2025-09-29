import React, { Suspense, memo } from 'react';
import { LoadingScreen } from './LoadingScreen';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyLoadWrapper = memo(({ children, fallback = <LoadingScreen /> }: LazyLoadWrapperProps) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
});

LazyLoadWrapper.displayName = 'LazyLoadWrapper';