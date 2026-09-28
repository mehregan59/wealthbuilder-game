// Painted regional-city backdrop with live animation on top of it.
//
// The illustration carries all the architectural detail (Altstadt and river
// on the left, glass station in the centre-left, office campus centre-right,
// hills with solar and wind on the right) so the four playable districts sit
// inside one continuous city instead of on separate islands.
//
// Nothing here touches gameplay, decisions or scoring: it is scenery only.
class CityScape {
  constructor(scene) {
    this.scene = scene;
    this.S = scene.S || 1;
    this.turbines = [];
    this.vehicles = [];
    this.t = 0;
    this.reducedMotion = !!scene.reducedMotion;
    this._buildBackdrop();
    this._buildTurbines();
    this._buildTransit();
    this.anim = scene.add.graphics().setDepth(-2);
  }

  s(v) { return Math.round(v * this.S); }

  _buildBackdrop() {
    const sc = this.scene, W = sc.scale.width, H = sc.scale.height;
    const img = sc.add.image(W / 2, H / 2, 'cityPanorama').setDepth(-10);
    const cover = Math.max(W / img.width, H / img.height);
    img.setScale(cover);
    this.img = img;

    // A soft light wash keeps painted detail visible while giving the
    // interactive districts and their labels enough contrast to read.
    const wash = sc.add.graphics().setDepth(-9);
    wash.fillStyle(0xf2e7c9, 0.13); wash.fillRect(0, 0, W, H);
    wash.fillStyle(0x0d2b30, 0.10); wash.fillRect(0, H * 0.55, W, H * 0.45);
    this.wash = wash;
  }

  // Working wind turbines on the right-hand hills.
  _buildTurbines() {
    const sc = this.scene, W = sc.scale.width, H = sc.scale.height;
    const spots = [[0.74, 0.12], [0.84, 0.09], [0.93, 0.13]];
    spots.forEach((p, i) => {
      const x = W * p[0], y = H * p[1];
      const h = this.s(52 + i * 6), r = this.s(26 + i * 3);
      const tower = sc.add.graphics().setDepth(-3);
      tower.fillStyle(0xf7f5ee, 0.96);
      tower.fillTriangle(x - this.s(3), y + h, x + this.s(3), y + h, x, y);
      tower.fillStyle(0xe6e2d6, 0.95); tower.fillCircle(x, y, this.s(3.4));
      this.turbines.push({ x, y, r, a: Math.random() * Math.PI * 2, speed: 0.9 + i * 0.22 });
    });
  }

  // A commuter train on the viaduct and a tram on the main avenue.
  _buildTransit() {
    const sc = this.scene, W = sc.scale.width, H = sc.scale.height;
    this.vehicles = [
      { y: H * 0.29, x: -W * 0.2, w: this.s(78), h: this.s(11), color: 0xc4482f, speed: this.s(52), slope: 0.012 },
      { y: H * 0.42, x: -W * 0.6, w: this.s(52), h: this.s(9), color: 0xf0f3f2, speed: this.s(34), slope: 0.02 },
      { y: H * 0.47, x: -W * 1.1, w: this.s(16), h: this.s(7), color: 0x2f5f7a, speed: this.s(72), slope: 0.022 },
    ];
  }

  update(_time, delta) {
    if (!this.anim) return;
    const dt = Math.min(delta, 60) / 1000;
    const g = this.anim; g.clear();
    const W = this.scene.scale.width;

    // Rotating blades.
    this.turbines.forEach(t => {
      if (!this.reducedMotion) t.a += dt * t.speed;
      g.lineStyle(Math.max(2, this.s(3)), 0xfbfaf4, 0.95);
      for (let b = 0; b < 3; b++) {
        const a = t.a + (b * Math.PI * 2) / 3;
        g.lineBetween(t.x, t.y, t.x + Math.cos(a) * t.r, t.y + Math.sin(a) * t.r);
      }
    });

    // Trains, trams and street traffic following the painted routes.
    this.vehicles.forEach(v => {
      if (!this.reducedMotion) v.x += v.speed * dt;
      if (v.x > W + v.w * 2) v.x = -v.w * 3;
      const y = v.y + v.x * v.slope;
      g.fillStyle(0x1d2f2c, 0.22);
      g.fillRoundedRect(v.x, y + v.h * 0.8, v.w, v.h * 0.5, v.h * 0.25);
      g.fillStyle(v.color, 0.98);
      g.fillRoundedRect(v.x, y, v.w, v.h, Math.max(2, v.h * 0.35));
      g.fillStyle(0x24424a, 0.6);
      for (let wx = v.x + v.w * 0.12; wx < v.x + v.w * 0.9; wx += v.w * 0.2) {
        g.fillRect(wx, y + v.h * 0.25, Math.max(2, v.w * 0.08), Math.max(2, v.h * 0.35));
      }
    });
  }
}
