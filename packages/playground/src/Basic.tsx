import React from "react";
import { createScroom, debug } from "scroom";
export default function Basic() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      const sc = createScroom({
        target: ref.current,
        offset: 0.9,
      });

      sc.on("enter", () => {
        console.log("enter");
      });

      sc.on("leave", () => {
        console.log("leave");
      });

      sc.on("progress", (e) => {
        console.log(e.progress);
      });

      const debugInstance = debug(sc, "basic");

      return () => {
        sc.destroy();
        debugInstance.destroy();
      };
    }
  }, []);

  return (
    <div style={{ outline: "2px dashed" }}>
      <h1>Basic</h1>
      <div
        style={{
          height: "50vh",
        }}
      ></div>
      <div
        ref={ref}
        style={{
          height: "300px",
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
