import ResizeObserver from 'resize-observer-polyfill';

export interface ScroomOptions<T extends Element> {
  target: T;
  offset?: number;
  threshold?: number;
}

export type ScroomOnProgressCallback<T> = (progress: number, el: T) => void;
export type ScrollOnEnterCallback<T> = (el: T) => void;
export type ScrollOnLeaveCallback<T> = ScrollOnEnterCallback<T>;
export type DebugCallback = (info: {
  intersection: IntersectionObserverEntry;
  offsetTop: number;
  progress: number;
  action: 'enter' | 'progress' | 'leave';
}) => void;

function genRange(start: number, stop: number, step = 1) {
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
}

const getClosest = (goal: number, ...counts: number[]) => {
  return counts.reduce((prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev));
};

export function setup<T extends Element>(options: ScroomOptions<T>) {
  // ---------------------------------------------------------------------------
  // Parsing option
  // ---------------------------------------------------------------------------
  const target = options.target;
  const offset = options.offset || 0.5;
  const threshold = options.threshold || 0.01;

  // ---------------------------------------------------------------------------
  // Handling callback
  // ---------------------------------------------------------------------------
  let onProgressCallback: ScroomOnProgressCallback<T> | null = null;
  let onEnterCallback: ScrollOnEnterCallback<T> | null = null;
  let onLeaveCallback: ScrollOnLeaveCallback<T> | null = null;
  let debugCallback: DebugCallback | null = null;

  function onProgress(callback: typeof onProgressCallback) {
    onProgressCallback = callback;
  }

  function onEnter(callback: typeof onEnterCallback) {
    onEnterCallback = callback;
  }

  function onLeave(callback: typeof onLeaveCallback) {
    onLeaveCallback = callback;
  }

  function debug(callback: typeof debugCallback) {
    debugCallback = callback;
  }

  // ---------------------------------------------------------------------------
  // Observing size
  // ---------------------------------------------------------------------------
  let targetHeight = target.clientHeight;
  let rootHeight = window.innerHeight;

  function windowSizeListener() {
    rootHeight = window.innerHeight;
    initIntersectionObserver();
  }
  window.addEventListener('resize', windowSizeListener);

  let resizeObserver: ResizeObserver | null;

  resizeObserver = new ResizeObserver((entires) => {
    targetHeight = entires[0].contentRect.height;
    initIntersectionObserver();
  });

  resizeObserver.observe(target);

  // ---------------------------------------------------------------------------
  // Observing intersection
  // ---------------------------------------------------------------------------
  let intersectionObserver: IntersectionObserver | null = null;

  function initIntersectionObserver() {
    const offsetTop = rootHeight * offset;
    const offsetBottom = rootHeight - offsetTop - targetHeight;

    let isIntersectingLastTrigger = false;

    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }

    intersectionObserver = new IntersectionObserver(
      (entires) => {
        const intersection = entires[0];
        const isIntersecting = Math.abs(intersection.intersectionRect.y - offsetTop) <= 1;
        const isEntering = !isIntersectingLastTrigger && isIntersecting;
        const isLeaving = isIntersectingLastTrigger && !isIntersecting;
        const progress = 1 - intersection.intersectionRatio;

        if (onEnterCallback && isEntering) {
          onEnterCallback(target);
        }

        if (onLeaveCallback && isLeaving) {
          onLeaveCallback(target);
        }

        if (onProgressCallback && (isEntering || isLeaving)) {
          onProgressCallback(getClosest(progress, 0, 1), target);
        } else if (onProgressCallback && isIntersecting) {
          onProgressCallback(progress, target);
        }

        if (debugCallback) {
          const action = isEntering ? 'enter' : isLeaving ? 'leave' : isIntersecting ? 'progress' : null;
          if (action) {
            debugCallback({
              progress,
              offsetTop,
              intersection,
              action,
            });
          }
        }

        isIntersectingLastTrigger = isIntersecting;
      },
      {
        rootMargin: `${-offsetTop}px 0px ${-offsetBottom + 10}px 0px`,
        threshold: genRange(0, 1, threshold),
      },
    );

    intersectionObserver.observe(target);
  }

  initIntersectionObserver();

  function destroy() {
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    if (windowSizeListener) {
      window.removeEventListener('resize', windowSizeListener);
    }
    intersectionObserver = null;
    resizeObserver = null;
    onProgressCallback = null;
    onEnterCallback = null;
    onLeaveCallback = null;
  }

  return {
    observer: intersectionObserver,
    onEnter,
    onLeave,
    onProgress,
    destroy,
    debug,
  };
}

export type ScroomInstance = ReturnType<typeof setup>;
