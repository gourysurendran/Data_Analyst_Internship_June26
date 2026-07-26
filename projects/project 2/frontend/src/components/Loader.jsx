import React from 'react';

const Loader = ({ message = "Loading analytical models..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] w-full">
      <div className="relative flex items-center justify-center w-16 h-16">
        {/* Outer glowing ring */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-brand-border border-t-brand-accent animate-spin"></div>
        {/* Inner reverse-spinning ring */}
        <div className="absolute w-8 h-8 rounded-full border-4 border-brand-border border-b-brand-profit animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      <span className="mt-4 text-sm font-medium tracking-wide text-brand-textMuted font-outfit animate-pulse">
        {message}
      </span>
    </div>
  );
};

export default Loader;
