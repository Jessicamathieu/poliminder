
import React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <>
      <div
        className="absolute inset-x-0 top-0 z-0 h-96"
        style={{
          background: 'linear-gradient(145deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--primary) / 0.0) 70%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 60%, 75% 80%, 0 65%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 z-0 h-96 opacity-50"
        style={{
          background: 'linear-gradient(215deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.0) 70%)',
          clipPath: 'polygon(100% 0, 100% 80%, 50% 70%, 25% 100%, 0 80%, 0 0)',
        }}
      />
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
          {title}
        </h1>
        <div className="flex items-center gap-2">
            {children}
        </div>
      </div>
    </>
  );
}
