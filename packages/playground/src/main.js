import "./style.css";
import { setup, debug } from "scroom";

const targetA = document.querySelector(".target.a");
const targetB = document.querySelector(".target.b");
const rect = document.querySelector(".rect");

const scTargetA = setup({
  target: targetA,
  offset: 0.5,
  threshold: 0.001,
});

const scTargetB = setup({
  target: targetB,
  offset: 0.3,
});

scTargetA.onProgress((progress) => {
  rect.style.transform = `translateY(${-progress}%) scale(${progress})`;
});

// debug(scTargetA, "TargetA");
// debug(scTargetB, "TargetB");
