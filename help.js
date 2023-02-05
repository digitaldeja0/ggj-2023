import "./style.css";

var audio = new Audio("/help-music.wav");
const btn = document.querySelector("#soundOnHelp");
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