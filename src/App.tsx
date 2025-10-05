import { useState } from "react";
import { Hero } from "./components/Hero";
import { Upload } from "./components/Upload";
import { Status } from "./components/Status";
import { Ahab } from "./components/Ahab";
import { Team } from "./components/Team";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'hero' | 'upload' | 'status' | 'ahab' | 'team'>('hero');

  const navigateToUpload = () => {
    setCurrentPage('upload');
  };

  const navigateToAhab = () => {
    setCurrentPage('ahab');
  };

  const navigateToStatus = () => {
    setCurrentPage('status');
  };

  const navigateToTeam = () => {
    setCurrentPage('team');
  };

  const navigateToHome = () => {
    setCurrentPage('hero');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', position: 'relative' }}>
      {/* Logo Ahab - Header fijo */}
      <div
        onClick={navigateToHome}
        style={{
          position: 'fixed',
          top: '30px',
          left: '30px',
          zIndex: 1000,
          cursor: 'pointer',
          fontFamily: '"Orbitron", "Space Grotesk", "Inter", sans-serif',
          fontSize: '28px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #00d4ff 0%, #7b2ff7 50%, #ff6b6b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          textShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
          transition: 'all 0.3s ease',
          padding: '8px 16px',
          border: '2px solid transparent',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(123, 47, 247, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }}
      >
        <span style={{
          background: 'linear-gradient(135deg, #00d4ff 0%, #7b2ff7 50%, #ff6b6b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          AHAB
        </span>
      </div>

      {/* Botón OUR TEAM - Header fijo derecha */}
      <div
        onClick={navigateToTeam}
        style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          zIndex: 1000,
          cursor: 'pointer',
          fontFamily: '"Space Grotesk", "Inter", sans-serif',
          fontSize: '16px',
          fontWeight: '600',
          color: '#e2e8f0',
          padding: '12px 24px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)';
          e.currentTarget.style.color = '#00d4ff';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.color = '#e2e8f0';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }}
      >
        OUR TEAM
      </div>

      {currentPage === 'hero' && (
        <Hero onNavigateToUpload={navigateToUpload} onNavigateToStatus={navigateToStatus} />
      )}
      {currentPage === 'upload' && (
        <Upload onBackToHome={navigateToHome} onNavigateToStatus={navigateToAhab} />
      )}
      {currentPage === 'status' && (
        <Status onBackToHome={navigateToHome} />
      )}
      {currentPage === 'ahab' && (
        <Ahab onBackToHome={navigateToHome} />
      )}
      {currentPage === 'team' && (
        <Team onBackToHome={navigateToHome} />
      )}
    </div>
  );
}