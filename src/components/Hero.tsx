import { useEffect, useState } from 'react';

interface HeroProps {
  onNavigateToUpload: () => void;
  onNavigateToStatus: () => void;
}

// Componente de partícula flotante simple
const FloatingParticle = ({ 
  initialX, 
  initialY, 
  color, 
  size,
  delay 
}: {
  initialX: number;
  initialY: number;
  color: string;
  size: number;
  delay: number;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${initialX}%`,
        top: `${initialY}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color}80 0%, ${color}50 50%, transparent 100%)`,
        borderRadius: '50%',
        boxShadow: `0 0 ${size * 2}px ${color}60`,
        animation: `gentleFloat 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        zIndex: 1,
        filter: 'blur(0.2px)',
        opacity: 0.7
      }}
    />
  );
};

// Componente de línea de conexión orbital
const OrbitalLine = ({ 
  startX, 
  startY, 
  endX, 
  endY, 
  opacity 
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  opacity: number;
}) => {
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${length}px`,
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, #00d4ff${Math.floor(opacity * 255).toString(16)} 50%, transparent 100%)`,
        transformOrigin: '0 0',
        transform: `rotate(${angle}deg)`,
        animation: 'pulse 8s ease-in-out infinite',
        zIndex: 0
      }}
    />
  );
};

export function Hero({ onNavigateToUpload, onNavigateToStatus }: HeroProps) {

  // Generar partículas flotantes suaves
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: ['#00d4ff', '#7b2ff7', '#00ff88', '#ff6b6b', '#ffd700'][Math.floor(Math.random() * 5)],
    size: Math.random() * 12 + 6, // Tamaños entre 6-18px (dos veces más grandes)
    delay: Math.random() * 8 // Delay para que no todas se muevan igual
  }));

  // Generar líneas orbitales
  const orbitalLines = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    endX: Math.random() * 100,
    endY: Math.random() * 100,
    opacity: Math.random() * 0.3 + 0.1
  }));

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: `
        radial-gradient(ellipse at top, #1a1a2e 0%, #0f0a1a 50%, #000000 100%),
        radial-gradient(ellipse at bottom right, #16213e20 0%, transparent 70%),
        radial-gradient(ellipse at top left, #7b2ff720 0%, transparent 70%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Space Grotesk", "Inter", sans-serif'
    }}>
      
      {/* Patrón de grid técnico */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridPulse 12s ease-in-out infinite',
        zIndex: 0
      }} />

      {/* Patrón de puntos técnicos */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle, rgba(123, 47, 247, 0.1) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        backgroundPosition: '40px 40px',
        animation: 'dotShift 25s linear infinite',
        zIndex: 0
      }} />

      {/* Partículas flotantes */}
      {particles.map(particle => (
        <FloatingParticle
          key={particle.id}
          initialX={particle.x}
          initialY={particle.y}
          color={particle.color}
          size={particle.size}
          delay={particle.delay}
        />
      ))}

      {/* Líneas orbitales */}
      {orbitalLines.map(line => (
        <OrbitalLine
          key={line.id}
          startX={line.startX}
          startY={line.startY}
          endX={line.endX}
          endY={line.endY}
          opacity={line.opacity}
        />
      ))}

      {/* Elemento central estático */}
      <div 
        style={{ 
          textAlign: 'center', 
          maxWidth: '900px',
          padding: '40px',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Halo de fondo para el contenido */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
          background: 'radial-gradient(ellipse, rgba(0, 212, 255, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'breathe 6s ease-in-out infinite',
          zIndex: -1
        }} />

        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          background: 'linear-gradient(135deg, #00d4ff 0%, #7b2ff7 50%, #ff6b6b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '25px',
          fontWeight: '900',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          textShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
          fontFamily: '"Orbitron", "Space Grotesk", sans-serif',
          animation: 'textGlow 3s ease-in-out infinite alternate'
        }}>
          Discover the Universe's Hidden Worlds with AI
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.4rem)',
          color: '#e2e8f0',
          marginBottom: '25px',
          lineHeight: '1.6',
          maxWidth: '750px',
          margin: '0 auto 25px',
          fontWeight: '400',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          animation: 'fadeInUp 1s ease-out 0.5s both'
        }}>
          Unlock the Kepler, K2, and TESS archives. Our ML model leverages NASA's open-source data to classify exoplanetary transits with{' '}
          <span style={{
            background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700'
          }}>
            95.7% AUC
          </span>.
        </p>

        <div style={{
          fontSize: '1.1rem',
          color: '#a78bfa',
          fontStyle: 'italic',
          marginBottom: '45px',
          fontWeight: '500',
          textShadow: '0 0 10px rgba(167, 139, 250, 0.3)',
          animation: 'fadeInUp 1s ease-out 1s both'
        }}>
          "Automating the next era of cosmic discovery."
        </div>

        {/* Botón principal con efectos avanzados */}
        <button
          onClick={onNavigateToUpload}
          style={{
            background: 'linear-gradient(135deg, #0066ff 0%, #7b2ff7 50%, #00d4ff 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '24px 48px',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            fontWeight: '700',
            cursor: 'pointer',
            minWidth: '320px',
            minHeight: '80px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `
              0 0 30px rgba(0, 212, 255, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 1s ease-out 1.5s both',
            fontFamily: '"Space Grotesk", sans-serif',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = `
              0 0 40px rgba(0, 212, 255, 0.5),
              0 12px 40px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `
              0 0 30px rgba(0, 212, 255, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `;
          }}
        >
          {/* Efecto de brillo interno */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            animation: 'shimmer 8s ease-in-out infinite'
          }} />
          
          <span style={{ position: 'relative', zIndex: 1 }}>
            🚀 Upload your CSV
          </span>
        </button>

        {/* Botón secundario discreto para ver datos existentes */}
        <div style={{ marginTop: '30px' }}>
          <button
            onClick={onNavigateToStatus}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#8b92a8',
              border: '2px solid rgba(139, 146, 168, 0.3)',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '220px',
              minHeight: '60px',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              animation: 'fadeInUp 1s ease-out 2s both',
              fontFamily: '"Space Grotesk", sans-serif',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 146, 168, 0.15)';
              e.currentTarget.style.color = '#e2e8f0';
              e.currentTarget.style.borderColor = 'rgba(139, 146, 168, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `
                0 4px 20px rgba(139, 146, 168, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.15)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#8b92a8';
              e.currentTarget.style.borderColor = 'rgba(139, 146, 168, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }}
          >
            📊 View Existing Data
          </button>
        </div>

        {/* Indicadores de datos flotantes */}
        <div style={{
          marginTop: '60px',
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap',
          animation: 'fadeInUp 1s ease-out 2s both'
        }}>
          {[
            { label: 'Kepler Objects', value: '4,000+', color: '#00d4ff' },
            { label: 'Confirmed Exoplanets', value: '549', color: '#00ff88' },
            { label: 'ML Accuracy', value: '95.7%', color: '#7b2ff7' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${stat.color}40`,
              borderRadius: '12px',
              padding: '16px 24px',
              textAlign: 'center',
              minWidth: '140px',
              animation: `pulse 6s ease-in-out infinite ${index * 1.5}s`
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '900',
                color: stat.color,
                marginBottom: '4px',
                fontFamily: '"Orbitron", monospace'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { 
            transform: translateY(0px); 
            opacity: 0.6; 
          }
          50% { 
            transform: translateY(-12px); 
            opacity: 0.9; 
          }
        }

        @keyframes gridPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.05; }
        }

        @keyframes dotShift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(80px, 80px); }
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.1);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.01);
            box-shadow: 0 6px 25px rgba(0, 212, 255, 0.2);
          }
        }

        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes textGlow {
          0% { text-shadow: 0 0 30px rgba(0, 212, 255, 0.3); }
          100% { text-shadow: 0 0 40px rgba(123, 47, 247, 0.4), 0 0 60px rgba(0, 212, 255, 0.2); }
        }

        @keyframes shimmer {
          0% { left: -100%; opacity: 0; }
          15% { opacity: 0.15; }
          25% { left: 50%; opacity: 0.3; }
          35% { opacity: 0.15; }
          50% { left: 100%; opacity: 0; }
          100% { left: 100%; opacity: 0; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}