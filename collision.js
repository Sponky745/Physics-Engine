const collide = (a, b) => {
  let poly1 = a;
  let poly2 = b;

  let overlap = Infinity;

  for (let shape = 0; shape < 2; shape++) {
    if (shape == 1) {
      poly1 = b;
      poly2 = a;
    }

    for (let a = 0; a < poly1.points.length; a++) {
      const b = (a + 1) % poly1.points.length;
      let axisProj = new Vector(-(poly1.points[b].y - poly1.points[a].y), poly1.points[b].x - poly1.points[a].x);
      axisProj.normalize();


      let min1 = Infinity;
      let max1 = -Infinity;

      for (let p = 0; p < poly1.points.length; p++) {
        let q = Vector.dot(poly1.points[p], axisProj);

        min1 = Math.min(min1, q);
        max1 = Math.max(max1, q);
      }

      let min2 = Infinity;
      let max2 = -Infinity;

      for (let p = 0; p < poly2.points.length; p++) {
        let q = Vector.dot(poly2.points[p], axisProj);

        min2 = Math.min(min2, q);
        max2 = Math.max(max2, q);
      }

      overlap = Math.min(Math.min(max1, max2) - Math.max(min1, min2), overlap);

      if (!(max2 >= min1 && max1 >= min2))
        return false;
    }
  }

  let normal = Vector.sub(b.pos, a.pos);
  normal.normalize();

  a.colliding = true;
  b.colliding = true;

  return {
    overlap: overlap,
    normal: normal,
  };
};

const resolve = (a, b, manifold) => {

  let penVec = Vector.mult(manifold.normal, manifold.overlap);
  if (a.inv_mass > 0 && b.inv_mass > 0)
    penVec.div(2);
  if (a.inv_mass > 0)
    a.pos.sub(penVec);
  if (b.inv_mass > 0)
    b.pos.add(penVec);

  let relVel = Vector.sub(a.vel, b.vel);
  let sepVel = Vector.dot(relVel, manifold.normal);
  let new_sepVel = -sepVel * (Math.min(a.restitution, b.restitution) * 0.1);

  let vsep_diff = new_sepVel - sepVel;
  let impulse = vsep_diff / (a.inv_mass + b.inv_mass);
  let impulseVec = Vector.mult(manifold.normal, impulse);

  let aAcc = Vector.mult(impulseVec,  a.inv_mass);
  let bAcc = Vector.mult(impulseVec, -b.inv_mass);

  // a.applyForce(impulseVec);
  // b.applyForce(Vector.mult(impulseVec, -1));

  a.vel.add(aAcc);
  b.vel.add(bAcc);

  let prevAngle = {
    a: a.angle,
    b: b.angle,
  };

  a.angle = a.vel.heading();
  b.angle = b.vel.heading();

  let offset = {
    a: prevAngle.a - a.angle,
    b: prevAngle.a - b.angle,
  };

  let newVel = {
    a: Math.sign(offset.a) * 0.2,
    b: Math.sign(offset.b) * 0.2,
  };

  a.angVel = newVel.a;
  b.angVel = newVel.b;
};
