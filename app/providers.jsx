'use client';

// Remove any theme provider imports

export function Providers({ children }) {
  return (
    // Remove ThemeProvider wrapper if it exists
    <>
      {children}
    </>
  );
} 