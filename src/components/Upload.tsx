import { useState } from 'react';

interface UploadProps {
  onBackToHome: () => void;
  onNavigateToStatus: () => void;
}

// Componente de partícula flotante (mismo del Hero)
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

// Componente de línea orbital (mismo del Hero)
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
        animation: 'orbitalPulse 8s ease-in-out infinite',
        zIndex: 0
      }}
    />
  );
};

export function Upload({ onBackToHome, onNavigateToStatus }: UploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generar partículas flotantes suaves (mismas que el Hero)
  const particles = Array.from({ length: 18 }, (_, i) => ({
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleAnalyzeData = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onNavigateToStatus();
    }, 4000);
  };

  // Pantalla de loading con estilo espacial
  if (isAnalyzing) {
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
        color: 'white',
        textAlign: 'center',
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

        {/* Partículas flotantes */}
        {particles.slice(0, 12).map(particle => (
          <FloatingParticle
            key={particle.id}
            initialX={particle.x}
            initialY={particle.y}
            color={particle.color}
            size={particle.size}
            delay={particle.delay}
          />
        ))}

        <div style={{ position: 'relative', zIndex: 10, marginTop: '120px' }}>
          {/* Telescopio animado */}
          <div style={{ 
            fontSize: '6rem', 
            marginBottom: '30px',
            animation: 'telescopeRotate 4s ease-in-out infinite'
          }}>🔭</div>
          
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            marginBottom: '25px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #7b2ff7 50%, #ff6b6b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            textShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
            fontFamily: '"Orbitron", "Space Grotesk", sans-serif',
            animation: 'textPulse 3s ease-in-out infinite'
          }}>
            Buscando Exoplanetas
          </h2>
          
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.4rem)', 
            color: '#8b92a8',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            animation: 'fadeInUp 1s ease-out 0.5s both'
          }}>
            Analizando patrones de tránsito en tu dataset...
          </p>

          {/* Barra de progreso simulada */}
          <div style={{
            width: '300px',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            margin: '40px auto 0',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #00d4ff, #7b2ff7, #00ff88)',
              borderRadius: '4px',
              animation: 'progressFlow 4s ease-in-out infinite'
            }} />
          </div>
        </div>

        {/* CSS para loading */}
        <style>{`
          @keyframes telescopeRotate {
            0%, 100% { transform: rotate(-5deg) scale(1); }
            50% { transform: rotate(5deg) scale(1.1); }
          }
          
          @keyframes textPulse {
            0%, 100% { opacity: 0.9; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
          }
          
          @keyframes progressFlow {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  // Pantalla principal de upload con estilo espacial
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

      {/* Contenido central */}
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '900px',
        position: 'relative',
        zIndex: 10,
        width: '100%',
        marginTop: '120px'
      }}>
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
          animation: 'breathe 8s ease-in-out infinite',
          zIndex: -1
        }} />

        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
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
          animation: 'titleGlow 4s ease-in-out infinite alternate'
        }}>
          Upload Your Dataset
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          color: '#e2e8f0',
          marginBottom: '40px',
          lineHeight: '1.6',
          maxWidth: '700px',
          margin: '0 auto 40px',
          fontWeight: '400',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          animation: 'fadeInUp 1s ease-out 0.5s both'
        }}>
          Unleash the power of machine learning on your exoplanet data. Our AI will analyze transit patterns and classify candidates with{' '}
          <span style={{
            background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700'
          }}>
            scientific precision
          </span>.
        </p>

        {/* Zona de carga de archivo mejorada */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.03) 0%, rgba(123, 47, 247, 0.03) 100%)',
          border: selectedFile ? '3px solid #00d4ff60' : '3px dashed #4a556880',
          borderRadius: '20px',
          padding: '60px 40px',
          marginBottom: '40px',
          position: 'relative',
          backdropFilter: 'blur(10px)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          transition: 'all 0.3s ease',
          animation: selectedFile ? 'uploadSuccess 6s ease-in-out infinite' : 'uploadIdle 8s ease-in-out infinite',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          if (!selectedFile) {
            e.currentTarget.style.borderColor = '#00d4ff40';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(123, 47, 247, 0.05) 100%)';
          }
        }}
        onMouseLeave={(e) => {
          if (!selectedFile) {
            e.currentTarget.style.borderColor = '#4a556880';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 212, 255, 0.03) 0%, rgba(123, 47, 247, 0.03) 100%)';
          }
        }}
        >
          {selectedFile ? (
            <div style={{ animation: 'fadeInUp 0.5s ease-out both' }}>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '20px',
                animation: 'fileSuccess 2s ease-in-out infinite'
              }}>📊</div>
              <div style={{ 
                color: '#00ff88', 
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {selectedFile.name}
              </div>
              <div style={{ 
                color: '#8b92a8', 
                fontSize: '0.9rem',
                opacity: 0.8
              }}>
                Ready for exoplanet analysis
              </div>
            </div>
          ) : (
            <div>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '20px',
                animation: 'folderFloat 4s ease-in-out infinite'
              }}>🗂️</div>
              <div style={{ 
                color: 'white', 
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', 
                marginBottom: '12px',
                fontWeight: '600'
              }}>
                Select your CSV dataset
              </div>
              <div style={{ 
                color: '#8b92a8', 
                fontSize: '0.9rem',
                opacity: 0.8
              }}>
                Drag & drop or click to browse
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Botón de análisis mejorado */}
        <button
          onClick={handleAnalyzeData}
          disabled={!selectedFile}
          style={{
            background: selectedFile ? 
              'linear-gradient(135deg, #0066ff 0%, #7b2ff7 50%, #00d4ff 100%)' : 
              'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '24px 48px',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            fontWeight: '700',
            cursor: selectedFile ? 'pointer' : 'not-allowed',
            minWidth: '320px',
            minHeight: '80px',
            position: 'relative',
            overflow: 'hidden',
            opacity: selectedFile ? 1 : 0.5,
            boxShadow: selectedFile ? `
              0 0 30px rgba(0, 212, 255, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            ` : `0 4px 16px rgba(0, 0, 0, 0.3)`,
            transition: 'all 0.3s ease',
            animation: selectedFile ? 'buttonReady 6s ease-in-out infinite' : 'none',
            fontFamily: '"Space Grotesk", sans-serif',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            if (selectedFile) {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = `
                0 0 40px rgba(0, 212, 255, 0.5),
                0 12px 40px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `;
            }
          }}
          onMouseLeave={(e) => {
            if (selectedFile) {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `
                0 0 30px rgba(0, 212, 255, 0.3),
                0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `;
            }
          }}
        >
          {/* Efecto de brillo interno */}
          {selectedFile && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              animation: 'buttonShimmer 8s ease-in-out infinite'
            }} />
          )}
          
          <span style={{ position: 'relative', zIndex: 1 }}>
            🧠 Analyze with AI
          </span>
        </button>

        {/* Información adicional */}
        <div style={{
          marginTop: '50px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          color: '#8b92a8',
          animation: 'fadeInUp 1s ease-out 1.5s both'
        }}>
          💡 <strong style={{ color: '#00d4ff' }}>Expected format:</strong> CSV with transit light curves, stellar parameters, and candidate metadata. 
          Our XGBoost model will extract features and classify exoplanet candidates automatically.
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

        @keyframes orbitalPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.1; }
        }

        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes titleGlow {
          0% { text-shadow: 0 0 30px rgba(0, 212, 255, 0.3); }
          100% { text-shadow: 0 0 40px rgba(123, 47, 247, 0.4), 0 0 60px rgba(0, 212, 255, 0.2); }
        }

        @keyframes uploadIdle {
          0%, 100% { 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% { 
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }
        }

        @keyframes uploadSuccess {
          0%, 100% { 
            box-shadow: 0 8px 32px rgba(0, 255, 136, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          50% { 
            box-shadow: 0 12px 40px rgba(0, 255, 136, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25);
          }
        }

        @keyframes folderFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        @keyframes fileSuccess {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(5deg); }
        }

        @keyframes buttonReady {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.4), 0 12px 40px rgba(0, 0, 0, 0.4);
          }
        }

        @keyframes buttonShimmer {
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