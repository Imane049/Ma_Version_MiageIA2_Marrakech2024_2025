// Path Following (Path Following)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/LrnR6dc2IfM
// https://thecodingtrain.com/learning/nature-of-code/5.7-path-following.html

// Path Following: https://editor.p5js.org/codingtrain/sketches/dqM054vBV
// Complex Path: https://editor.p5js.org/codingtrain/sketches/2FFzvxwVt

// on v1 qui part de pos et va vers a,
// on a v2 qui part pos et va vers b
// renvoie le point b projeté sur v1
function findProjection(pos, a, b) {
  let v1 = p5.Vector.sub(a, pos);
  let v2 = p5.Vector.sub(b, pos);
  v2.normalize();
  let sp = v1.dot(v2);
  v2.mult(sp);
  v2.add(pos);
  return v2;
}

class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 6;
    this.maxForce = 0.1;
    this.r = 16;
  }

  applyBehaviors(path) {
    let force = this.follow(path);
    this.applyForce(force);
  }
  
  follow(path) {
    // Path following algorithm here!!

    // Step 1 calculate future position
    let future = this.vel.copy();
    // dans 20 frames d'animation
    future.mult(20);
    future.add(this.pos);

    // on le dessine en rouge
    fill(255, 0, 0);
    noStroke();
    circle(future.x, future.y, 16);

    // Step 2 Is future on path?
    // On calcule la projection perpendiculaire du point "futur" sur le chemin
    let target = findProjection(path.start, future, path.end);

    // on le dessine en vert
    fill(0, 255, 0);
    noStroke();
    circle(target.x, target.y, 16);

    // on regarde si la distance entre le point futur et le point projeté
    // est inférieure à la demi largeur du chemin.
    // Si oui, on efait rien, le vehicule est sur la route,
    // si non on fait seek vers le point projeté, pour rapprocher
    // le véhicule de la route
    let d = p5.Vector.dist(future, target);
    if (d > path.radius) {
      return this.seek(target);
    } else {
      return createVector(0, 0);
    }
  }

  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;
    if (arrival) {
      let slowRadius = 100;
      let distance = force.mag();
      if (distance < slowRadius) {
        desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
      }
    }
    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
