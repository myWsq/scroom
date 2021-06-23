import React, { useRef } from "react";
import { useScroom, useDebug } from "@scroom/react";

export default function useHooks() {
  const ref = useRef<HTMLDivElement>(null);

  const sc = useScroom(ref, {
    onProgress(e) {
      console.log("progress", e.progress);
    },
  });
  useDebug(sc, "useHooks");

  return (
    <div style={{ outline: "2px dashed" }}>
      <h1>Use Hooks</h1>
      <div
        style={{
          height: "50vh",
        }}
      ></div>
      <div
        ref={ref}
        style={{
          height: "3000px",
          background: "lightgrey",
        }}
      ></div>
      <div
        style={{
          height: "50vh",
        }}
      ></div>
    </div>
  );
}
