let imageFusee;
let vehicle;
// un tableau pour stocker les véhicules
let vehicles = [];

function preload() {
  // on charge une image de fusée pour le vaisseau
  imageFusee = loadImage('./assets/vehicule.png');
}

function setup() {
  createCanvas(1400, 700);
  creerSliderPourNombreDeVehicules(30);
  creerSliderPourLongueurCheminDerriereVehicules(100);
  creerUnSlider("Variation theta", 0, 0.5, 0.1, 0.1, 10, 50, "thetaVariation") 
  creerUnSlider("Vitesse Max", 1, 100, 5, 1, 10, 75, "maxSpeed") 
  creerUnSlider("Rayon Trainee", 1, 10, 3, 1, 10, 125, "traineeRayon")
  creerUnSlider("Rayon Cercle ", 1, 20, 3, 1, 10, 150, "circleRadius")

  // creerUnSlider("Longueur De Trainee", 10, 150, 100, 1, 10, 100, "longueurTrainee")

  vehicle = new Vehicle(100, 100, imageFusee);
}

// Fonction bien pratique pour créer un slider qui change une propriété précice de tous les véhicules
function creerUnSlider(label, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);

  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');

  slider.position(posX + 150, posY + 17);

  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY + 17);
  valueSpan.style('color', 'white');
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    vehicles.forEach(vehicle => {
      vehicle[propriete] = slider.value();
      console.log([propriete] +" : " + vehicle[propriete]);
    });
  });
}



function creerSliderPourNombreDeVehicules(nbVehicles) {
  // un slider pour changer le nombre de véhicules
  // min, max, valeur, pas
  let nbVehiclesSlider = createSlider(0, nbVehicles, 1, 1);
  nbVehiclesSlider.position(160, 40);
  let nbVehiclesLabel = createP("Nb de véhicules : " + nbVehiclesSlider.value());
  nbVehiclesLabel.position(10, 25);
  nbVehiclesLabel.style('color', 'white');
  // écouteur
  nbVehiclesSlider.input(() => {
    // on efface les véhicules
    vehicles = [];
    // on en recrée
    for (let i = 0; i < nbVehiclesSlider.value(); i++) {
      let vehicle = new Vehicle(100, 100+10*i, imageFusee);
      vehicles.push(vehicle);
    }
    // on met à jour le label
    nbVehiclesLabel.html("Nb de véhicules : " + nbVehiclesSlider.value());
  });
}

function creerSliderPourLongueurCheminDerriereVehicules(l) {
  let slider = createSlider(10, 150, l, 1);
  slider.position(160, 120);
  let label = createP("Longueur trainée : " + l);
  label.position(10, 100);
  label.style('color', 'white');
  // écouteur
  slider.input(() => {
    label.html("Longueur trainée : " + slider.value());
    let longueurTrainee = slider.value();
    vehicles.forEach(vehicle => {
      vehicle.longueurTrainee = longueurTrainee;
      vehicle.path=[];
      console.log(vehicle.longueurTrainee)
  });

})
}

// appelée 60 fois par seconde
function draw() {
  background(0);
 
  vehicle.applyBehaviors();
    vehicle.update();
    vehicle.show();
    vehicle.edges();
  vehicles.forEach(vehicle => {
    vehicle.applyBehaviors();
    vehicle.update();
    vehicle.show();
    vehicle.edges();
  });

 
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}

