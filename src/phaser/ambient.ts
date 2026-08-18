import Phaser from "phaser";
import { ENV } from "./palette";
import { drawCar } from "./iso";

const CAR_COLORS = [0x3f7fc4, 0xd8624f, 0xf0c05a, 0xe4e7ea, 0x62b6de, 0x7bc47f, 0xb07bd0];

/** y of the street centre-line at screen x (matches skylineBackdrop geometry). */
function roadY(x: number, w: number, h: number, laneOffset: number) {
  const base = h * 0.6;
  const t = (x + 40) / (w + 80);
  return base + 40 - 80 * t + laneOffset;
}

function makeCar(scene: Phaser.Scene, color: number, s: number, flip: boolean) {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  drawCar(g, 0, 0, color, s);
  c.add(g);
  if (flip) c.setScale(-1, 1);
  return c;
}

/** Traffic, planes, birds and drifting clouds — pure ambience, no gameplay effect. */
export function addAmbientLife(scene: Phaser.Scene, w: number, h: number) {
  const layer = scene.add.container(0, 0);
  const slope = Math.atan2(-80, w + 80);

  // ---- traffic: two lanes, mixed speeds and vehicle sizes ----
  const lanes = [
    { offset: 20, dir: 1, scale: 0.95 },
    { offset: 52, dir: -1, scale: 1.15 },
  ];

  lanes.forEach((lane, li) => {
    const count = 4;
    for (let i = 0; i < count; i++) {
      const color = CAR_COLORS[(li * 3 + i * 2) % CAR_COLORS.length]!;
      const size = lane.scale * (0.8 + ((i * 37) % 50) / 100);
      const car = makeCar(scene, color, size, lane.dir < 0);
      car.setRotation(lane.dir > 0 ? slope : slope);
      layer.add(car);

      const from = lane.dir > 0 ? -90 : w + 90;
      const to = lane.dir > 0 ? w + 90 : -90;
      const speed = 40 + ((i * 53 + li * 29) % 70); // px per second, varied
      const duration = ((w + 180) / speed) * 1000;
      car.setPosition(from, roadY(from, w, h, lane.offset));

      scene.tweens.add({
        targets: car,
        x: to,
        duration,
        delay: (i * duration) / count,
        repeat: -1,
        repeatDelay: 0,
        onUpdate: () => car.setY(roadY(car.x, w, h, lane.offset)),
      });
    }
  });

  // ---- birds: small flapping chevrons drifting across the sky ----
  for (let i = 0; i < 7; i++) {
    const bird = scene.add.graphics();
    const s = 0.7 + ((i * 31) % 60) / 100;
    bird.lineStyle(2, 0x40515e, 0.75);
    bird.beginPath();
    bird.moveTo(-7 * s, 0);
    bird.lineTo(0, -4 * s);
    bird.lineTo(7 * s, 0);
    bird.strokePath();
    const dir = i % 2 === 0 ? 1 : -1;
    const y = 60 + ((i * 47) % 160);
    bird.setPosition(dir > 0 ? -30 - i * 40 : w + 30 + i * 40, y);
    layer.add(bird);

    const duration = 16000 + ((i * 1700) % 12000);
    scene.tweens.add({
      targets: bird,
      x: dir > 0 ? w + 60 : -60,
      duration,
      repeat: -1,
      delay: i * 900,
      onUpdate: () => bird.setY(y + Math.sin(bird.x / 70 + i) * 12),
    });
    scene.tweens.add({
      targets: bird,
      scaleY: 0.35,
      duration: 260 + i * 18,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  // ---- planes: high, slow, with a fading contrail ----
  for (let i = 0; i < 2; i++) {
    const plane = scene.add.container(0, 0);
    const g = scene.add.graphics();
    const s = i === 0 ? 1 : 0.7;
    g.fillStyle(0xf2f6fa, 1);
    g.fillEllipse(0, 0, 34 * s, 7 * s);
    g.fillStyle(0xd7e2ea, 1);
    g.fillTriangle(2 * s, 0, -10 * s, -9 * s, -2 * s, 0);
    g.fillTriangle(2 * s, 0, -10 * s, 9 * s, -2 * s, 0);
    g.fillStyle(0xb9c8d4, 1);
    g.fillTriangle(-15 * s, 0, -20 * s, -6 * s, -12 * s, 0);
    const trail = scene.add.graphics();
    trail.fillStyle(0xffffff, 0.35);
    trail.fillRect(-150 * s, -1.5 * s, 130 * s, 3 * s);
    trail.setAlpha(0.5);
    plane.add([trail, g]);
    plane.setScale(i === 0 ? 1 : -1, 1);

    const dir = i === 0 ? 1 : -1;
    const y = 46 + i * 74;
    plane.setPosition(dir > 0 ? -180 : w + 180, y);
    layer.add(plane);

    scene.tweens.add({
      targets: plane,
      x: dir > 0 ? w + 200 : -200,
      duration: 22000 + i * 9000,
      delay: 3000 + i * 11000,
      repeat: -1,
      repeatDelay: 9000 + i * 6000,
      ease: "Linear",
    });
  }

  // ---- drifting clouds ----
  for (let i = 0; i < 4; i++) {
    const cloud = scene.add.graphics();
    const s = 0.7 + ((i * 41) % 70) / 100;
    cloud.fillStyle(0xffffff, 0.6);
    cloud.fillEllipse(0, 0, 110 * s, 28 * s);
    cloud.fillEllipse(30 * s, -12 * s, 70 * s, 24 * s);
    cloud.fillEllipse(-34 * s, -6 * s, 60 * s, 20 * s);
    const y = 40 + ((i * 63) % 150);
    cloud.setPosition(-160 - i * 220, y);
    layer.add(cloud);
    scene.tweens.add({
      targets: cloud,
      x: w + 200,
      duration: 70000 + i * 18000,
      repeat: -1,
      delay: i * 6000,
    });
  }

  // keep the horizon haze reading as sky, not as objects popping in
  const haze = scene.add.graphics();
  haze.fillStyle(ENV.skyMid, 0.18);
  haze.fillRect(0, h * 0.36, w, 34);
  layer.add(haze);

  return layer;
}
