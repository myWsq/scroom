// @jsx jsx
import { Box, jsx } from "theme-ui";
import { useRef } from "react";
import { useScroom } from "@scroom/react";

export default function Logo() {
  const ref = useRef();

  useScroom(ref, {
    offset: 0.1,
    onProgress({ target, progress }) {
      const svg = target.querySelector("svg");
      svg.style.transform = `rotate(${progress}turn)`;
    },
  });

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        py: 1,
        alignItems: "center",
      }}
    >
      <svg
        width="2em"
        height="2em"
        viewBox="0 0 286 260"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="143" cy="132" r="40" />
        <path
          d="M140.532 0C208.253 0 263.965 53.02 270.758 121H281.151C283.829 121 286 123.239 286 126V141C286 143.761 283.829 146 281.151 146H240.42C237.742 146 235.571 143.761 235.571 141V126C235.571 123.239 237.742 121 240.42 121H248.796C242.112 65.4747 196.189 22.5 140.532 22.5C95.8364 22.5 57.4181 50.2141 40.5574 89.8861C39.7632 91.7549 37.992 93 36.0133 93H22.7582C19.4601 93 17.1278 89.6752 18.313 86.5015C37.2085 35.9034 84.8041 0 140.532 0Z"
          fill="#86D150"
        />
        <path
          d="M145.468 260C77.7468 260 22.0348 206.98 15.2423 139H4.84893C2.17095 139 -2.48784e-06 136.761 -2.48784e-06 134V119C-2.48784e-06 116.239 2.17095 114 4.84893 114H45.58C48.258 114 50.4289 116.239 50.4289 119V134C50.4289 136.761 48.258 139 45.58 139H37.2036C43.8877 194.525 89.8108 237.5 145.468 237.5C190.164 237.5 228.582 209.786 245.443 170.114C246.237 168.245 248.008 167 249.987 167H263.242C266.54 167 268.872 170.325 267.687 173.498C248.792 224.097 201.196 260 145.468 260Z"
          fill="#5463EB"
        />
      </svg>

      <p
        sx={{
          display: "inline-block",
          ml: 3,
        }}
      >
        Scroom is a smart library for cool scrolling effects, based on
        Intersection Observer.
      </p>
    </Box>
  );
}
