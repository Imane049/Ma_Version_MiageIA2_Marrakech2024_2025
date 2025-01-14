let pursuer1, pursuer2;
let target; 
let obstacles = [];
let vehicules = [];
let snakeMode = false;
let vformationMode = false;
let spacing = 50;
let leaderFollowerMode = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer1 = new Vehicle(100, 100);
  pursuer2 = new Vehicle(random(width), random(height));

  vehicules.push(pursuer1);
  //vehicules.push(pursuer2);
  // On cree un obstace au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
  obstacles.push(new Obstacle(width / 8, height / 8, 50, "green"));
}

function draw() {
  // changer le dernier param (< 100) pour effets de trainée
  background(0, 0, 0, 100);

  target = createVector(mouseX, mouseY);

  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  // dessin des obstacles
  // TODO
  obstacles.forEach(o => {
    o.show();
  })
  if (snakeMode) {
    vehicules.forEach((vehicle, index) => {
      if(index == 0){
         vehicle.applyBehaviors(target, obstacles, vehicules);
         vehicle.update();
      vehicle.show();}
      else{
          let previousVehiclePos = createVector(vehicules[index-1].pos.x, vehicules[index-1].pos.y);
        vehicle.applyBehaviors(previousVehiclePos, obstacles, vehicules);
        vehicle.update();
      vehicle.show();
      } 
     
    });
  } else if (vformationMode){
    vehicules.forEach((v, i) => {
      if (i === 0) {
        v.applyBehaviors(target, obstacles, vehicules);
      } else {
        let leaderIndex = Math.floor((i - 1) / 2);
        let leader = vehicules[leaderIndex];
    
        let isLeftFollower = (i % 2) === 1;
    
        let row = Math.floor(Math.log2(i + 1));
    
        let baseDistance = 100; 
        let forwardDistance = baseDistance / Math.sqrt(2); 
        let lateralDistance = baseDistance / Math.sqrt(2); 
    
        let scalingFactor = 1 * (1.2 ** row); 
        forwardDistance *= scalingFactor;
        lateralDistance *= scalingFactor;
    
        let offsetX = -forwardDistance; 
        let offsetY = isLeftFollower ? -lateralDistance : lateralDistance; 
        let formationTarget = createVector(
          leader.pos.x + offsetX,
          leader.pos.y + offsetY
        );
    
        v.applyBehaviors(formationTarget, obstacles, vehicules);
      }
    
      v.update();
      v.show();
    });
    
    
  }else if (leaderFollowerMode){
   

     
  } else {
  vehicules.forEach(v => {
    // pursuer = le véhicule poursuiveur, il vise un point devant la cible
    v.applyBehaviors(target, obstacles, vehicules);

    // déplacement et dessin du véhicule et de la target
    v.update();
    v.show();
  })};
}



function mousePressed() {
  // TODO : ajouter un obstacle de taille aléatoire à la position de la souris
  obstacles.push(new Obstacle(mouseX, mouseY, random(20, 100), "green"));
}


function keyPressed() {
  if (key == "a") {
    vehicules.push(new Vehicle(random(width), random(height)));
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  } else if (key == "f") {
    // on crée 10 véhicules à des position random espacées de 50px
    // en x = 20, y = hauteur du  canvas sur deux
    for (let i = 0; i < 10; i++) {
      let v = new Vehicle(20, 300 )
      // vitesse aléatoire
      v.vel = new p5.Vector(random(1, 5), random(1, 5));
      vehicules.push(v);
    }
  } else if (key == 's'){
    console.log("snake mode " + snakeMode);
    snakeMode = true;
  }
  else if( key == "n"){
    snakeMode = false;
  }
  else if(key == "v"){
    vformationMode = true;
  }
  else if(key == "l"){
    leaderFollowerMode = true;
  }
}