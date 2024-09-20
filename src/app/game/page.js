'use client';

import { useEffect } from 'react';
import * as Phaser from 'phaser';

export default function GamePage() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            class MainScene extends Phaser.Scene {
                constructor() {
                    super('MainScene');
                    this.foodTimer = null;
                    this.trashTimer = null;
                }

                preload() {
                    this.load.image('pizza', '/2d_pic/pizza.png');
                    this.load.image('bread', '/2d_pic/bread.png');
                    this.load.image('icecream', '/2d_pic/icecream.png');
                    this.load.image('soda', '/2d_pic/soda.png');
                    this.load.image('apple', '/2d_pic/apple.png');
                    this.load.image('trash', '/2d_pic/trash.png');
                    this.load.image('player', '/2d_pic/player.png');
                    console.log('Preload function called');
                }

                create() {
                    console.log('Create function called');
                    this.player = this.physics.add.sprite(400, 550, 'player').setCollideWorldBounds(true);

                    this.foods = this.physics.add.group();
                    this.foodTimer = this.time.addEvent({
                        delay: 1000,
                        callback: this.addFood,
                        callbackScope: this,
                        loop: true
                    });

                    this.trash = this.physics.add.group();
                    this.trashTimer = this.time.addEvent({
                        delay: 4000,
                        callback: this.addTrash,
                        callbackScope: this,
                        loop: true
                    });

                    this.cursors = this.input.keyboard.createCursorKeys();

                    this.physics.add.collider(this.player, this.foods, this.collectFood, null, this);
                    this.physics.add.collider(this.player, this.trash, this.hitTrash, null, this);

                    this.lives = 3;
                    this.livesText = this.add.text(16, 50, 'Lives: 3', { fontSize: '32px', fill: '#fff' });

                    this.score = 0;
                    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
                }

                update() {
                    if (this.cursors.left.isDown) {
                        this.player.setVelocityX(-160);
                    } else if (this.cursors.right.isDown) {
                        this.player.setVelocityX(160);
                    } else {
                        this.player.setVelocityX(0);
                    }

                    this.foods.children.entries.forEach((food) => {
                        if (food.y > 600) {
                            food.setPosition(Phaser.Math.Between(50, 750), 0);
                        }
                    });

                    this.trash.children.entries.forEach((trash) => {
                        if (trash.y > 600) {
                            trash.setPosition(Phaser.Math.Between(50, 750), 0);
                        }
                    });
                }

                addFood() {
                    console.log('Add food function called');
                    const foodTypes = ['pizza', 'bread', 'icecream', 'soda', 'apple'];
                    const randomFood = Phaser.Math.Between(0, foodTypes.length - 1);
                    const food = this.foods.create(Phaser.Math.Between(50, 750), 0, foodTypes[randomFood]);
                    food.setScale(1.5);
                    food.setGravityY(30);
                }

                addTrash() {
                    console.log('Add trash function called');
                    const trash = this.trash.create(Phaser.Math.Between(50, 750), 0, 'trash');
                    trash.setScale(1.5);
                    trash.setGravityY(30);
                }

                collectFood(player, food) {
                    console.log('Collect food function called');
                    food.destroy();
                    this.score += 10;
                    this.scoreText.setText('Score: ' + this.score);
                }

                hitTrash(player, trash) {
                    console.log('Hit trash function called');
                    trash.destroy();
                    this.lives -= 1;
                    this.livesText.setText('Lives: ' + this.lives);

                    if (this.lives <= 0) {
                        this.endGame();
                    }
                }

                endGame() {
                    this.physics.pause();
                    if (this.foodTimer) this.foodTimer.remove();
                    if (this.trashTimer) this.trashTimer.remove();
                    this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);
                }
            }

            const config = {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                parent: 'phaser-game',
                scene: MainScene,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 300 },
                        debug: false
                    }
                }
            };

            const game = new Phaser.Game(config);

            return () => {
                game.destroy(true);
            };
        }
    }, []);

    return <div id="phaser-game"></div>;
}