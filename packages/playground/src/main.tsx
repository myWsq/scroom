import React from "react";
import ReactDOM from "react-dom";
import Basic from "./Basic";
import Horizontal from "./Horizontal";
import UseHooks from "./UseHooks";

ReactDOM.render(
  <React.StrictMode>
    <Basic />
    <Horizontal></Horizontal>
    <UseHooks></UseHooks>
  </React.StrictMode>,
  document.getElementById("root")
);
