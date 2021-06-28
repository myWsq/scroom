import { ScroomEventMap, ScroomInstance } from './setup';
import randomColor from 'randomcolor';

export interface ScroomDebugController {
  destroy: () => void;
}

export function debug<T extends Element>(instance: ScroomInstance<T>, id?: string): ScroomDebugController {
  const r = (randomColor({
    luminosity: 'dark',
    format: 'rgbArray',
  }) as unknown) as number[];

  const color = `rgb(${r[0]},${r[1]},${r[2]})`;
  const alpha = `rgba(${r[0]},${r[1]},${r[2]},0.1)`;

  const triggerLine = document.createElement('div');
  const mask = document.createElement('div');

  mask.style.cssText = `
      position: fixed;
      z-index: 100000;
      background: ${alpha};
      outline: 1px solid ${color};
      pointer-events: none;
    `;

  document.body.appendChild(triggerLine);
  document.body.appendChild(mask);

  function intersectionHandler(event: ScroomEventMap<T>['debug']) {
    const { offset, action, progress, direction, intersection } = event;

    const display = action === 'enter' || action === 'progress' ? 'block' : 'none';

    triggerLine.style.cssText = `
      position: fixed;
      z-index: 99999;
      pointer-events: none;
      display: ${display};
      ${
        direction === 'vertical'
          ? `
              left: 0;
              width: 100%;
              bottom: ${(1 - offset) * 100}%;
              color: ${color};
              border-bottom: 1px dashed ${color};
              padding: 5px 20px;
            `
          : `
              top: 0;
              height: 100%;
              right: ${(1 - offset) * 100}%;
              color: ${color};
              border-right: 1px dashed ${color};
              padding: 20px 5px;
            `
      }
    `;

    mask.style.display = display;

    const rect = intersection.boundingClientRect;
    mask.style.top = rect.top + 'px';
    mask.style.left = rect.left + 'px';
    mask.style.width = rect.width + 'px';
    mask.style.height = rect.height + 'px';

    if (display) {
      triggerLine.innerText = `${id ? `[${id}]` : ''}  ${(progress * 100).toFixed(3)}%`;
    }
  }

  function positionHandler() {
    const rect = instance.target.getBoundingClientRect();
    mask.style.top = rect.top + 'px';
    mask.style.left = rect.left + 'px';
    mask.style.width = rect.width + 'px';
    mask.style.height = rect.height + 'px';
  }

  instance.on('debug', intersectionHandler);
  window.addEventListener('resize', positionHandler, false);
  window.addEventListener('scroll', positionHandler, false);
  positionHandler();

  function destroy() {
    instance.off('debug', intersectionHandler);
    window.removeEventListener('resize', positionHandler, false);
    window.removeEventListener('scroll', positionHandler, false);
    triggerLine.remove();
    mask.remove();
  }

  return {
    destroy,
  };
}
