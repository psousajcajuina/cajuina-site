import { useState, useEffect, useCallback } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  // Inicializa verificando se window existe (SSR-safe)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint;
  });

  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= breakpoint);
  }, [breakpoint]);

  useEffect(() => {
    // Verifica no mount (garante que está sincronizado)
    checkIsMobile();

    // Adiciona listener para mudanças de tamanho
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [checkIsMobile]);

  return isMobile;
}
