/**
 * Shared scroll / pointer state for the 3D scene.
 *
 * This is deliberately a plain mutable object, NOT React state. Scroll and
 * pointer events fire dozens of times a second; routing them through React
 * would re-render the tree. The render loop reads this object once per frame.
 */

export const input = {
  /** Document scroll progress, 0 (top) .. 1 (bottom). */
  scroll: 0,
  /** Pointer position normalised to -1..1 (y is up). */
  pointerX: 0,
  pointerY: 0,
  /** performance.now() of the last pointer move, used to fade the ripple. */
  lastPointerAt: 0,
};

let listeners = 0;
let maxScroll = 1;
let resizeObserver: ResizeObserver | null = null;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const measure = () => {
  maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
};

const onScroll = () => {
  input.scroll = clamp01(window.scrollY / maxScroll);
};

const onPointerMove = (event: PointerEvent) => {
  input.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
  input.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
  input.lastPointerAt = performance.now();
};

/**
 * Start listening. Reference counted so StrictMode double-mounts and route
 * changes can't leak or double-register listeners. Returns the cleanup.
 */
export const attachInput = (): (() => void) => {
  if (listeners === 0) {
    measure();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Page height changes when images load or the route changes.
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        measure();
        onScroll();
      });
      resizeObserver.observe(document.body);
    }
  }
  listeners += 1;

  return () => {
    listeners -= 1;
    if (listeners > 0) return;

    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', measure);
    window.removeEventListener('pointermove', onPointerMove);
    resizeObserver?.disconnect();
    resizeObserver = null;
  };
};
