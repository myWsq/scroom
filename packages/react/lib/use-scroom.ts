import { RefObject, useEffect, useState } from "react";
import {
  ScroomInstance,
  CreateScroomOptions,
  createScroom,
  ScroomEventMap,
} from "scroom";

export type UseScroomOptions<T extends Element> = Omit<
  CreateScroomOptions<T>,
  "target"
> & {
  onProgress?: (e: ScroomEventMap<T>["progress"]) => void;
  onEnter?: (e: ScroomEventMap<T>["enter"]) => void;
  onLeave?: (e: ScroomEventMap<T>["leave"]) => void;
  onDebug?: (e: ScroomEventMap<T>["debug"]) => void;
};

export function useScroom<T extends Element>(
  ref: RefObject<T>,
  options: UseScroomOptions<T> = {}
) {
  const [sc, setSc] = useState<ScroomInstance<T> | null>(null);

  useEffect(() => {
    const target = ref.current;
    if (target) {
      const newSc = createScroom({
        target,
        ...options,
      });
      setSc(newSc);

      const { onEnter, onLeave, onProgress, onDebug } = options;

      if (onEnter) {
        newSc.on("enter", onEnter);
      }

      if (onLeave) {
        newSc.on("leave", onLeave);
      }

      if (onProgress) {
        newSc.on("progress", onProgress);
      }

      if (onDebug) {
        newSc.on("debug", onDebug);
      }

      return () => {
        newSc.destroy();
      };
    }
  }, [ref, options.direction, options.offset, options.threshold]);

  return sc;
}
