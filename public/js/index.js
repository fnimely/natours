import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login } from "./login";

const mapBox = document.getElementById("map");

let email;
let password;

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

const loginForm = document.querySelector(".form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    login(email, password);
  });
}
