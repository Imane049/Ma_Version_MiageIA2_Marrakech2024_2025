let pursuer;
let target;

// Appelé une seule fois après que la page ait été affichée à l'écran

function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer = new Vehicle(random(width), random(height));

  target = new Target(random(width), random(height), 30);
}


function draw() {
  background(0);
    // pursuer = le véhicule poursuiveur, il vise un point devant la cible
    pursuer.applyBehaviors(target);

    // déplacement et dessin du véhicule et de la target
    pursuer.update();
    pursuer.edges();
    pursuer.show();

  // lorsque la target atteint un bord du canvas elle ré-apparait de l'autre côté
  target.update();
  target.edges();
  target.show();

  // Est-ce que le véhicule est en collision avec la target ?
  let distance = p5.Vector.dist(pursuer.pos, target.pos);
  if(distance < 30) {
    target.pos.x = random(width);
    target.pos.y = random(height);
  }
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}
