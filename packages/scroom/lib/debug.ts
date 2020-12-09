import { ScroomInstance } from './setup';
import randomColor from 'randomcolor';

export function debug(instance: ScroomInstance, id?: string) {
  const r = (randomColor({
    luminosity: 'dark',
    format: 'rgbArray',
  }) as unknown) as number[];

  const color = `rgb(${r[0]},${r[1]},${r[2]})`;
  const alpha = `rgba(${r[0]},${r[1]},${r[2]},0.1)`;

  const offsetLine = document.createElement('div');
  const mask = document.createElement('div');

  offsetLine.style.cssText = `
    position: fixed;
    z-index: 99999;
    left: 0;
    transform: translateY(-3px);
    width: 100%;
    height: 3px;
    background: repeating-linear-gradient(to right,${color} 0,${color} 1%,transparent 1%,transparent 2%);
    pointer-events: none;
  `;

  mask.style.cssText = `
    position: fixed;
    z-index: 100000;
    background: ${alpha};
    outline: 3px solid ${color};
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${color};
    font-size: 32px;
    overflow: hidden;
    pointer-events: none;
  `;

  document.body.appendChild(offsetLine);
  document.body.appendChild(mask);

  instance.debug(({ intersection, offsetTop, action, progress }) => {
    const rect = intersection.boundingClientRect;

    offsetLine.style.top = offsetTop * 100 + '%';

    mask.style.top = rect.top + 'px';
    mask.style.left = rect.left + 'px';
    mask.style.width = rect.width + 'px';
    mask.style.height = rect.height + 'px';

    mask.innerText = `${id ? `[${id}]` : ''}  ${(progress * 100).toFixed(3)}%`;

    if (action === 'enter') {
      offsetLine.style.opacity = '1';
      mask.style.opacity = '1';
    }
    if (action === 'leave') {
      offsetLine.style.opacity = '0';
      mask.style.opacity = '0';
    }
  });

  function destroy() {
    instance.debug(null);
    offsetLine.remove();
    mask.remove();
  }

  return {
    destroy,
  };
}
