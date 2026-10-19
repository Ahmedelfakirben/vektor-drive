import React from 'react';
import logoSvg from '../../assets/logo.svg';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'badge' | 'print';
}

const Logo201M: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'default' }) => {
  const sizes = {
    xs: { height: '24px' },
    sm: { height: '36px' },
    md: { height: '52px' },
    lg: { height: '72px' },
    xl: { height: '110px' }
  };

  const curr = sizes[size];

  if (variant === 'badge' || variant === 'print') {
    return (
      <div className={`logo-badge ${className}`} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '6px',
        width: 'fit-content'
      }}>
        <img 
          src="/logo.png" 
          alt="Vektor Drive" 
          style={{ height: curr.height, width: 'auto', objectFit: 'contain', borderRadius: '14px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)' }} 
        />
      </div>
    );
  }

  return (
    <div className={className} style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img 
        src="/logo.png" 
        alt="Vektor Drive" 
        style={{ height: curr.height, width: 'auto', objectFit: 'contain', borderRadius: '10px' }} 
      />
    </div>
  );
};

export default Logo201M;
