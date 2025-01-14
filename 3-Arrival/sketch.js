let target;
let vehicles = [];
let font;
let mode = "snake";
if(keyPressed() === "t") {
  mode = "texte";
  console.log("texte");
}else {
mode = "snake";
}

// Appelée avant de démarrer l'animation, utile pour l'exercice avec text2points
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  font = loadFont('./assets/inconsolata.otf');
}

function setup() {
  createCanvas(800, 800);

  target = createVector(0, 0);
  targets = font.textToPoints('E!', 116, 300, 335,
    { sampleFactor: 0.05 });
  let vehicles = createVehicles(targets.length);
  }
function createVehicles(nb) {
  for(let i = 0; i < nb; i++){
    vehicles.push(new Vehicle(random(width), random(height)));
  };
}


// appelée 60 fois par seconde
function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);
  for (let p of targets) {
    push();
    fill(255);
    circle(p.x, p.y, 10);
    pop();
  }
  // Cible qui suit la souris, cercle rouge de rayon 32
  target.x = mouseX;
  target.y = mouseY;
   vehicles.forEach((vehicle, index) => {
    if(mode === "snake") {
    if (index === 0) {
      // Le vehicule courant est le premier, il suit la target dirigée par la souris
      vehicle.applyBehaviors(target);
    } else {
      // Les autres vehicules suivent le vehicule précédent
      let vehiculePrecedent = vehicles[index - 1];
      vehicle.applyBehaviors(vehiculePrecedent.pos, 15);

      // On dessine une ligne transparente entre le véhicule courant et le véhicule précédent
      push();
      stroke(255, 50);
      strokeWeight(vehicle.r)
      line(vehicle.pos.x, vehicle.pos.y, vehiculePrecedent.pos.x, vehiculePrecedent.pos.y);
      pop();
    }
  } else if(mode === "texte") {
      vehicles.forEach((vehicle, index) => {
        vehicle.applyBehaviors(createVector(targets[index].x, targets[index].y)); 
        
      })
  }
    vehicle.update();
    vehicle.show();
  });
  
  // dessin de la cible en rouge
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

 
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  } else if(key == 't'){
    mode = 'texte';
  }
}