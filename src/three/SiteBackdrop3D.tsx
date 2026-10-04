import React, { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { getInitialTier, type QualityTier } from './quality';

/**
 * Persistent full-viewport 3D backdrop.
 *
 * - The three.js bundle is a separate chunk (React.lazy) fetched only after
 *   the browser is idle, so it never competes with first paint / LCP.
 * - Anything that goes wrong (no WebGL, reduced motion, shader or runtime error,
 *   lost context, slow GPU) ends in the same place: the canvas unmounts and the
 *   regular 2D page is shown. The page content never depends on the canvas.
 */
const Scene3D = lazy(() => import('./Scene3D'));

class SceneErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('3D backdrop failed; falling back to the 2D page.', error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface SiteBackdrop3DProps {
  /** Mount the scene (e.g. only on the home route). Unmounting frees the GPU. */
  active: boolean;
}

export const SiteBackdrop3D: React.FC<SiteBackdrop3DProps> = ({ active }) => {
  const [tier, setTier] = useState<QualityTier | null>(null);
  const [ready, setReady] = useState(false);

  // Decide the tier only when the main thread is idle.
  useEffect(() => {
    if (!active) return undefined;

    const decide = () => setTier((current) => current ?? getInitialTier());

    // Safari has no requestIdleCallback; the typeof check keeps the setTimeout branch reachable for TS.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(decide, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(decide, 800);
    return () => window.clearTimeout(id);
  }, [active]);

  // Leaving the route: release the GPU and reset the fade for the next visit.
  useEffect(() => {
    if (!active) setReady(false);
  }, [active]);

  const mounted = active && tier !== null && tier !== 'none';

  return (
    <div
      aria-hidden="true"
      data-3d-tier={tier ?? 'pending'}
      data-3d-ready={ready ? 'true' : 'false'}
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000 ease-out"
      style={{ opacity: mounted && ready ? 1 : 0 }}
    >
      {mounted && (
        <SceneErrorBoundary onError={() => setTier('none')}>
          <Suspense fallback={null}>
            {/* key={tier}: gl.antialias is fixed at context creation, so a tier change remounts. */}
            <Scene3D
              key={tier}
              tier={tier as Exclude<QualityTier, 'none'>}
              onReady={() => setReady(true)}
              onDegrade={setTier}
            />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </div>
  );
};
