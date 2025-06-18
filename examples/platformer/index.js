import { Platformer } from "./Platformer.js";

let platformer = null;

const domStretch = (selector, options) => {
  const elements = document.querySelectoryAll(selector)
  elements.forEach((el) => {

  })
}

const resizeCanvasToContainer = (canvas, container = window) => {
  const width = container.innerWidth;
  const height = container.innerHeight;
  if (canvas instanceof HTMLCanvasElement) {
    canvas.width = width;
    canvas.height = height;
  } else {
    console.error("Provided element is not a canvas.");
  }
};

function init() {
  const stage = document.querySelector("#stage");
  window.addEventListener("resize", () => {
    resizeCanvasToContainer(stage);
  })
  resizeCanvasToContainer(stage);

  platformer = new Platformer(stage);
}

init();