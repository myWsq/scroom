import React from "react";
import { createScroom, debug } from "scroom";
export default function Horizontal() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      const sc = createScroom({
        target: ref.current,
        offset: 0.5,
        direction: "horizontal",
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

      const debugInstance = debug(sc, "horizontal");

      return () => {
        sc.destroy();
        debugInstance.destroy();
      };
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        overflowX: "scroll",
        width: "80vw",
        margin: "30px auto",
        outline: "2px dashed",
      }}
    >
      <h1>Horizontal</h1>
      <div
        style={{
          width: "80vw",
          flexShrink: 0,
        }}
      ></div>
      <div
        ref={ref}
        style={{
          height: "300px",
          width: "50%",
          background: "lightgrey",
          flexShrink: 0,
        }}
      ></div>
      <div
        style={{
          width: "80vw",
          flexShrink: 0,
        }}
      ></div>
    </div>
  );
}
