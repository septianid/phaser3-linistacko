import Phaser from "phaser";

var boxGroup;

var timer;
var timerEvent;
var removeEvent;

var timeText;

var ground;
var movingBox;
var canDrop;
var userScore;

var boxHeight;
var groundHeight;

var adButton;

var gameOption = {

  gameTime: 30,
  boxMoveRange: [-300, 300],
  boxSpeed: 800
}

// window.onbeforeunload = () => {
//
//   localStorage.clear();
//   return "Do you really want to leave our application?";
// }

export class InGame extends Phaser.Scene{

  constructor(){

    super("PlayGame")
  }

  preload(){

    this.load.image('box', './src/assets/box.png');
    this.load.image('ground', './src/assets/ground.png');
    this.load.image('ad_button', './src/assets/ad_button.png');
  }

  create(){

    boxHeight = this.textures.get('box').getSourceImage().height;
    groundHeight = this.textures.get('ground').getSourceImage().height;


    adButton = this.add.sprite(670, 50, 'ad_button').setScale(0.2);
    adButton.setOrigin(0.5, 0.5);
    adButton.setInteractive();

    adButton.on('pointerdown', () => {

      let video = document.createElement('video');
      let element;

      video.src = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
      video.playsinline = true;
      video.width = 720;
      video.height = 1280;
      video.autoplay = true;

      console.log(video);

      video.addEventListener('play', (event) => {

        element = this.add.dom(360, 640, video, {
          'background-color': 'black'
        });
        console.log('Test');
      })

      video.addEventListener('ended', (event) => {

        element.destroy();
      })

    })

    userScore = 0;
    timer = 0;
    timerEvent = null;
    canDrop = true;


    boxGroup = this.add.group();

    timeText = this.add.text(50, 50, ''+gameOption.gameTime, {

      font: 'bold 56px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    ground = this.matter.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'ground');
    ground.setBody({

      type: 'rectangle',
      width: ground.displayWidth,
      height: ground.displayHeight,
    })
    ground.setFriction(1);
    ground.setOrigin(0.5, 0.5);
    ground.setStatic(true);

    this.movingItem();
    this.matter.world.on('collisionstart', (e, obj1, obj2) => {

      //console.log(obj1.isCrate);
      //console.log(obj2.isCrate);
      if(obj1.isCrate && !obj1.hit){

        obj1.hit = true;
        this.createNewItem();
      }

      if(obj2.isCrate && !obj2.hit){

        obj2.hit = true;
        this.createNewItem();
      }
    });
    this.input.on('pointerdown', () => {

      if(canDrop == true && timer < gameOption.gameTime){

        this.gameTimer();
        movingBox.visible = false;
        canDrop = false;
        this.fallingItem();
      }
    })
  }

  update(){

    boxGroup.getChildren().forEach((box) => {

      if(box.y > (this.game.config.height + box.displayHeight)){

        if(!box.body.hit){

          this.createNewItem()
        }

        box.destroy();
      }
    })
  }

  getStackHeight(){

    let maxHeight = 0;
    boxGroup.getChildren().forEach((item) => {

      // if(item.hit){
      //
      //   let height = Math.round((this.game.config.height - ))
      // }
    })
  }

  gameTimer(){

    if(timerEvent == null){

      timerEvent = this.time.addEvent({

        delay: 1000,
        callback: this.timeTick,
        callbackScope: this,
        loop: true
      })
    }
  }

  timeTick(){

    timer++;
    //console.log(timer);
    timeText.text = gameOption.gameTime - timer;
    if(timer >= gameOption.gameTime){

      //console.log('Called');
      timerEvent.remove();
      movingBox.destroy();

      this.time.addEvent({

        delay: 1000,
        callback: function(){

          boxGroup.getChildren().forEach((box) => {

            box.setStatic(true);
          })
          removeEvent = this.time.addEvent({

            delay: 100,
            callback: this.removeItem,
            callbackScope: this,
            loop: true
          })
        },
        callbackScope: this,
      })
    }
  }

  createNewItem(){

    canDrop = true;
    movingBox.visible = true;
  }

  movingItem(){

    movingBox = this.add.sprite(this.game.config.width / 2 - gameOption.boxMoveRange[0], ground.getBounds().top - 700, 'box');
    //movingBox.body.friction = 1;
    movingBox.setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: movingBox,
      x: this.game.config.width / 2 - gameOption.boxMoveRange[1],
      duration: gameOption.boxSpeed,
      yoyo: true,
      repeat: -1
    })
  }

  fallingItem(){

    let fallingBox = this.matter.add.sprite(movingBox.x, movingBox.y, 'box');
    fallingBox.setFriction(1);
    fallingBox.setOrigin(0.5, 0.5);

    //console.log(fallingBox);
    fallingBox.body.isCrate = true;
    fallingBox.body.hit = false;

    boxGroup.add(fallingBox);
  }

  removeItem(){

    if(boxGroup.getChildren().length > 0){

      let tempBox;
      let stackHeight;
      let boxScoreText;

      tempBox = boxGroup.getFirstAlive();
      stackHeight = Math.round((this.game.config.height - groundHeight - tempBox.y - boxHeight / 2) / boxHeight) + 1;
      userScore += stackHeight;

      boxScoreText = this.add.text(tempBox.x, tempBox.y, ''+stackHeight, {

        font: 'bold 20px Arial',
        fill: 'white',
        align: 'center'
      }).setOrigin(0.5, 0.5);

      //console.log(userScore);
      tempBox.destroy();
    }

    else {

      let userScoreText

      removeEvent.remove();
      console.log(userScore);

      this.add.text(360, 640, 'YOUR SCORE', {

        font: 'bold 40px Arial',
        fill: 'white',
        align: 'center'
      }).setOrigin(0.5, 0.5);

      userScoreText = this.add.text(360, 700, ''+userScore,{

        font: 'bold 43px Arial',
        fill: 'white',
        align: 'center'
      }).setOrigin(0.5, 0.5);

      //this.scene.start('PlayGame');
      this.input.on('pointerdown', () => {

        this.scene.start('PlayGame');
      })
    }
  }



}
