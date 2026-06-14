type GtagWindow = Window & {
  gtag?: (command: string, ...args: unknown[]) => void;
};

export function trackEvent(
  name: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;
  const w = window as GtagWindow;
  if (typeof w.gtag !== 'function') return;
  w.gtag('event', name, params ?? {});
}
