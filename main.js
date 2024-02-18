import {road, player, car, carGroup, BIOME, GUI, HiScore, devMode} from './classes.js';

let running = false;

const app = new PIXI.Application({
    background: '#000',
    resizeTo: window,
});

document.body.appendChild(app.view);

let font = new FontFaceObserver('Poppins Black', {});
font.load();

const scrollSpeed = 30;

const NewBIOME = new BIOME(app);

const NewRoad = new road(app, scrollSpeed);

const NewPlayer = new player(app, NewRoad.getSize());

const CarGroup = new carGroup(app, NewRoad.getSize());

const score = new GUI(document.getElementById("score-count"));

const hiscore = new HiScore(document.getElementById("hi-score-count"));

app.stage.interactive = true;

const play_btn = document.getElementById("play");
const settings_btn = document.getElementById("settings-btn");

const settings_box = document.getElementById("settings-box");

play_btn.addEventListener("click", () => {
  NewPlayer.start();
  play_btn.style.display = "none";
  running = true;
});

settings_btn.addEventListener("click", () => {
  settings_box.style.display = (settings_box.style.display == "block" ? "none" : "block")
});

score.format(['en'], 0);

app.ticker.add((delta) =>
{
  NewRoad.scrollTime();
  //NewBIOME.scrolling();
  if (running || devMode) {
    if (!((CarGroup.getDistance() / 10)%10)) {
      hiscore.save(Math.floor(CarGroup.getDistance() / 10));
    }
    hiscore.format(['en'],Math.floor(CarGroup.getDistance() / 10));
    score.format(['en'],Math.floor(CarGroup.getDistance() / 10));
    if (CarGroup.velTime(NewPlayer.getBounds()) || NewBIOME.calcCollision(NewPlayer.getBounds())) {
      running = false;
      score.format(['en'], Math.floor(0));
      play_btn.style.display = "block";
      NewPlayer.reset();
      CarGroup.reset();
    }
  }
  //NewPlayer.carCollisions(CarGroup.getArray());
});