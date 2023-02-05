import "./style.css";

const scoreTag = document.querySelector("#yourscore")
var retrievedObject = JSON.parse(localStorage.getItem("scoreTotal"));
scoreTag.innerHTML = retrievedObject["scoreTotal"]

console.log(retrievedObject)
var audio = new Audio("/music.wav");
const btn = document.querySelector("#soundOnEnd");
let playingSound = false;

btn.addEventListener("click", () => {
  if (playingSound === false) {
    audio.loop = true
    audio.play();
    btn.innerHTML = "Music Off 🚫";
    playingSound = true;
    console.log(playingSound);
  } else {
    audio.pause();
    btn.innerHTML = "Music On 🎶";
    playingSound = false;
    return playingSound;
  }
});