import style from "./main.css";
import { BoardScene } from './board';
import { Game } from 'phaser';

const canvas = document.getElementById('game-canvas');

var config = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 600,
    canvas,
    backgroundColor: '#fafafa',
    scene: [
        BoardScene
    ]
};

new Game(config);