export const devModeString = localStorage.getItem("DM").toLowerCase() || false;
export let devMode = false;
if (devModeString == 'true') {
  devMode = true;
}

function testForCollisions(xy, xy2)
{

  return xy.x < xy2.x + xy2.width &&
    xy.x + xy.width > xy2.x &&
    xy.y < xy2.y + xy2.height &&
    xy.y + xy.height > xy2.y;
}

export class road {
  constructor(app, speed) {
    this.app = app;
    this.scroll = 0;
    this.scrollSpeed = speed;
    
    let obj = new PIXI.Graphics();
    obj.beginFill(0x121212);
    const rectXScale = (this.app.screen.width * 0.5 >= 300 ? this.app.screen.width * 0.5 : 300);
    const fixedRectXScale = (rectXScale <= 500 ? rectXScale : 500);
    
    if (devMode == true) {
      obj.alpha = 0.5;
    }
    
    obj.drawRect((this.app.screen.width / 2) - fixedRectXScale / 2, 0, fixedRectXScale, this.app.screen.height);
    

    
    app.stage.addChild(obj);
    this.createRoadLines();
  }

  newSprite(scrollOffset) {
    let obj = new PIXI.Graphics();
    obj.beginFill(0xffffff);
    obj.drawRect((this.app.screen.width / 2) - 2.5, (this.scroll + scrollOffset) % this.app.screen.height, 5, 50);
       
    return obj;
  }
  
  createRoadLines() {
    this.roadLines = [];
    for (let i = -this.app.screen.height; i < Math.floor(this.app.screen.height * 2); i+=100) {
      const obj = this.newSprite(i);
      this.app.stage.addChild(obj);
      this.roadLines.push([obj, i]);
    }
  }
  
  scrollTime() {
    this.scroll += this.scrollSpeed;
    for (let i = 0; i < this.roadLines.length; i++) {
      this.roadLines[i][0].position.y = (this.scroll % this.app.screen.height + this.roadLines[i][1]);
    }
  }
  
  getSize() {
    const rectXScale = (this.app.screen.width * 0.5 >= 300 ? this.app.screen.width * 0.5 : 300);
    const fixedRectXScale = (rectXScale <= 500 ? rectXScale : 500);
    
    return fixedRectXScale
  }
}

export class player {
  running = true;
  
  constructor(app, roadSize) {
    this.app = app;
    this.roadSize = roadSize;
    
    let player = PIXI.Sprite.from("./assets/images/racers/red_racer.png");
    
    player.scale.x = 0.15;
    player.scale.y = 0.12;
    
    player.anchor.set(0.5);
    
    player.x = app.screen.width / 2;
    player.y = app.screen.height / 1.5;
    
    app.stage.addChild(player);
    
    this.player = player;
    
    this.collPart = this.show_collision();
    
    this.mouseMove = (e) => {
      if (this.running === false) { return };
      const mouse = e.data.global;
      this.mouse = mouse;
    
      this.collPart.x = this.player.x - (this.collPartX / 2);
      this.collPart.y = this.player.y - (this.collPartY / 2);
    
      this.player.rotation = Math.atan2(this.mouse.y - this.player.y, this.mouse.x - this.player.x) + 1.5555;
    
      this.player.x = mouse.x;
    }
  }
  
  start() {
    this.app.stage.on("pointermove", this.mouseMove);
  }
  
  reset() {
    this.app.stage.off("pointermove", this.mouseMove);
    this.player.scale.x = 0.15;
    this.player.scale.y = 0.12;
    
    this.player.anchor.set(0.5);
    
    this.player.x = this.app.screen.width / 2;
    this.player.y = this.app.screen.height / 1.5;
    this.collPart.x = this.player.x - (this.collPartX / 2);
    this.collPart.y = this.player.y - (this.collPartY / 2);
  }
  
  show_collision() {
    this.collPartX = 60;
    this.collPartY = 90;
  
    let background = new PIXI.Graphics();
    background.beginFill(0x00ff00);
    background.drawRect(0, 0, this.collPartX, this.collPartY);
  
    if (devMode === true) {
      background.alpha = 0.5;
    } else {
      background.alpha = 0;
    }
  
    this.app.stage.addChild(background);
    
    background.x = this.player.x - (this.collPartX / 2);
    background.y = this.player.y - (this.collPartY / 2);
  
    return background;
  }
  
  getBounds() {
    return {x: this.collPart.x, y: this.collPart.y, width: this.collPart.width, height: this.collPart.height};
  }
}

export class carGroup {
  scroll = 0;
  min_scroll = 0;
  speed = 0;
  max_speed = 50;
  
  cars = [];
  
  cars_b = [];
  
  car_types = [
    "blue",
    "green",
    "orange",
    "red"
  ];
  
  constructor(app, sizeOfRoad) {
    this.app = app;
    this.sizeOfRoad = sizeOfRoad;
  }
  
  velTime(playerBounds) {
    this.scroll += 1;
    if (localStorage.getItem("US") == "false") {
      this.speed += 0.001;
      this.max_speed = 50;
    } else {
      this.speed += 0.100;
      this.max_speed = 100;
    }
    
    if (this.scroll > this.min_scroll - this.max_speed) {
      this.cars.push(new car(this.app, this.car_types[Math.floor(Math.random() * this.car_types.length)], Math.floor(Math.random() * 2) + 1, this.sizeOfRoad, this.max_speed));
      
      this.min_scroll += 90;
    }
    
    let hit = false;
    
    for (let i=0;i<this.cars.length;i++) {
      hit = this.cars[i].velTime(this.speed, playerBounds);
      if (hit) {return true};
    }
  }
  
  getArrayOfBounds() {
    return this.cars;
  }
  
  getDistance() {
    return this.scroll;
  }
  
  reset() {
    for (let i = 0; i < this.cars.length; i++) {
      this.app.stage.removeChild(this.cars[i].player);
      this.app.stage.removeChild(this.cars[i].collPart);
    }
    this.scroll = 0;
    this.speed = 0;
    this.min_scroll = 0;
    this.cars = [];
  }
}

export class car {
  constructor (app, type, position, sizeOfRoad, maxSpeed) {
    this.app = app;
    this.position = position;
    this.path = "./assets/images/cars/"+type+"_car.png";
    
    this.max_speed = maxSpeed;
    
    let player = PIXI.Sprite.from(this.path);
    
    player.scale.x = 0.15;
    player.scale.y = 0.15;
    
    player.anchor.set(0.5);
    
    if (position === 1)
      player.x = (this.app.screen.width / 2) - sizeOfRoad / 4;
    else
      player.x = (this.app.screen.width / 2) - sizeOfRoad / -4;
    player.y = -100;
    
    app.stage.addChild(player);
    
    this.rngSpeed = (Math.floor(Math.random() * 5) / 10) + 2.5;
    
    this.player = player;
    
    this.collPart = this.show_collision();
    

  }
  
  velTime(speed, playerBounds) {
    this.player.y += (this.rngSpeed + (speed > this.max_speed ? this.max_speed : speed));
    this.collPart.x = this.player.x - (this.collPartX / 2);
    this.collPart.y = this.player.y - (this.collPartY / 2);
    
    return this.calcCollision(playerBounds);
  }
  
  getCar() {
    return this.player;
  }
  
  show_collision() {
    this.collPartX = 75;
    this.collPartY = 110;
    
    let background = new PIXI.Graphics();
    background.beginFill(0xff0000);
    background.drawRect(0, 0, this.collPartX, this.collPartY);
    
    if (devMode === true) {
      background.alpha = 0.5;
    } else {
      background.alpha = 0;
    }
    
    this.app.stage.addChild(background);
    
    return background;
  }
  
  calcCollision(playerBounds) {
    if (!(this.player.y > playerBounds.y + (playerBounds.height / 2) + 100)) {
      
      if (testForCollisions(playerBounds, this.getBounds())) {

        if (devMode === true) {
          this.collPart.alpha = 1;
        }
        return true;
      }
    } else {
      if (devMode === true) {
        this.collPart.alpha = 0;
      }
      return false;
    }
  }
  
  getBounds() {
    return { x: this.collPart.x, y: this.collPart.y, width: this.collPart.width, height: this.collPart.height };
  }
}

export class BIOME {
  
  background_color = 0x47912f;
  biome_generation = () => {
    let background = new PIXI.Graphics();
    background.beginFill(this.background_color);
    background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    
    this.app.stage.addChild(background);
  };
  
  bounds_calculate = () => {
    const rectXScale = (this.app.screen.width * 0.5 >= 300 ? this.app.screen.width * 0.5 : 300);
    const fixedRectXScale = (rectXScale <= 500 ? rectXScale : 500);
  
    return {
      bound1: {
        base: { x1: 0, x2: (this.app.screen.width / 2) - fixedRectXScale / 2 },
        padding: { x1: 0, x2: ((this.app.screen.width / 2) - fixedRectXScale / 2) - 15 },
      },
      bound2: {
        base: { x1: ((this.app.screen.width / 2) - fixedRectXScale / 2) + fixedRectXScale, x2: this.app.screen.width },
        padding: { x1: ((this.app.screen.width / 2) - fixedRectXScale / 2) + 15 + fixedRectXScale, x2: this.app.screen.width },
      },
    };
  };
  
  render_collb = () => {
    const calcs = this.bounds_calculate();
    
    let bound = new PIXI.Graphics();
    bound.beginFill(0xffff00);
    
    if (devMode === true) {
      bound.alpha = 0.5;
    } else {
      bound.alpha = 0;
    }
    
    bound.drawRect(calcs.bound1.padding.x1, 0, calcs.bound1.padding.x2, this.app.screen.height);
    
    let bound2 = new PIXI.Graphics();
    bound2.beginFill(0xffff00);
    
    if (devMode === true) {
      bound2.alpha = 0.5;
    } else {
      bound2.alpha = 0;
    }
    
    bound2.drawRect(calcs.bound1.padding.x1, 0, calcs.bound1.padding.x2, this.app.screen.height);
    bound2.x = calcs.bound2.padding.x1;

    this.app.stage.addChild(bound, bound2);
    
    return [bound, bound2];
  };
  
  calcCollision(playerBounds) {
      if (testForCollisions(playerBounds, this.getBounds()[0])) {
  
        if (devMode === true) {
          this.collPart1.alpha = 1;
        }
        return true;
      }
      if (testForCollisions(playerBounds, this.getBounds()[1])) {
      
        if (devMode === true) {
          this.collPart2.alpha = 1;
        }
        return true;
      }
    return false;
  }
  
  getBounds() {
    return [
      { x: this.collPart1.x, y: this.collPart1.y, width: this.collPart1.width, height: this.collPart1.height },
      { x: this.collPart2.x, y: this.collPart2.y, width: this.collPart2.width, height: this.collPart2.height }
    ];
  }
  
  constructor(app){
    this.app = app;
    this.biome_generation();
    const c = this.render_collb();
    this.collPart1 = c[0];
    this.collPart2 = c[1];
  }
}

export class BIOME_PLAINS extends BIOME {
  dot_color = 0x9bc991;
  
  scroll = 0;
  scrollSpeed = 0.01;
  
  biome_generation = () => {
    let background = new PIXI.Graphics();
    background.beginFill(this.background_color);
    background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    
    this.app.stage.addChild(background);
    
    if (devMode) {
      this.bounds_render();
    }
    
    this.bounds_elements_render();
  };
  
  bounds_calculate = () => {
    const rectXScale = (this.app.screen.width * 0.5 >= 300 ? this.app.screen.width * 0.5 : 300);
    const fixedRectXScale = (rectXScale <= 500 ? rectXScale : 500);
    
    return {
      bound1: {
        base: {x1: 0, x2: (this.app.screen.width / 2) - fixedRectXScale / 2},
        padding: {x1: 0, x2: ((this.app.screen.width / 2) - fixedRectXScale / 2) - 15},
      },
      bound2: {
        base: {x1: ((this.app.screen.width / 2) - fixedRectXScale / 2) + fixedRectXScale, x2: this.app.screen.width},
        padding: {x1: ((this.app.screen.width / 2) - fixedRectXScale / 2) + 15 + fixedRectXScale, x2: this.app.screen.width},
      },
    };
  };
  
  bounds_render = () => {
    const calcs = this.bounds_calculate();
    
    let bound_padding = new PIXI.Graphics();
    bound_padding.beginFill(0xff0000);
    
    bound_padding.drawRect(calcs.bound1.base.x1, 0, calcs.bound1.base.x2, this.app.screen.height);
    
    let bound2_padding = new PIXI.Graphics();
    bound2_padding.beginFill(0xff0000);
    bound2_padding.drawRect(calcs.bound2.base.x1, 0, calcs.bound2.base.x2, this.app.screen.height);
    
    this.app.stage.addChild(bound_padding, bound2_padding);
    
    // bounds
    
    let bound = new PIXI.Graphics();
    bound.beginFill(0xffff00);
    
    bound.drawRect(calcs.bound1.padding.x1, 0, calcs.bound1.padding.x2, this.app.screen.height);
    
    let bound2 = new PIXI.Graphics();
    bound2.beginFill(0xffff00);
    
    bound2.drawRect(calcs.bound2.padding.x1, 0, calcs.bound2.padding.x2, this.app.screen.height);
    
    this.app.stage.addChild(bound, bound2);
  }
  
  bounds_elements = () => {
    const calcs = this.bounds_calculate();
    const elements = []; 
    
    let scroll = 0;
    
    for(let i=0;i<10;i++) {
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 1, scroll + 90, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 4, scroll + 10, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 2, scroll + 40, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 2.65, scroll + 80, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 8, scroll + 100, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 1.60, scroll + 120, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 1.35, scroll + 180, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 1.15, scroll + 70, 8));
        scroll += 180;
    }
    
    scroll = 0;
    
    for (let i = 0; i < 10; i++) {
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1, scroll + 90, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.1, scroll + 10, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.05, scroll + 40, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.2, scroll + 80, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.15, scroll + 100, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.25, scroll + 120, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.1333, scroll + 180, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1, scroll + 70, 8));
      scroll += 180;
    }
    
    return elements;
  };
  
  bounds_elements_render = () => {
    this.elements = this.bounds_elements();
    
    console.log(this.elements);
    
    this.app.stage.addChild(...this.elements);
  };
  
  scrolling = () => {
    this.scroll += this.scrollSpeed;
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].position.y = (this.scroll % this.app.screen.height + this.elements[i].position.y);
    }
  };
}

export class BIOME_FOREST extends BIOME_PLAINS {
  tree = (x, y) => {
    const sprites = [
      "tree",
      "bush",
      "flower_tree",
      "flower_bush",
    ];
    
    const tree =  PIXI.Sprite.from("./assets/images/env/"+sprites[Math.floor(Math.random() * sprites.length)]+".png");
    tree.scale.x = 0.15;
    tree.scale.y = 0.15;
    
    tree.anchor.set(0.5, 1);
    
    tree.x = x;
    tree.y = y;
    
    return tree;
  };
  
  bounds_elements = () => {
    const calcs = this.bounds_calculate();
    const elements = [];
    
    let scroll = 0;
    
    for (let i = 0; i < 10; i++) {
      
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 4, scroll + 10, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 2.65, scroll + 80, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 8, scroll + 100, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 1.60, scroll + 120, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 1.35, scroll + 180, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound1.padding.x2 / 1.15, scroll + 70, 8));
      elements.push(this.tree(calcs.bound1.padding.x2 / 1.5, scroll + 90, 8));
      elements.push(this.tree(calcs.bound1.padding.x2 / 6, scroll + 40, 8));
      scroll += 180;
    }
    
    scroll = 0;
    
    for (let i = 0; i < 10; i++) {
    
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1, scroll + 10, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.1, scroll + 80, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.05, scroll + 100, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.2, scroll + 120, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.35, scroll + 180, 8));
      elements.push(new PIXI.Graphics()
        .beginFill(this.dot_color)
        .drawCircle(calcs.bound2.padding.x1 * 1.15, scroll + 70, 8));
      elements.push(this.tree(calcs.bound2.padding.x1 * 1.25, scroll + 90, 8));
      elements.push(this.tree(calcs.bound2.padding.x1 * 1.1, scroll + 120, 8));
      scroll += 180;
    }
    
    return elements;
  }
}

export class BIOME_SEA extends BIOME_PLAINS {
  dot_color = 0x99e3e8;
  background_color = 0x61b8ed;
  
  tree = (x, y) => {
  
    const tree = PIXI.Sprite.from("./assets/images/env/wave.png");
    tree.scale.x = 0.05;
    tree.scale.y = 0.05;
  
    tree.anchor.set(0.5, 1);
  
    tree.x = x;
    tree.y = y;
  
    return tree;
  };
  
  bounds_elements = () => {
      const calcs = this.bounds_calculate();
      const elements = [];
  
      let scroll = 0;
  
      for (let i = 0; i < 10; i++) {
  
        elements.push(this.tree(calcs.bound1.padding.x2 / 1.5, scroll + 90, 8));
        elements.push(this.tree(calcs.bound1.padding.x2 / 6, scroll + 40, 8));
        scroll += 180;
      }
  
      scroll = 0;
  
      for (let i = 0; i < 10; i++) {
  
        elements.push(this.tree(calcs.bound2.padding.x1 * 1.25, scroll + 90, 8));
        elements.push(this.tree(calcs.bound2.padding.x1 * 1.1, scroll + 120, 8));
        scroll += 180;
      }
  
      return elements;
  };
}

export class GUI {
  constructor (element){this.e = element};
  
  text = (string) => {
    this.e.innerText = string;
  };
  
  format = (formatting, number) => {
    this.e.innerText = new Intl.NumberFormat(...formatting).format(
      number,
    )
  };
  
  get_text = () => {
    return this.e.innerText;
  };
}

export class HiScore extends GUI {
  constructor (element){
    super();
    this.e = element;
    this.format(['en'],this.get_num());
  };
  
  save = (number) => {
    if (localStorage.getItem('SHS') === 'true') {
      localStorage.setItem("HS", number > this.get_num() ? number : this.get_num());
    };
  };
  
  get_num = () => {
    return localStorage.getItem("HS") || (() => {
      localStorage.setItem("HS", 0);
      return localStorage.getItem("HS");
    })();
  };
  
  format = (formatting, number) => {
    this.e.innerText = new Intl.NumberFormat(...formatting).format(
      (number > this.get_num() && localStorage.getItem('SHS') === 'true') ? number : this.get_num(),
    )
  };
}

export class RocketMiddle {
  constructor (app) {
    this.app = app;
    this.path = "./assets/images/rocket_bomb.png";
    
    let player = PIXI.Sprite.from(this.path);
    
    player.scale.x = 0.15;
    player.scale.y = 0.15;
    
    player.anchor.set(0.5);
    
    player.x = (this.app.screen.width / 2);
    player.y = -2000;
    
    app.stage.addChild(player);
    
    this.speed = 5;
    
    this.player = player;
    
    this.collPart = this.show_collision();
  }

  reset() {
    this.player.scale.x = 0.15;
    this.player.scale.y = 0.15;
    
    this.player.anchor.set(0.5);
    
    this.player.x = (this.app.screen.width / 2);
    this.player.y = -2000;
  }

  velTime(playerBounds) {
    this.player.y += this.speed;
    this.collPart.x = this.player.x - (this.collPartX / 2);
    this.collPart.y = this.player.y - (this.collPartY / 2);

    if (this.player.y > this.app.screen.height + 100) {
      this.player.y = -2000;
    }
    
    return this.calcCollision(playerBounds);
  }
  
  getCar() {
    return this.player;
  }
  
  show_collision() {
    this.collPartX = 75;
    this.collPartY = 110;
    
    let background = new PIXI.Graphics();
    background.beginFill(0xff0000);
    background.drawRect(0, 0, this.collPartX, this.collPartY);
    
    if (devMode === true) {
      background.alpha = 0.5;
    } else {
      background.alpha = 0;
    }
    
    this.app.stage.addChild(background);
    
    return background;
  }


  
  calcCollision(playerBounds) {
    if (!(this.player.y > playerBounds.y + (playerBounds.height / 2) + 100)) {
      
      if (testForCollisions(playerBounds, this.getBounds())) {

        if (devMode === true) {
          this.collPart.alpha = 1;
        }

        const video = new Video(this.app, "./assets/meme/exp1.mp4");
        video.create$play();
        setTimeout(() => video.remove$stop(), 2500);
        return true;
      }
    } else {
      if (devMode === true) {
        this.collPart.alpha = 0;
      }
      return false;
    }
  }
  
  getBounds() {
    return { x: this.collPart.x, y: this.collPart.y, width: this.collPart.width, height: this.collPart.height };
  }
}

export class Video {
  constructor(app, video_path, removeOnEnd = true) {
    this.app = app;
    this.video_path = video_path;
  }

  create$play() {
    const texture = PIXI.Texture.from(this.video_path);
    const videoSprite = new PIXI.Sprite(texture);
    this.videoSprite = videoSprite;

    this.videoSprite.width = this.app.screen.width;
    this.videoSprite.height = this.app.screen.height;

    this.app.stage.addChild(this.videoSprite);
  }

  remove$stop() {
    this.app.stage.removeChild(this.videoSprite);
    this.videoSprite = undefined;
  }
}