import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [follower, setFollower] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only initialize custom cursor on fine pointer devices (non-touch)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  // Smooth lag animation for follower ring
  useEffect(() => {
    let animationFrame;
    const follow = () => {
      setFollower((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.25,
        y: prev.y + (position.y - prev.y) * 0.25
      }));
      animationFrame = requestAnimationFrame(follow);
    };
    animationFrame = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animationFrame);
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Central Precision Point */}
      <div
        className="fixed w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 shadow-[0_0_10px_#00F5D4]"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />

      {/* Trailing Holographic Ring */}
      <div
        className={`fixed border rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
          isHovered
            ? 'w-12 h-12 border-cyan-400 bg-cyan-500/10 scale-125 shadow-[0_0_20px_rgba(0,245,212,0.4)]'
            : 'w-8 h-8 border-cyan-500/40 border-dashed scale-100'
        }`}
        style={{ left: `${follower.x}px`, top: `${follower.y}px` }}
      />
    </div>
  );
}
