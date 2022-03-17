class Poly {
  constructor(x, y, create, edges, m, r) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);

    this.terminalVelocity = 15;

    this.colliding = false;

    this.restitution = 1;

    this.r = r;

    this.points = [];
    this.edges = edges;

    this.mass = m;

    if (this.mass == 0) {
      this.inv_mass = 0;
    } else {
      this.inv_mass = 1 / this.mass;
    }

    this.creationFormula = create;
    for (let i = 0; i < this.edges; i++) {
      this.points[i] = this.creationFormula(i, this.pos, this.angle);
    }

    this.angle = 0;
    this.angVel = 0;

    this.dir = Vector.fromAngle(this.angle);
  }

  applyForce(force) {
    this.acc.add(Vector.mult(force, this.inv_mass));
  }

  show() {
    // ctx.strokeStyle = (this.colliding) ? "red" : "black";

    line(this.pos.x, this.pos.y, this.points[0].x, this.points[0].y);
    poly(this.points);
    ctx.fillText(this.mass, this.pos.x, this.pos.y);
  }

  thrust(speed) {
    this.applyForce(Vector.mult(this.dir, speed));
  }

  boundaries() {
    if (this.pos.y > height - this.r) {
      this.vel.y *= -this.restitution;
      this.pos.y = height - this.r;
      this.angle = this.vel.heading();
    }
    if (this.pos.y < this.r) {
      this.vel.y *= -this.restitution;
      this.pos.y = this.r;
      this.angle = this.vel.heading();
    }

    if (this.pos.x < this.r) {
      this.vel.x *= -this.restitution;
      this.pos.x = this.r;
      this.angle = this.vel.heading();
    }

    if (this.pos.x > width - this.r) {
      this.vel.x *= -this.restitution;
      this.pos.x = width - this.r;
      this.angle = this.vel.heading();
    }
  }

  update() {
    this.angle += this.angVel;
    this.dir = Vector.fromAngle(this.angle);

    let fric = this.vel.copy();

    if (this.vel.mag() > 0.001) {
      fric.setMag(-friction);
    }

    this.applyForce(fric);

    this.vel.add(this.acc);
    this.vel.limit(this.terminalVelocity);
    this.pos.add(this.vel);

    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = this.creationFormula(i, this.pos, this.angle);
    }

    this.angVel *= 1 - angFriction;
    this.vel.mult(1 - friction);
    this.acc.set(0, 0);

    if (this.vel.mag() > 0) {
      this.vel.copy().normalize().show(this.pos, 50, "green")
    }
  }
}

class Ball extends Poly {
  constructor(x, y, m, r) {
    super(x, y, (index, pos, theta) => {
      let angle = index * (TAU / 30) + theta;

      let x = r * Math.cos(angle) + pos.x;
      let y = r * Math.sin(angle) + pos.y;

      return new Vector(x, y);
    }, 30, m, r);

    this.isBall = true;
  }
}

class SemiCircle extends Poly {
  constructor(x, y, m, r) {
    super(x, y, (index, pos, theta) => {
      let angle = index * (TAU / 30) + theta;

      let x = r * Math.cos(angle) + pos.x;
      let y = r * Math.sin(angle) + pos.y;

      return new Vector(x, y);
    }, 15, m, r);

    this.isBall = true;
  }
}
