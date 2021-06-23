export function genRange(start: number, stop: number, step = 1) {
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

export function climb(num: number, min: number, max: number) {
  if (Math.abs(min - num) < Math.abs(max - num)) {
    return min;
  } else {
    return max;
  }
}
