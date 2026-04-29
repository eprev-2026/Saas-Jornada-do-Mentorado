import React from 'react';

const PillarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.3333 48H2.66667C1.19333 48 0 46.8067 0 45.3333V40H32V45.3333C32 46.8067 30.8067 48 29.3333 48Z" fill="currentColor"/>
        <path d="M32 5.33333V0H0V5.33333C0 6.80667 1.19333 8 2.66667 8H29.3333C30.8067 8 32 6.80667 32 5.33333Z" fill="currentColor"/>
        <rect x="2.66663" y="10.6667" width="2.66667" height="26.6667" fill="currentColor"/>
        <rect x="8" y="10.6667" width="2.66667" height="26.6667" fill="currentColor"/>
        <rect x="13.3334" y="10.6667" width="2.66667" height="26.6667" fill="currentColor"/>
        <rect x="18.6666" y="10.6667" width="2.66667" height="26.6667" fill="currentColor"/>
        <rect x="24" y="10.6667" width="2.66667" height="26.6667" fill="currentColor"/>
        <path d="M29.3334 22.6667H2.66675L16 16L29.3334 22.6667Z" fill="currentColor"/>
    </svg>
);


const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <PillarIcon className="text-yellow-400" />
      <div className="flex flex-col -space-y-1">
        <span className="text-gray-300 text-sm tracking-widest">MENTORIA</span>
        <span className="text-yellow-400 text-3xl font-extrabold tracking-tighter">IMPÉRIO</span>
        <span className="text-gray-300 text-lg font-semibold tracking-wide">PREVIDENCIÁRIO</span>
      </div>
    </div>
  );
};

export default Logo;