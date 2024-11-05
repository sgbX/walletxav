/**
 * Landing Page of the application for the 3D Scene 
 * Features:
 * -->Enter navigation button to go to the main app
 * -->GSAP for fade in and fade out animations
 */

import '../styles/App.css'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Scene = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, backgroundColor: '#FFFFFF' },
        { opacity: 1, duration: 1.5 }
      );
    }
  }, []);

  const navigateToApp = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 1.5,
        onComplete: () => navigate('/app')
      });
    } else {
      navigate('/app');
    }
  };

  return (
    <main ref={containerRef} className="main landing-page">
      <Scene />
      <div className="button-wrapper">
        <button onClick={navigateToApp} className="landing-page-button">
          <span className="arrow">↗</span> Enter 
        </button>
      </div>
    </main>
  );
};

export default LandingPage;