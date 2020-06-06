import Phaser from "phaser";

var boxGroup;

var timer;
var timerEvent;
var removeEvent;

var timeText;

var landingGround;
var panicItem;
var isPossible;
var userScore;

var boxHeight;
var groundHeight;
var mainCamera;
var crateArray = []
var theCrate

var gameOption = {

  gameTime: 30,
  boxMoveRange: [-300, 300],
  boxSpeed: 800,
  fallingBoxHeight: 900
}

var gameData = {}
var logData = {}
var userLog = []

var CryptoJS = require('crypto-js')

window.onbeforeunload = () => {

  localStorage.clear();
  return "Do you really want to leave our application?";
}

export class InGame extends Phaser.Scene{

  constructor(){
    super("PlayGame")
  }

  init(data){
    gameData.id = data.id;
    gameData.session = data.session
    gameData.score = data.game_score
    gameData.sound = data.sound_status
  }

  preload(){

  }

  create(){

    var background = this.add.sprite(360, 1280, 'MENU_BG').setScale(0.68, 0.67)
    background.setOrigin(0.5, 1);

    boxHeight = 70;
    groundHeight = this.textures.get('GROUND').getSourceImage().height - 150;

    userScore = 0;
    timer = 0;
    timerEvent = null;
    isPossible = true;

    timeText = this.add.text(60, 50, ''+gameOption.gameTime, {
      fontSize: '65px',
      fontFamily: 'Bobbleboddy',
      fill: '#FFED00',
      align: 'center'
    }).setOrigin(0.5, 0.5);
    timeText.setStroke('#7F0800', 16);

    crateArray = ['B1', 'B2', 'B3', 'B4']

    boxGroup = this.add.group();

    landingGround= this.matter.add.sprite(this.game.config.width / 2, 1280, 'GROUND');
    landingGround.setBody({
      type: 'rectangle',
      width:  830,
      height: 450,
    }, {
      friction: 1,
      restitution: 0,
      isStatic: true,
      density: 10000
    })
    landingGround.setScale(0.55)
    landingGround.setOrigin(0.5, 1);

    theCrate = Phaser.Math.Between(0, crateArray.length - 1)
    this.panicCrate();

    this.matter.world.on('collisionstart', (e, obj1, obj2) => {

      if(obj1.isCrate && !obj1.hit){
        logData.down_time = new Date();
        userLog.push(logData)
        obj1.hit = true;
        obj1.speed = 0
        this.createNewItem();
        obj1.gravityScale = 0
        //console.log(boxGroup);
      }

      if(obj2.isCrate && !obj2.hit){
        logData.down_time = new Date()
        userLog.push(logData)
        obj2.hit = true;
        obj2.speed = 0
        this.createNewItem();
        obj2.gravityScale = 0
        //console.log(boxGroup);
      }

      // boxGroup.getChildren().forEach((item) => {
      //   item.body.angle = 0
      // })
    });

    //this.setCamera();
  }

  update(){

    boxGroup.getChildren().forEach((box, i) => {

      if(box.y > (this.game.config.height + box.displayHeight)){

        if(!box.body.hit){
          logData.destroy_time = new Date()
          userLog.push(logData)
          box.destroy()
          this.createNewItem();
        }
        else {
          //console.log('tes '+i);
          if(userLog[i].destroy_time === null){
            userLog[i].destroy_time = new Date()
          }
          else {
            box.destroy();
          }
        }
      }
    })
  }

  cameraZoom(){

    let maxHeight = 0;
    let zoomFactor;
    let newHeight;

    boxGroup.getChildren().forEach((item) => {
      if(item.body.hit){
        //let height = Math.round((this.game.config.height - groundHeight - item.y - boxHeight / 2) / boxHeight) + 1;
        maxHeight = Math.max(maxHeight, Math.round((landingGround.getBounds().top - item.getBounds().top) / item.displayWidth))
      }
    })

    panicItem.y = landingGround.getBounds().top - maxHeight * panicItem.displayWidth - gameOption.fallingBoxHeight;
    zoomFactor = gameOption.fallingBoxHeight / (landingGround.getBounds().top - panicItem.y);
    mainCamera.zoomTo(zoomFactor, 500);
    newHeight = this.game.config.height / zoomFactor;
    mainCamera.pan(this.game.config.width / 2, this.game.config.height / 2 - (newHeight - this.game.config.height) / 2, 500);
  }

  setCamera(){

    //console.log('Set');
    mainCamera = this.cameras.add(0, 0, 720, 1280);
    mainCamera.ignore([timeText, adButton]);
    this.cameras.main.ignore([landingGround, panicItem])
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
    if(timer >= gameOption.gameTime){
      timer = gameOption.gameTime
    }
    timeText.text = gameOption.gameTime - timer;
    if(timer >= gameOption.gameTime && isPossible == true){

      //console.log('Called');
      timerEvent.remove();
      panicItem.destroy();

      this.time.addEvent({

        delay: 1000,
        callback: function(){

          boxGroup.getChildren().forEach((box) => {

            box.setStatic(true);
          })
          removeEvent = this.time.addEvent({

            delay: 500,
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

    //this.cameraZoom();
    //console.log(boxGroup.getChildren().length);
    theCrate = Phaser.Math.Between(0, crateArray.length - 1)
    isPossible = true;
    panicItem.visible = true;
    panicItem.setTexture(crateArray[theCrate])
    logData = {
      up_time: null,
      down_time: null,
      destroy_time: null,
    }
    //console.log(userLog);
  }

  panicCrate(){

    panicItem = this.add.sprite(this.game.config.width / 2 - gameOption.boxMoveRange[0], landingGround.getBounds().top - gameOption.fallingBoxHeight, crateArray[theCrate]);
    panicItem.setOrigin(0.5, 0.5);
    panicItem.setScale(0.16)
    this.tweens.add({
      targets: panicItem,
      x: this.game.config.width / 2 - gameOption.boxMoveRange[1],
      duration: gameOption.boxSpeed,
      yoyo: true,
      repeat: -1
    })

    this.input.on('pointerdown', () => {

      if(isPossible == true && timer < gameOption.gameTime){

        this.gameTimer();
        panicItem.visible = false;
        isPossible = false;
        this.fallingItem(crateArray[theCrate]);
      }
    })
  }

  fallingItem(asset){

    let fallingBox = this.matter.add.sprite(panicItem.x, panicItem.y, asset, 0, {

      friction: 1,
      frictionStatic: 100,
      restitution: 0,
      collisionFilter:{
        category: 2
      },
      force:{
        x: 0,
        y: 0
      },
      sleepThreshold: 0,
      slop: 0.1,
      //density: 5000
    });
    fallingBox.setScale(0.16)
    fallingBox.setOrigin(0.5, 0.5);

    fallingBox.body.isCrate = true;
    fallingBox.body.hit = false;
    logData.up_time = new Date()
    logData.destroy_time = null
    boxGroup.add(fallingBox);
    //this.cameras.main.ignore(fallingBox);
  }

  removeItem(){

    let boxScoreText;
    let userScoreText;
    let coinSound = this.sound.add('POIN_COUNT');

    if(boxGroup.getChildren().length > 0){

      let tempBox;
      let stackHeight;
      let boxScoreText;

      tempBox = boxGroup.getFirstAlive();
      stackHeight = Math.round((this.game.config.height - groundHeight - tempBox.y - boxHeight / 2) / boxHeight) + 1;
      //console.log(stackHeight);
      userScore += stackHeight;

      boxScoreText = this.add.text(tempBox.x, tempBox.y, ''+stackHeight, {
        font: 'bold 24px Arial',
        fill: '#FF9D27',
        align: 'center'
      }).setOrigin(0.5, 0.5);
      boxScoreText.setStroke('black', 5)
      tempBox.destroy();
      coinSound.play();
      //mainCamera.ignore(boxScoreText)
    }

    else {

      let userScoreText
      let userScoreSignText;

      removeEvent.remove();

      userScoreSignText = this.add.text(360, 500, 'YOUR SCORE', {

        fontSize: '78px',
        fontFamily: 'Bobbleboddy',
        fill: '#FFED00',
        align: 'center'
      }).setOrigin(0.5, 0.5);
      userScoreSignText.setStroke('#7F0800', 16)

      userScoreText = this.add.text(360, userScoreSignText.y + 100, ''+userScore,{

        fontSize: '92px',
        fontFamily: 'Bobbleboddy',
        fill: '#009EE0',
        align: 'center'
      }).setOrigin(0.5, 0.5);
      userScoreText.setStroke('#7F0800', 16)

      this.challengeOver(new Date())
      //mainCamera.ignore([userScoreSignText, userScoreText])

      this.input.on('pointerdown', () => {

        this.scene.start('MainMenu', {
          sound_status: gameData.sound,
        });
        userLog = []
      })
    }

  }

  challengeOver(over){

    //console.log(userLog);

    let requestID = CryptoJS.AES.encrypt('LG'+'+78709ab074f9ec4a3e66c6c556ac8c96576699f2+'+Date.now(), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    let dataID;
    let data = {
      linigame_platform_token: '78709ab074f9ec4a3e66c6c556ac8c96576699f2',
      session: gameData.session,
      game_end: over,
      score: userScore,
      id: gameData.id,
      log: userLog
    }
    //console.log(data);
    let datas = {
      datas: CryptoJS.AES.encrypt(JSON.stringify(data), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    }

    fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/stacko?lang=id", {
    //fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/stacko?lang=id", {
    //fetch("https://fb746e70.ngrok.io/api/v1.0/leaderboard/stacko?lang=id", {

      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'request-id' : requestID
      },
      body: JSON.stringify(datas)
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {

      //console.log(data.result);

    }).catch(error => {

      console.log(error.result);
    });
  }

}
