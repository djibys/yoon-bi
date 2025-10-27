import React from 'react';
import logo from '../assets/logo.png';
import './Logo.css';

interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({ size = 48, className = '', style = {} }) => {
  return (
    <div 
      className={`logo-container ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      <img 
        src={logo} 
        alt="Yoon-Bi Logo"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          borderRadius: '8px',
          imageRendering: 'crisp-edges',
          backgroundColor: 'transparent'
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0id2l2ZSB3aXRoLWljb25zIj48cGF0aCBkPSJNMTIsMkExMCwxMCAwIDAsMTIgMjIsQTEwLDEwIDAgMCwxIDEyLDJBMTAsMTAgMCAwLDEgMTIsMk0xMiw0QTgsOCAwIDAsMCAxMiwyMEE4LDAgMCwwLDAgMTIsNE0xMiw2QTEsMSAwIDAsMSAxMyw3QTEsMSAwIDAsMSAxMiw4QTEsMSAwIDAsMSAxMSw3QTEsMSAwIDAsMSAxMiw2TTcsOUEzLDMgMCAwLDEgMTAsNkMxMCw0LjM0IDguNjYsMyA3LDMuQTUsNSAwIDAsMCAxLjUsOC41QTEuNzUsMS43NSAwIDAsMSAwLDYuNzVBNSw1IDAgMCwxIDUuNSwxLjI1QTgsOCAwIDAsMSAxMyw5VjlBMSwxIDAgMCwxIDEyLDEwQTEsMSAwIDAsMSAxMSw5WiIvPjwvc3ZnPg=='
        }}
      />
    </div>
  );
};
