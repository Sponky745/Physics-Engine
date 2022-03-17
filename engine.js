const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const width = canvas.clientWidth;
const height = canvas.clientHeight;

const PI = 3.14159265358979233846;
const TAU = PI*2;

let frameCount = 0;

class Vector {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;

    return this;
  }

  static add(a, b) {
    let result = a.copy();
    return result.add(b);
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;

    return this;
  }

  static sub(a, b) {
    let result = a.copy();
    return result.sub(b)
  }

  mult(n) {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    this.w *= n;

    return this;
  }

  static mult(v, n) {
    let result = v.copy();
    return result.mult(n);
  }

  div(n) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    this.w /= n;

    return this;
  }

  static div(v, n) {
    let result = v.copy();
    return result.div(n);
  }

  copy() {
    return new Vector(this.x, this.y, this.z, this.w);
  }

  set(x = this.x, y = this.y, z = this.z, w = this.w) {

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    return this;
  }

  mag() {
    return Math.sqrt(this.x**2 + this.y**2 + this.z**2 + this.w**2);
  }

  setMag(mag) {
    this.normalize();
    this.mult(mag);

    return this;
  }

  heading() {
    return Math.atan2(this.y, this.x);
  }

  setHeading(heading) {
    let result = Vector.fromAngle(this.heading());
    result.mult(this.mag());
    this.mult(0).add(result);

    return this;
  }

  normalize() {
    if (this.mag() > 0) {
      this.div(this.mag());
      return this;
    }
    return this;
  }

  normal2D() {
    return new Vector(-this.y, this.x);
  }

  limit(max) {
    this.x = clamp(this.x, -max, max);
    this.y = clamp(this.y, -max, max);
    this.z = clamp(this.z, -max, max);
    this.w = clamp(this.w, -max, max);

    return this;
  }

  static up() {
    return new Vector(0, -1);
  }

  static down() {
    return new Vector(0 , 1);
  }

  static left() {
    return new Vector(-1, 0);
  }

  static right() {
    return new Vector(1 , 0);
  }

  show(from, scalar, col) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(from.x + this.x * scalar, from.y + this.y * scalar);
    ctx.strokeStyle = col;
    ctx.stroke();
  }

  static dot(a, b) {
    return a.x*b.x + a.y*b.y;
  }

  static fromAngle(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }
}

const circle = (x, y, r) => {
  ctx.beginPath();
  ctx.arc(x, y, r*2, 0, TAU);
  ctx.stroke();
};

const line = (x1, y1, x2, y2) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

const poly = (points) => {
  for (let i = 0; i < points.length; i++) {
    line(points[i].x, points[i].y, points[(i+1) % points.length].x, points[(i+1) % points.length].y);
  }
};

const clear = (x1, y1, x2, y2) => {
  ctx.clearRect(x1, y1, x2, y2);
};

const clamp = (n, min, max) => {
  return Math.max(Math.min(n, max), min);
};

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max-min+1)) + min;
};

const randFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

setup();

function mainLoop() {
  clear(0, 0, width, height);
  loop();
  frameCount++;
  requestAnimationFrame(mainLoop);
}
mainLoop();
