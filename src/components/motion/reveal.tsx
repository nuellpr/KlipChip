'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Delay masuk (ms) — pakai untuk efek berurutan antar-elemen. */
  delay?: number;
  /** Jarak geser awal (px) sebelum elemen terlihat. */
  y?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Elemen muncul (fade + geser naik) saat masuk viewport.
 * Ringan: IntersectionObserver sekali pakai + transisi CSS (transform/opacity).
 * Animasi dekoratif dimatikan otomatis lewat prefers-reduced-motion di globals.css.
 */
export function Reveal({ children, delay = 0, y = 18, className = '', style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={
        {
          '--reveal-delay': `${delay}ms`,
          '--reveal-y': `${y}px`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
