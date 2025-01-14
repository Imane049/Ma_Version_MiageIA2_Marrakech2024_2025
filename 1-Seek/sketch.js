let target, vehicle;
let vehicles = [];
let speedSlider; // Add a slider for speed control

// la fonction setup est appelée une fois au démarrage du programme par p5.js
function setup() {
  console.log("setup");
  // on crée un canvas de 800px par 800px
  createCanvas(800, 800);

  // on crée un vecteur pour stocker la position de la souris
  target = createVector(0, 0);

  // on crée un véhicule
  //vehicle = new Vehicle(400, 400);

  creerVehicles(10);

  // Create a slider for speed control
  speedSlider = createSlider(0.5, 6, 3, 0.1);
  speedSlider.position(10, 10);
}

function creerVehicles(nbVehicules) {
  for (let i = 0; i < nbVehicules; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
    // on met une valeur randoml pour la vitesse max
    vehicles[i].maxSpeed = random(0.5, 6);
    // idem pour la force max
    vehicles[i].maxForce = random(0.1, 2);
  }
}
function createSlider(min, max, value, step) {
  let slider = createSlider(min, max, value, step);
  slider.style('width', '80px');
  return slider;
}

// la fonction draw est appelée en boucle par p5.js, 60 fois par seconde par défaut
// Le canvas est effacé automatiquement avant chaque appel à draw
function draw() {
  // On efface le canvas avec un fond noir, params = couleurs
  background("black");

  // A partir de maintenant toutes les formes pleines seront en rouge
  fill("red");
  // pas de contours pour les formes.
  // epaisseur du trait par défaut 1px;
  stroke("white")

  // mouseX et mouseY sont des variables globales de p5.js, elles correspondent à la position de la souris
  // on les stocke dans un vecteur pour pouvoir les utiliser avec la méthode seek (un peu plus loin)
  // du vehicule

  target.x = mouseX;
  target.y = mouseY;

  // Dessine un cercle de rayon 32px à la position de la souris
  // la couleur de remplissage est rouge car on a appelé fill(255, 0, 0) plus haut
  // pas de contours car on a appelé noStroke() plus haut
  // x, y, diametre (et pas rayon)
  circle(target.x, target.y, 32);

  // Display the slider value
  let speedValue = speedSlider.value();
  text("Speed: " + speedValue, speedSlider.x * 2 + speedSlider.width, 25);

  // Update the maxSpeed of all vehicles based on the slider value
  vehicles.forEach(vehicle => {
    vehicle.maxSpeed = speedValue;
    // je déplace et dessine le véhicule courant
    vehicle.applyBehaviors(target);
    vehicle.update();
    vehicle.edges();
    vehicle.update();
    vehicle.show();
  });
}
