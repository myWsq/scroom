import { useEffect } from "react";
import { debug, ScroomInstance } from "scroom";

export function useDebug<T extends Element>(
  sc: ScroomInstance<T> | null,
  id?: string
) {
  useEffect(() => {
    if (sc) {
      const controller = debug(sc, id);
      return () => {
        controller.destroy();
      };
    }
  }, [sc, id]);
}
