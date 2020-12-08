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
  if (step <= 0) {
    return [start];
  }
  const range = Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
  if (range[range.length - 1] !== stop) {
    range.push(stop);
  }
  return range;
}

function withDefault<T>(val: T, defaultVal: T extends undefined ? never : T) {
  if (typeof val === 'undefined') {
    return defaultVal;
  }
  return (val as unknown) as T extends undefined ? never : T;
}

export function setup<T extends Element>(options: ScroomOptions<T>) {
  // ---------------------------------------------------------------------------
  // Parsing option
  // ---------------------------------------------------------------------------
  const target = options.target;
  const offset = withDefault(options.offset, 0.5);
  const threshold = withDefault(options.threshold, 0.01);

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
  // Observing intersection
  // ---------------------------------------------------------------------------
  let intersectionObserver: IntersectionObserver | null = null;

  function initIntersectionObserver() {
    let isIntersectingLastTrigger = false;

    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }

    intersectionObserver = new IntersectionObserver(
      (entires) => {
        const intersection = entires[0];
        const rootBounds = intersection.rootBounds || false;
        const isIntersecting =
          intersection.isIntersecting &&
          rootBounds &&
          intersection.intersectionRect.y <= rootBounds.y &&
          intersection.intersectionRatio !== 1;

        const isEntering = !isIntersectingLastTrigger && isIntersecting;
        const isLeaving = isIntersectingLastTrigger && !isIntersecting;
        const progress = 1 - intersection.intersectionRatio;

        if (onEnterCallback && isEntering) {
          onEnterCallback(target);
        }

        if (onLeaveCallback && isLeaving) {
          onLeaveCallback(target);
        }

        if (onProgressCallback) {
          onProgressCallback(progress, target);
        }

        if (debugCallback) {
          const action = isEntering ? 'enter' : isLeaving ? 'leave' : isIntersecting ? 'progress' : null;
          if (action) {
            debugCallback({
              progress,
              offsetTop: offset,
              intersection,
              action,
            });
          }
        }

        isIntersectingLastTrigger = isIntersecting;
      },
      {
        // The size of the root must be large enough so that the second intersection will not be triggered.
        // It a hack but useful.
        rootMargin: `${-offset * 100}% 0% 9999999% 0%`,
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
    intersectionObserver = null;
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
