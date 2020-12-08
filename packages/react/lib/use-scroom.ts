import { RefObject, useEffect, useState } from "react";
import { ScroomInstance, ScroomOptions, setup } from "scroom";

export type UseScroomOptions<T extends Element> = Omit<
  ScroomOptions<T>,
  "target"
>;

export function useScroom<T extends Element>(
  ref: RefObject<T>,
  options?: UseScroomOptions<T>
) {
  const [sc, setSc] = useState<ScroomInstance>();
  const offset = options?.offset;
  const threshold = options?.threshold;

  useEffect(() => {
    const target = ref.current;
    if (target) {
      const newSc = setup({
        target,
        offset,
        threshold,
      });
      setSc(newSc);
      return () => {
        newSc.destroy();
      };
    }
  }, [ref, offset, threshold]);

  return sc;
}
