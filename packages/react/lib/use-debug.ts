import { useEffect } from "react";
import { ScroomInstance, debug } from "scroom";

export function useDebug(sc: ScroomInstance) {
  useEffect(() => {
    if (sc) {
      const controller = debug(sc);
      return () => {
        controller.destroy();
      };
    }
  }, [sc]);
}
