/**
 * This component is to provide us a transition in our intro and to the landingpage
 * Features:
 * -->Used GSAP  to animate the introduction scene such as text and sliders.
 * -> Chaning the colour of bg, and also creating smooth blending of scene intro.
 */

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import LandingPage from '../pages/LandingPage'; 
import '../styles/App.css';

const Scene = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});

interface IntroProps {
  onAnimationComplete?: () => void;
}

const Intro: React.FC<IntroProps> = ({ onAnimationComplete }) => {
  const comp = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t1 = gsap.timeline({
        onComplete: () => {
          setAnimationComplete(true);
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        },
      });
      t1.from('#intro-slider', {
        xPercent: '-100',
        duration: 1.3,
        delay: 0.3,
      })
        .from(['#title-1', '#title-2'], {
          opacity: 0,
          y: '+=30',
          stagger: 0.5,
        })
        .to(['#title-1', '#title-2'], {
          opacity: 0,
          y: '-=30',
          delay: 0.3,
          stagger: 0.5,
        })
        .to('#intro-slider', {
          xPercent: '100',
          duration: 1.3,
          backgroundColor: '#FFFFFF', 
        });
    }, comp);

    return () => ctx.revert();
  }, [onAnimationComplete]);

  if (animationComplete) {
    return <LandingPage />;
  }

  return (
    <div className="relative h-full w-full" ref={comp}>
      <div id="intro-slider" className="h-full w-full bg-custom text-white absolute top-0 left-0 font-pp-neue-montreal-bold z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-9xl" id="title-1">
          Your wallet,
        </h1>
        <h1 className="text-9xl" id="title-2">
          Your <span style={{ color: '#414141' }}>choice</span>.
        </h1>
      </div>
    </div>
  );
};

export default Intro;