import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login } from "./login";

const mapBox = document.getElementById("map");

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

const loginForm = document.querySelector(".form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login(email, password);
  });
}
