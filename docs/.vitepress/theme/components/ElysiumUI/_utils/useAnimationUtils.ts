let rafId: number | null = null;

export function useRaf(fn: () => void) {
  if (rafId !== null) return;

  rafId = requestAnimationFrame(() => {
    fn();
    rafId = null;
  });
}
