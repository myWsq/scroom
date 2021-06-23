import Emittery from 'emittery';
import ResizeObserver from 'resize-observer-polyfill';
import { climb, genRange } from './utils';

/** options for creating a scroom instance */
export interface CreateScroomOptions<T extends Element> {
  /** target element */
  target: T;
  /** trigger distance from the top/left of the viewport. unit: %. range: 0 - 1. default: 0.5 */
  offset?: number;
  /** scrolling detection frequency threshold. unit: px. default: 4 */
  threshold?: number;
  /** scrolling detection direction. default: vertical */
  direction?: 'vertical' | 'horizontal';
}

/** scroom instance events */
export interface ScroomEventMap<T> {
  enter: {
    target: T;
  };
  leave: {
    target: T;
  };
  progress: {
    target: T;
    progress: number;
  };
  debug: {
    target: T;
    intersection: IntersectionObserverEntry;
    offset: number;
    progress: number;
    direction: 'vertical' | 'horizontal';
    action: 'enter' | 'progress' | 'leave' | null;
  };
}

/** scroom instance */
export interface ScroomInstance<T extends Element> {
  target: T;
  /** intersection observer inside this instance */
  observer: IntersectionObserver;
  /** add event listener */
  on: Emittery<ScroomEventMap<T>>['on'];
  /** add event listener for once */
  once: Emittery<ScroomEventMap<T>>['once'];
  /** remove event listener */
  off: Emittery<ScroomEventMap<T>>['off'];
  /** destroy instance and remove all event listeners */
  destroy: () => void;
}

/**
 * create a scroom instance
 * @param options - create options
 * @returns scroom instance
 */
export function createScroom<T extends Element>(options: CreateScroomOptions<T>): ScroomInstance<T> {
  const { target, offset = 0.5, threshold = 4, direction = 'vertical' } = options;
  const emitter = new Emittery<ScroomEventMap<T>>();

  // observer for intersecting
  let intersectionObserver: IntersectionObserver = createIntersectionObserver();

  // observer for target size changing
  let resizeObserver: ResizeObserver = createResizeObserver();

  // listener for window resizing
  window.addEventListener('resize', resizeHandler);

  function createResizeObserver() {
    const observer = new ResizeObserver(resizeHandler);
    return observer;
  }

  function createIntersectionObserver() {
    let rootMargin: string;
    let thresholdStep: number;

    // vertical
    if (direction === 'vertical') {
      const m1 = -offset * window.innerHeight;
      const m2 = (offset - 1) * window.innerHeight + target.clientHeight;
      // create a root bound box which same with target under trigger
      rootMargin = `${m1}px 0px ${m2}px 0px`;
      thresholdStep = threshold / target.clientHeight;
    }
    // horizontal
    else {
      const m1 = -offset * window.innerWidth;
      const m2 = (offset - 1) * window.innerWidth + target.clientWidth;
      rootMargin = `0px ${m2}px 0px ${m1}px`;
      thresholdStep = threshold / target.clientWidth;
    }

    let isIntersectingLastTick = false;
    let progressLastTick = -1;

    let isFirstEnter = true;
    setTimeout(() => {
      isFirstEnter = false;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { boundingClientRect: client, intersectionRect: rect, isIntersecting } = entry;
        let isProgressing = false;
        let progress = 0;

        if (direction === 'vertical') {
          isProgressing = client.top < rect.top && isIntersecting;
          progress = 1 - rect.height / client.height;
        } else if (direction === 'horizontal') {
          isProgressing = client.left < rect.left && isIntersecting;
          progress = 1 - rect.width / client.width;
        }

        const isEntering = !isIntersectingLastTick && isProgressing;
        const isLeaving = isIntersectingLastTick && !isProgressing;
        isIntersectingLastTick = isProgressing;

        const emitProgress = (progress: number) => {
          if (progressLastTick !== progress) {
            emitter.emit('progress', {
              target,
              progress,
            });
          }
          progressLastTick = progress;
        };

        if (isEntering) {
          emitter.emit('enter', {
            target,
          });
          if (!isFirstEnter) {
            emitProgress(climb(progress, 0, 1));
          }
        }

        if (isProgressing && progressLastTick !== progress) {
          emitProgress(progress);
        }

        if (isLeaving) {
          emitter.emit('leave', {
            target,
          });
          emitProgress(climb(progress, 0, 1));
        }

        emitter.emit('debug', {
          target,
          progress,
          offset,
          intersection: entry,
          direction,
          action: isEntering ? 'enter' : isLeaving ? 'leave' : isProgressing ? 'progress' : null,
        });
      },
      {
        rootMargin,
        threshold: genRange(0, 1, thresholdStep),
      },
    );
    return observer;
  }

  function resizeHandler() {
    intersectionObserver.disconnect();
    intersectionObserver = createIntersectionObserver();
    intersectionObserver.observe(target);
  }

  function destroy() {
    intersectionObserver.disconnect();
    resizeObserver.disconnect();
    emitter.clearListeners();
    window.removeEventListener('resize', resizeHandler);
  }

  // main
  resizeObserver.observe(target);

  return {
    target,
    observer: intersectionObserver,
    destroy,
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    off: emitter.off.bind(emitter),
  };
}
