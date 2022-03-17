let bodies = [];

let selected = null;

const TIMESTEPS = 5;
const NUM_POLYGONS = 10;
const friction = 0.01;
const angFriction = 0.1;

function setup() {
  bodies.push(regular_polygon(randInt(0, width), randInt(0, height), randInt(20, 50), 3, randInt(0, 4), randFloat(0, TAU)));


  for (let i = 1; i < NUM_POLYGONS; i++)
    bodies.push(regular_polygon(randInt(0, width), randInt(0, height), randInt(20, 50), randInt(3, 10), randInt(0, 4), randFloat(0, TAU)));
}

function loop() {

  keyControl(bodies[0]);

  for (let i = 0; i < bodies.length; i++) {
    const a = bodies[i];

    let collData;

    const gravity = new Vector(0, 0.3);

    a.applyForce(Vector.mult(gravity, a.mass));

    for (let t = 0; t < TIMESTEPS; t++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];

        collData = collide(a, b);

        if (collData) {
          resolve(a, b, collData);
          ctx.fillText("COLLIDE", 500, 500);
        }
      }
    }

    a.boundaries();
    a.update();
    a.show();
  }
}

const regular_polygon = (x, y, r, num_sides, m, a = 0) => {
  return new Poly(x, y, (index, pos, theta) => {
    let angle = index * (TAU / num_sides) + theta + a;

    let x = r * Math.cos(angle) + pos.x;
    let y = r * Math.sin(angle) + pos.y;

    return new Vector(x, y);
  }, num_sides, m, r);
}

window.addEventListener("click", (e) =>{
  const pos = new Vector(e.clientX, e.clientY);


  for (const body of bodies) {
    if (Vector.sub(pos, body.pos) < body.r)
      selected = body;
  }

  bodies.push(regular_polygon(pos.x, pos.y, randInt(20, 50), randInt(3, 10), randInt(0, 4)));

});

window.addEventListener("mousemove", (e) => {
  const pos = new Vector(e.clientX, e.clientY);

  if (selected !== null) {
    selected.pos.set(pos.x, pos.y);
  }
});

window.addEventListener("mouseup", (e) => {
  selected = null;
});

const keyControl = (poly) => {
  window.addEventListener("keydown", (e) => {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 39:
        poly.applyForce(Vector.right().mult(5));
        poly.angle = poly.acc.heading();
        break;
      case 37:
        poly.applyForce(Vector.left().mult(5));
        poly.angle = poly.acc.heading();
        break;
      case 38:
        poly.applyForce(Vector.up().mult(5));
        poly.angle = poly.acc.heading();
        break;
      case 40:
        poly.applyForce(Vector.down().mult(5));
        poly.angle = poly.acc.heading();
        break;
    }
  });
}

window.addEventListener("keydown", (e) => {
  // console.log(e.keyCode);
  switch (e.keyCode) {
    case 67:
      bodies.length = 0;
      break;
  }
});
