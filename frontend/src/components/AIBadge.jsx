import React from 'react';

const AIBadge = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-medium text-white shadow-sm
        bg-gradient-to-r from-purple-500 to-cyan-400
        animate-pulse border border-white/20
        ${sizeClasses[size]} ${className}`}
    >
      <span>✨</span> Smart Pick
    </span>
  );
};

export default AIBadge;
