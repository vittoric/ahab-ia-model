import { useEffect, useState } from 'react';
import { motion } from "motion/react";
import teamImage from "figma:asset/8fc910e08c562619d408391f49ffce454215e68e.png";

interface TeamProps {
  onBackToHome: () => void;
}

// Componente de partícula flotante (igual al Hero)
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

// Componente de línea orbital
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

export function Team({ onBackToHome }: TeamProps) {
  // Generar partículas flotantes suaves
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: ['#00d4ff', '#7b2ff7', '#00ff88', '#ff6b6b', '#ffd700'][Math.floor(Math.random() * 5)],
    size: Math.random() * 12 + 6,
    delay: Math.random() * 8
  }));

  // Generar líneas orbitales
  const orbitalLines = Array.from({ length: 6 }, (_, i) => ({
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
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      padding: '20px'
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

      {/* Contenido principal */}
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '1000px',
        position: 'relative',
        zIndex: 10,
        width: '100%',
        marginTop: '100px'
      }}>
        {/* Halo de fondo para el contenido */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
          background: 'radial-gradient(ellipse, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'breathe 6s ease-in-out infinite',
          zIndex: -1
        }} />

        {/* Título del equipo */}
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          background: 'linear-gradient(135deg, #ffd700 0%, #ff6b6b 30%, #7b2ff7 70%, #00d4ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '30px',
          fontWeight: '900',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          textShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
          fontFamily: '"Orbitron", "Space Grotesk", sans-serif',
          animation: 'teamGlow 4s ease-in-out infinite alternate'
        }}>
          Team Pequod
        </h1>

        {/* Descripción del equipo - placeholder para ahora */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '50px',
          boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
          animation: 'fadeInUp 1s ease-out 0.5s both'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            background: 'linear-gradient(135deg, #7b2ff7 0%, #ff6b6b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '25px',
            fontWeight: '700',
            fontFamily: '"Orbitron", sans-serif',
            textShadow: '0 0 20px rgba(123, 47, 247, 0.3)'
          }}>
            About Our Team
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            color: '#e2e8f0',
            lineHeight: '1.7',
            margin: '0 auto',
            maxWidth: '800px',
            textAlign: 'left'
          }}>
            We are two young voyagers of knowledge, driven by curiosity and a deep fascination with artificial intelligence.
            <br/><br/>
            Aboard our ship, the Pequod, we sail through the cosmic ocean in search of new planets — worlds of data, ideas, and unexplored possibilities.
            <br/><br/>
            At the heart of our journey stands AHAB, our AI model, trained to detect signals among the stars and guide us through the infinite unknown. Every discovery is tested — we submit AHAB to a constant benchmark against other models, measuring its strength, precision, and exploratory spirit.
            <br/><br/>
            In this voyage, we hunt not for whales, but for patterns, habitable worlds within the digital universe, and new ways to understand intelligence.
            <br/><br/>
            <em style={{ color: '#ffd700', fontStyle: 'italic' }}>Our destination is unwritten.</em>
          </p>
          
          {/* Foto del equipo con efecto elegante */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.6,
              ease: "easeOut"
            }}
            style={{
              marginTop: '40px',
              position: 'relative',
              display: 'inline-block'
            }}
          >
            {/* Contenedor con glassmorphism */}
            <div style={{
              position: 'relative',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.4s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 35px 70px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.25)';
            }}
            >
              {/* Imagen */}
              <img
                src={teamImage}
                alt="Team Pequod - Naval officers ready for cosmic exploration"
                style={{
                  width: '350px',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  filter: 'brightness(1.05) contrast(1.1)',
                  transition: 'all 0.4s ease'
                }}
              />
              
              {/* Subtle gradient overlay */}
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                right: '8px',
                bottom: '8px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(123, 47, 247, 0.1) 0%, transparent 50%, rgba(0, 212, 255, 0.1) 100%)',
                pointerEvents: 'none'
              }} />
            </div>
          </motion.div>
        </div>

        {/* Sección del Challenge */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '50px',
          boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
          animation: 'fadeInUp 1s ease-out 1s both'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            background: 'linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '25px',
            fontWeight: '700',
            fontFamily: '"Orbitron", sans-serif',
            textShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
          }}>
            About the Challenge
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#e2e8f0',
            lineHeight: '1.7',
            textAlign: 'left',
            maxWidth: '900px',
            margin: '0 auto 40px auto'
          }}>
            <strong style={{ color: '#00ff88' }}>NASA Space Apps Challenge 2024:</strong> Create an AI/ML model that automatically analyzes space-based exoplanet survey data to accurately identify new planets outside our solar system. With thousands of exoplanets discovered manually, advances in artificial intelligence now enable automatic analysis of large datasets from missions like Kepler, revolutionizing how we discover worlds beyond Earth. <em style={{ color: '#a78bfa' }}>(NASA Astrophysics Division)</em>
          </p>

          {/* Botón de demo dentro del card */}
          <button
            onClick={onBackToHome}
            style={{
              background: 'linear-gradient(135deg, #0066ff 0%, #7b2ff7 50%, #00d4ff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '20px 40px',
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              fontWeight: '700',
              cursor: 'pointer',
              minWidth: '280px',
              minHeight: '70px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `
                0 0 30px rgba(0, 212, 255, 0.3),
                0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              transition: 'all 0.3s ease',
              fontFamily: '"Space Grotesk", sans-serif',
              letterSpacing: '0.5px',
              margin: '0 auto',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
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
            {/* Efecto de shimmer */}
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
              🚀 Go to Demo
            </span>
          </button>
        </div>



        {/* Footer con créditos */}
        <div style={{
          marginTop: '60px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          color: '#8b92a8',
          animation: 'fadeInUp 1s ease-out 2s both'
        }}>
          <p style={{ margin: 0 }}>
            🌟 <strong style={{ color: '#ffd700' }}>NASA Space Apps Challenge 2024</strong> • 
            Built with React, TypeScript & Machine Learning • 
            Powered by passion for space exploration
          </p>
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

        @keyframes teamGlow {
          0% { text-shadow: 0 0 30px rgba(255, 215, 0, 0.3); }
          100% { text-shadow: 0 0 40px rgba(255, 107, 107, 0.4), 0 0 60px rgba(255, 215, 0, 0.2); }
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