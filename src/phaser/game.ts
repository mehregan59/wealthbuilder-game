import Phaser from "phaser";
import { TrackSelectScene } from "./scenes/TrackSelectScene";
import { WorldScene } from "./scenes/WorldScene";
import { VerdictScene } from "./scenes/VerdictScene";

export const BASE_WIDTH = 1280;
export const BASE_HEIGHT = 780;

export function createAct1Game(parent: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#040b12",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
    },
    render: { antialias: true, roundPixels: false },
    scene: [TrackSelectScene, WorldScene, VerdictScene],
  });
}