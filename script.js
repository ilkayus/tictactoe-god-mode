"use strict";

const cells = document.querySelectorAll(".cell");
const scoreAiEl = document.querySelector(".score-ai");
const scoreHumanEl = document.querySelector(".score-human");
const scoreTieEl = document.querySelector(".score-tie");
const allahMode = document.querySelector(".mode");

const allahModeChecked = allahMode.checked;
console.log(allahModeChecked);
const startButtons = document.querySelectorAll(".button");
startButtons.forEach((e) =>
  e.addEventListener("click", function (e) {
    startButtons.forEach((e) => e.classList.add("visually-hidden"));
    document.querySelector(".slider").classList.add("visually-hidden");
    setTimeout(function () {
      startButtons.forEach((e) => e.classList.add("hidden"));
      document.querySelector(".slider").classList.add("hidden");
      document.querySelector(".table-ai-text").textContent = allahMode.checked
        ? "DOBERMAN"
        : "EASY";
      const app = new App(e.target.dataset.token, allahMode.checked);
    }, 400);
  })
);
