// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

// Equivalent du tableau de véhicules dans les autres exemples
const flock = [];
let fishImage;
let requinImage;
let stingrayImage;
let turtleImage;
var backgroundImage;
let fishImages = [];
let fishFilenames = ["fish1.png", "fish2.png", "fish3.png", "fish4.png"]; 
const stingrays = [];
const turtles = [];
let alignSlider, cohesionSlider, separationSlider;
let labelNbBoids;
let obstacles = [];
let target;
let requins = [];
let nbRequins;
let sharkSlider;
let yPos = 0.0; 

function preload() {
  for (let filename of fishFilenames) {
    fishImages.push(loadImage(`assets/${filename}`));
  }  
  requinImage = loadImage('assets/requin.png');
  stingrayImage = loadImage('assets/stingray.png');
  turtleImage = loadImage('assets/turtle.png');
  hameconImage = loadImage('assets/hamecon.png');
  backgroundImage = loadImage('assets/background.jpg');

}

function setup() {
  
  createCanvas(1400, 600);
  backgroundImage.resize(1600, 1600);

  imageMode(CORNER);  // Default mode, draws from top-left corner
  

  // Quelques sliders pour régler les "poids" des trois comportements de flocking
  // flocking en anglais c'est "se rassembler"
  // rappel : tableauDesVehicules, min max val step posX posY propriété
  const posYSliderDeDepart = 10;
  creerUnSlider("Poids alignment", flock, 0, 2, 1.5, 0.1, 10, posYSliderDeDepart, "alignWeight");
  creerUnSlider("Poids cohesion", flock, 0, 2, 1, 0.1, 10, posYSliderDeDepart+30, "cohesionWeight");
  creerUnSlider("Poids séparation", flock, 0, 15, 3, 0.1, 700, posYSliderDeDepart,"separationWeight");
  creerUnSlider("Poids boundaries", flock, 0, 15, 10, 1, 350, posYSliderDeDepart,"boundariesWeight");
  
  creerUnSlider("Rayon des boids", flock, 4, 40, 6, 1, 350, posYSliderDeDepart+30,"r");
  creerUnSlider("Perception radius", flock, 15, 60, 25, 1, 700, posYSliderDeDepart+30,"perceptionRadius");
  
  sharkSlider = createSlider(0, 20, 5, 1);  // min = 0, max = 20, default = 5, step = 1
  sharkSlider.position(1200, posYSliderDeDepart +16);
  let labelSharks = createP("Nombre de requins");
  labelSharks.position(1050, posYSliderDeDepart );
  labelSharks.style('color', 'white');
  
  createSharks(sharkSlider.value());

  // On créer les "boids". Un boid en anglais signifie "un oiseau" ou "un poisson"
  // Dans cet exemple c'est l'équivalent d'un véhicule dans les autres exemples
  for (let i = 0; i < 200; i++) {
    let randomImage = random(fishImages);
    const b = new Boid(random(width), random(height), randomImage);
    b.r = random(30, 60);
    flock.push(b);
  }
  for (let i = 0; i < 15; i++) {
    const s = new Boid(random(width), random(height), stingrayImage);
    s.r = 80; 
    s.maxSpeed = 3; 
    s.maxForce = 0.1;
    s.separationWeight = 5
    stingrays.push(s);
  }
  for (let i = 0; i < 20; i++) {
    const s = new Boid(random(width), random(height), turtleImage);
    s.r = 80; 
    s.maxSpeed = 3; 
    s.maxForce = 0.1;
    s.separationWeight = 5;
    turtles.push(s);
  }
  // Créer un label avec le nombre de boids présents à l'écran
   labelNbBoids = createP("Nombre de boids : " + flock.length);
  // couleur blanche
  labelNbBoids.style('color', 'white');
  labelNbBoids.position(1050, posYSliderDeDepart+30);

  // target qui suit la souris
  target = createVector(mouseX, mouseY);
  target.r = 50;

  for (let i = 0; i < 5; i++) { 
    let shark = new Boid(random(width), random(height), requinImage);
    shark.r = 150; 
    shark.maxSpeed = 7; 
    shark.maxForce = 0.5; 
    requins.push(shark);
  }
  
}

function creerUnSlider(label, tabVehicules, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);
  
  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');

  slider.position(posX + 150, posY + 17);

  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY+17);
  valueSpan.style('color', 'white');
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    tabVehicules.forEach(vehicle => {
      vehicle[propriete] = slider.value();
    });
  });

  return slider;
}
function createSharks(num) {
  requins = [];  
  for (let i = 0; i < num; i++) {
    let shark = new Boid(random(width), random(height), requinImage);
    shark.r = 150;
    shark.maxSpeed = 7;
    shark.maxForce = 0.5;
    requins.push(shark);
  }
}

function draw() {
  background(239, 276, 250);

  fill(118, 170, 206);
  // We are going to draw a polygon out of the wave points
  beginShape();

  let xPos = 0; // Option #1: 2D Noise
  // let xoff = yoff; // Option #2: 1D Noise

  // Iterate over horizontal pixels
  for (let x = 0; x <= width; x += 10) {
    // Calculate a y value according to noise, map to

    // Option #1: 2D Noise
    let y = map(noise(xPos, yPos), 0, 1, 200, 300);


    // Set the vertex
    vertex(x, y);
    // Increment x dimension for noise
    xPos += 0.05;
  }
  // increment y dimension for noise
  yPos += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

// background(backgroundImage);
// background(0);
  labelNbBoids.html("Nombre de boids : " + flock.length);

  target.x = mouseX;
  target.y = mouseY;
  imageMode(CENTER); 
  image(hameconImage, target.x, target.y, 80, 80);  
  let middleTopX = width / 2;
  let middleTopY = 0; // Y-coordinate is 0 for the top edge

  // Draw a white line from the middle of the top edge to the center of the hook
  stroke(255);  // Set the line color to white
  line(middleTopX, middleTopY, target.x, target.y);
  // fill("lightgreen");
  // noStroke();
  // ellipse(target.x, target.y, target.r, target.r);
  let numSharks = sharkSlider.value();
  if (requins.length !== numSharks) {
    createSharks(numSharks);
  }
 

  stingrays.forEach((stingray, index) => {
    stingray.flock(stingrays);
    // stingray.fleeWithTargetRadius(target);
    stingray.fleeObstaclesWithTargetRadius(obstacles);
    stingray.fleeObstaclesWithTargetRadius(turtles);


    if (index == 0){
      let seekForce =  stingray.seek(target, true);
      seekForce.mult(10);
      stingray.applyForce(seekForce);
    } else {
      let previousStingrayPos = createVector(stingrays[index-1].pos.x, stingrays[index-1].pos.y);
      let seekForce = stingray.seek(previousStingrayPos, true);
      seekForce.mult(10);
      stingray.applyForce(seekForce);
    }
    
    stingray.edges();
    stingray.update();
    stingray.show(false);
  });
  turtles.forEach((turtle, index) => {
    turtle.fleeWithTargetRadius(target);
    turtle.fleeObstaclesWithTargetRadius(obstacles);
    turtle.fleeObstaclesWithTargetRadius(stingrays);


    if (index == 0){
      let seekForce = turtle.seek(target, true, 300);
      seekForce.mult(2);
      turtle.applyForce(seekForce);
    } else {
      let previousturtlePos = createVector(turtles[index-1].pos.x, turtles[index-1].pos.y);
      let seekForce = turtle.seek(previousturtlePos, true);
      seekForce.mult(10);
      turtle.applyForce(seekForce);
    }
    
    turtle.edges();
    turtle.update();
    turtle.show(false);
  });
  for (let boid of flock) {
    boid.flock(flock);
    boid.fleeWithTargetRadius(target);
    boid.fleeObstaclesWithTargetRadius(obstacles);
    boid.update();
    boid.show();
  }

  for (let obstacle of obstacles) {
    obstacle.show();
  }

  for (let requin of requins) {
    let wanderForce = requin.wander();
    wanderForce.mult(1);
    requin.applyForce(wanderForce);

    requin.fleeObstaclesWithTargetRadius(obstacles);
    

    let rayonDeDetection = 90;
    let closest = requin.getVehiculeLePlusProche(flock);
    noFill();
    stroke("yellow");
    ellipse(requin.pos.x, requin.pos.y, rayonDeDetection*2, rayonDeDetection*2);
    if (closest && flock.includes(closest)) {
      let d = p5.Vector.dist(requin.pos, closest.pos);
      if (d < rayonDeDetection) {
        let seekForce = requin.seek(closest.pos);
        seekForce.mult(7);
        requin.applyForce(seekForce);
      }
      if (d < 5) {
        let index = flock.indexOf(closest);
        flock.splice(index, 1);
      }
    }

    requin.edges();
    requin.update();
    requin.show(false);
  }

}

function mouseDragged() {
  let fishImage =  random(fishImages);

  const b = new Boid(mouseX, mouseY, fishImage);
  
  b.r = random(30, 60);

  flock.push(b);


}

function keyPressed() {
 if (key === 'd') {
    Boid.debug = !Boid.debug;
  } else if (key === 'r') {
    // On donne une taille différente à chaque boid
    flock.forEach(b => {
      b.r = random(30, 60);
    });
  } else if(key == 'o'){
    let r = random(40, 70); 
    let red = random(0, 255);
    let green = random(0, 255);
    let blue = random(0, 255);
    let randomColor = color(red, green, blue);
    obstacles.push(new Obstacle(mouseX, mouseY, r, randomColor));
  }
}
