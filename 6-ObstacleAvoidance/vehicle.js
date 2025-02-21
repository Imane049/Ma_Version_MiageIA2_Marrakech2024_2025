/*
  Calcule la projection orthogonale du point a sur le vecteur b
  a et b sont des vecteurs calculés comme ceci :
  let v1 = p5.Vector.sub(a, pos); soit v1 = pos -> a
  let v2 = p5.Vector.sub(b, pos); soit v2 = pos -> b
  */
  function findProjection(pos, a, b) {
    let v1 = p5.Vector.sub(a, pos);
    let v2 = p5.Vector.sub(b, pos);
    v2.normalize();
    let sp = v1.dot(v2);
    v2.mult(sp);
    v2.add(pos);
    return v2;
  }
  let vehicleImage;

function preload(imgPath) {
  vehicleImage = loadImage(imgPath); 
}
  
  class Vehicle {
    static debug = false;
  
    constructor(x, y, imgPath="assets/vehicule.png") {
      // position du véhicule
      this.pos = createVector(x, y);
      // vitesse du véhicule
      this.vel = createVector(0, 0);
      // accélération du véhicule
      this.acc = createVector(0, 0);
      // vitesse forimale du véhicule
      this.maxSpeed = 4;
      // force maximale appliquée au véhicule
      this.maxForce = 0.3;
      this.color = "white";
      // à peu près en secondes
      this.dureeDeVie = 5;
  
      this.r_pourDessin = 16;
      // rayon du véhicule pour l'évitement
      this.r = this.r_pourDessin * 3;
  
      // Pour évitement d'obstacle
      this.distanceAhead = 50;
      this.largeurZoneEvitementDevantVaisseau = this.r / 2;
  
      // chemin derrière vaisseaux
      this.path = [];
      this.pathMaxLength = 20;
  
      // Paramètres pour separate (on pourra ajouter un curseur)
      this.distanceSeparation = this.r;
  
      // poids des comportements
      this.seekWeight = 1;
      this.avoidWeight = 3;
      this.separateWeight = 0.9;
      this.image = loadImage(imgPath);
      this.img = createGraphics(image.width, image.height)
      this.imageSize = 64; 
    }
  
   
    applyBehaviors(target, obstacles, vehicles) {
      let seekForce = this.arrive(target);
      let avoidForce = this.avoid(obstacles, false);
      let separateForce = this.separation(vehicles);
  
      seekForce.mult(this.seekWeight);
      avoidForce.mult(this.avoidWeight);
      separateForce.mult(this.separateWeight);
  
      this.applyForce(seekForce);
      this.applyForce(avoidForce);
      this.applyForce(separateForce);
  }
  
  
    avoid(obstacles, considereVehiculesCommeObstacles = false) {
      let force;
  
      // On calcule un pointdevant le véhicule courant
      // on l'appelle ahead
      // et on le postionne à une distance this.distanceAhead devant le véhicule
      let ahead = this.vel.copy();
     // ahead.normalize();
      ahead.mult(this.distanceAhead);
  
      // on prend un point ahead2 au milieu
      let ahead2 = ahead.copy();
      ahead2.mult(0.5);
  
      // On prend ahead3 = la position du vaisseau
      let ahead3 = ahead2.copy();
      ahead3.mult(0.5);
  
      if (Vehicle.debug) {
        // on dessine le vecteur ahead en jaune
        this.drawVector(this.pos, ahead, "yellow");
      }
      // Pour le dessiner, il faut lui ajouter la position du véhicule
      ahead.add(this.pos);
      ahead2.add(this.pos);
      ahead3.add(this.pos);
  
      if (Vehicle.debug) {
        // on le dessine en rouge
        fill("red");
        circle(ahead.x, ahead.y, 10);
  
        fill("lightblue");
        circle(ahead2.x, ahead2.y, 15);
  
        fill("pink");
        circle(ahead3.x, ahead3.y, 20);
      }
  
      // On cherche l'obstacle le plus proche
      let obstacleLePlusProche = this.getObstacleLePlusProche(obstacles);
  
      // On calcule la distance entre la position de l'obstacle le plus proche
      // et le point ahead
      let distance1 = ahead.dist(obstacleLePlusProche.pos);
      let distance2 = ahead2.dist(obstacleLePlusProche.pos);
      let distance3 = ahead3.dist(obstacleLePlusProche.pos);
      // on regarde laquelle est la plus petite
      let plusPetiteDistance = min(distance1, distance2);
      plusPetiteDistance = min(plusPetiteDistance, distance3);
  
  
      // si distance < rayon de l'obstacle + rayon du véhicule
      // Alors il y a collision possible, on calcule la force d'évitement
      if (plusPetiteDistance < obstacleLePlusProche.r + this.r / 2) {
        // collision possible, on calcule le vecteur qui va 
        // du centre de l'obstacle jusqu'au point ahead, il représente
        // la direction dans laquelle on doit aller pour éviter l'obstacle
        // c'est la  vitesse désirée ?
        let desiredSpeed;
        if(plusPetiteDistance == distance1){
          desiredSpeed = p5.Vector.sub(ahead, obstacleLePlusProche.pos);
        } else if(plusPetiteDistance == distance2){
          desiredSpeed = p5.Vector.sub(ahead2, obstacleLePlusProche.pos);
        } else {
          desiredSpeed = p5.Vector.sub(ahead3, obstacleLePlusProche.pos);
        }
  
        if (Vehicle.debug) {
          // On dessine ce vecteur qui part du centre de l'obstacle
          // et va vers le point ahead
          this.drawVector(obstacleLePlusProche.pos, desiredSpeed, "yellow");
        }
  
        // on calcule la force
        // 1 - on met desiredSpeed au maximum
        desiredSpeed.setMag(this.maxSpeed);
        
        // 2 - formule magique : force = vitesse desiree - vitesse actuelle
        force = p5.Vector.sub(desiredSpeed, this.vel);
        // on la limite
        force.limit(this.maxForce);
  
        // et on la renvoie
        return force;
      } else {
        // pas de collision possible
        force = createVector(0, 0);
      }
        return force;
      //}
  
      return createVector(0, 0);
  
    }
  
    avoidCorrige(obstacles) {
      // calcul d'un vecteur ahead devant le véhicule
      // il regarde par exemple 50 frames devant lui
      let ahead = this.vel.copy();
      ahead.mult(30);
      //on calcue ahead2 deux fois plus petit
      let ahead2 = ahead.copy();
      ahead2.mult(0.5);
  
      // on le dessine avec ma méthode this.drawVector(pos vecteur, color)
      this.drawVector(this.pos, ahead, "yellow");
  
      // Calcul des coordonnées du point au bout de ahead
      let pointAuBoutDeAhead = this.pos.copy().add(ahead);
      let pointAuBoutDeAhead2 = this.pos.copy().add(ahead2);
  
      // Detection de l'obstacle le plus proche
      let obstacleLePlusProche = this.getObstacleLePlusProche(obstacles);
  
      // Si pas d'obstacle, on renvoie un vecteur nul
      if (obstacleLePlusProche == undefined) {
        return createVector(0, 0);
      }
  
      // On calcule la distance entre le cercle et le bout du vecteur ahead
      let distance1 = pointAuBoutDeAhead.dist(obstacleLePlusProche.pos);
      let distance2 = pointAuBoutDeAhead2.dist(obstacleLePlusProche.pos);
      let distance = min(distance1, distance2);
  
  
      // On dessine le point au bout du vecteur ahead pour debugger
      fill("red");
      circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);
      fill("blue");
      circle(pointAuBoutDeAhead2.x, pointAuBoutDeAhead2.y, 10);
  
      // On dessine la zone d'évitement
      // Pour cela on trace une ligne large qui va de la position du vaisseau
      // jusqu'au point au bout de ahead
      stroke(100, 100);
      strokeWeight(this.largeurZoneEvitementDevantVaisseau);
      line(this.pos.x, this.pos.y, pointAuBoutDeAhead.x, pointAuBoutDeAhead.y);
  
      // si la distance est < rayon de l'obstacle
      // il y a collision possible et on dessine l'obstacle en rouge
  
      if (distance < obstacleLePlusProche.r + this.largeurZoneEvitementDevantVaisseau + this.r) {
        // collision possible 
  
        // calcul de la force d'évitement. C'est un vecteur qui va
        // du centre de l'obstacle vers le point au bout du vecteur ahead
        let force;
        if (distance1 < distance2) {
          force = p5.Vector.sub(pointAuBoutDeAhead, obstacleLePlusProche.pos);
        }
        else {
          force = p5.Vector.sub(pointAuBoutDeAhead2, obstacleLePlusProche.pos);
        }
        // on le dessine en jaune pour vérifier qu'il est ok (dans le bon sens etc)
        this.drawVector(obstacleLePlusProche.pos, force, "yellow");
  
        // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
        // on limite ce vecteur à la longueur maxSpeed
        // force est la vitesse désirée
        force.setMag(this.maxSpeed);
        // on calcule la force à appliquer pour atteindre la cible avec la formule
        // que vous commencez à connaitre : force = vitesse désirée - vitesse courante
        force.sub(this.vel);
        // on limite cette force à la longueur maxForce
        force.limit(this.maxForce);
        return force;
      } else {
        // pas de collision possible
        return createVector(0, 0);
      }
    }
  
    // Exerce une force renvoyant vers le centre du canvas si le véhicule s'approche
    // des bords du canvas
    boundaries() {
      const d = 25;
  
      let desired = null;
  
      // si le véhicule est trop à gauche ou trop à droite
      if (this.pos.x < d) {
        desired = createVector(this.maxSpeed, this.vel.y);
      } else if (this.pos.x > width - d) {
        desired = createVector(-this.maxSpeed, this.vel.y);
      }
  
      if (this.pos.y < d) {
        desired = createVector(this.vel.x, this.maxSpeed);
      } else if (this.pos.y > height - d) {
        desired = createVector(this.vel.x, -this.maxSpeed);
      }
  
      if (desired !== null) {
        desired.normalize();
        desired.mult(this.maxSpeed);
        const steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
      }
      return createVector(0, 0);
    }
  
    getObstacleLePlusProche(obstacles) {
      let plusPetiteDistance = 100000000;
      let obstacleLePlusProche = undefined;
  
      obstacles.forEach(o => {
        // Je calcule la distance entre le vaisseau et l'obstacle
        const distance = this.pos.dist(o.pos);
  
        if (distance < plusPetiteDistance) {
          plusPetiteDistance = distance;
          obstacleLePlusProche = o;
        }
      });
  
      return obstacleLePlusProche;
    }
  
    getVehiculeLePlusProche(vehicules) {
      let plusPetiteDistance = Infinity;
      let vehiculeLePlusProche;
  
      vehicules.forEach(v => {
        if (v != this) {
          // Je calcule la distance entre le vaisseau et le vehicule
          const distance = this.pos.dist(v.pos);
          if (distance < plusPetiteDistance) {
            plusPetiteDistance = distance;
            vehiculeLePlusProche = v;
          }
        }
      });
  
      return vehiculeLePlusProche;
    }
  
  
    getClosestObstacle(pos, obstacles) {
      // on parcourt les obstacles et on renvoie celui qui est le plus près du véhicule
      let closestObstacle = null;
      let closestDistance = 1000000000;
      for (let obstacle of obstacles) {
        let distance = pos.dist(obstacle.pos);
        if (closestObstacle == null || distance < closestDistance) {
          closestObstacle = obstacle;
          closestDistance = distance;
        }
      }
      return closestObstacle;
    }
  
    arrive(target) {
      // 2nd argument true enables the arrival behavior
      return this.seek(target, true);
    }
    separation(vehicles) {
      let perceptionRadius = 50; // Adjust based on desired distance
      let steering = createVector();
      let total = 0;
    
      for (let other of vehicles) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (other !== this && d < perceptionRadius) {
          let diff = p5.Vector.sub(this.pos, other.pos);
          diff.div(d * d); // Weight by distance squared
          steering.add(diff);
          total++;
        }
      }
    
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.vel);
        steering.limit(this.maxForce);
      }
    
      return steering;
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
  
    // inverse de seek !
    flee(target) {
      return this.seek(target).mult(-1);
    }
  
    /* Poursuite d'un point devant la target !
       cette methode renvoie la force à appliquer au véhicule
    */
    pursue(vehicle) {
      let target = vehicle.pos.copy();
      let prediction = vehicle.vel.copy();
      prediction.mult(10);
      target.add(prediction);
      fill(0, 255, 0);
      circle(target.x, target.y, 16);
      return this.seek(target);
    }
  
    evade(vehicle) {
      let pursuit = this.pursue(vehicle);
      pursuit.mult(-1);
      return pursuit;
    }
  
   
  
    // applyForce est une méthode qui permet d'appliquer une force au véhicule
    // en fait on additionne le vecteurr force au vecteur accélération
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      // on ajoute l'accélération à la vitesse. L'accélération est un incrément de vitesse
      // (accélératiion = dérivée de la vitesse)
      this.vel.add(this.acc);
      // on contraint la vitesse à la valeur maxSpeed
      this.vel.limit(this.maxSpeed);
      // on ajoute la vitesse à la position. La vitesse est un incrément de position, 
      // (la vitesse est la dérivée de la position)
      this.pos.add(this.vel);
  
      // on remet l'accélération à zéro
      this.acc.set(0, 0);
  
      // mise à jour du path (la trainée derrière)
      this.ajoutePosAuPath();
  
      // durée de vie
      this.dureeDeVie -= 0.01;
    }
  
    ajoutePosAuPath() {
      // on rajoute la position courante dans le tableau
      this.path.push(this.pos.copy());
  
      // si le tableau a plus de 50 éléments, on vire le plus ancien
      if (this.path.length > this.pathMaxLength) {
        this.path.shift();
      }
    }
  
    // On dessine le véhicule, le chemin etc.
    show() {
      // dessin du chemin
      this.drawPath();
      // dessin du vehicule
      this.drawVehicle();
    }
  
    drawVehicle() {
      // formes fil de fer en blanc
      stroke(255);
      // épaisseur du trait = 2
      strokeWeight(2);
  
      // formes pleines
      fill(this.color);
  
      // sauvegarde du contexte graphique (couleur pleine, fil de fer, épaisseur du trait, 
      // position et rotation du repère de référence)
      push();
      // on déplace le repère de référence.
      translate(this.pos.x, this.pos.y);
      // et on le tourne. heading() renvoie l'angle du vecteur vitesse (c'est l'angle du véhicule)
      rotate(this.vel.heading());
  
      // Dessin d'un véhicule sous la forme d'un triangle. Comme s'il était droit, avec le 0, 0 en haut à gauche
      // triangle(-this.r_pourDessin, -this.r_pourDessin / 2, -this.r_pourDessin, this.r_pourDessin / 2, this.r_pourDessin, 0);
      image(this.img, 0, 0, this.imageSize, this.imageSize);
      // Que fait cette ligne ?
      this.edges();
  
      // cercle pour le debug
      if (Vehicle.debug) {
        stroke(255);
        noFill();
        circle(0, 0, this.r);
      }
  
      // draw velocity vector
      pop();
      this.drawVector(this.pos, this.vel, color(255, 0, 0));
  
      // Cercle pour évitement entre vehicules et obstacles
      if (Vehicle.debug) {
        stroke(255);
        noFill();
        circle(this.pos.x, this.pos.y, this.r);
      }
    }
  
    drawPath() {
      push();
      stroke(255);
      noFill();
      strokeWeight(1);
  
      fill(this.color);
      // dessin du chemin
      this.path.forEach((p, index) => {
        if (!(index % 5)) {
  
          circle(p.x, p.y, 1);
        }
      });
      pop();
    }
    drawVector(pos, v, color) {
      push();
      // Dessin du vecteur vitesse
      // Il part du centre du véhicule et va dans la direction du vecteur vitesse
      strokeWeight(3);
      stroke(color);
      line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
      // dessine une petite fleche au bout du vecteur vitesse
      let arrowSize = 5;
      translate(pos.x + v.x, pos.y + v.y);
      rotate(v.heading());
      translate(-arrowSize / 2, 0);
      triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      pop();
    }
  
    // que fait cette méthode ?
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
  
  class Target extends Vehicle {
    constructor(x, y) {
      super(x, y);
      this.vel = p5.Vector.random2D();
      this.vel.mult(5);
    }
  
    show() {
      push();
      stroke(255);
      strokeWeight(2);
      fill("#F063A4");
      push();
      translate(this.pos.x, this.pos.y);
      circle(0, 0, this.r * 2);
      pop();
      pop();
    }
  }