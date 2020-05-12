import Phaser from 'phaser';

var challengeGate;
var challengerListSign;
var challengerGuideSign;
var challengerContract;
var musicButton;
var musicStatus;

export class Menu extends Phaser.Scene {

  constructor(){

    super("MainMenu")
  }

  preload(){

    this.load.image('TITLE', 'src/assets/LOGO.png');
    this.load.image('MENU_BG', 'src/assets/MENU_BG.jpg');
    this.load.image('ad_button','./src/assets/ad_button.png');
    this.load.image('BM_1P', './src/assets/BM_1P.png');
    this.load.image('BM_2I','./src/assets/BM_2I.png');
    this.load.image('BM_3TC','./src/assets/BM_3TC.png');
    this.load.image('BM_4LD','./src/assets/BM_4LD.png');
    this.load.image('BM_5N','./src/assets/BM_5N.png');
    this.load.image('BM_5F','./src/assets/BM_5F.png');
    this.load.image("BM_GEXB",'./src/assets/BM_GEXB.png');
    this.load.image('PM_1I','./src/assets/PM_1I.png');
    this.load.image('PM_2TC','./src/assets/PM_2TC.png');
    this.load.image('PM_3LD','./src/assets/PM_3LD.png');
  }

  create(){

    var background = this.add.sprite(360, 1280, 'MENU_BG').setScale(0.68, 0.67)
    background.setOrigin(0.5, 1);

    var title = this.add.sprite(360, 230, 'TITLE').setScale(0.5)
    title.setOrigin(0.5, 0.5);

    challengeGate = this.add.sprite(360, 530, 'BM_1P').setScale(0.23);
    challengeGate.setOrigin(0.5, 0.5);
    challengeGate.setInteractive();
    challengeGate.on('pointerdown', () => this.playMenu())

    challengerListSign = this.add.sprite(440, 700, 'BM_4LD').setScale(0.16);
    challengerListSign.setOrigin(0.5,0.5);
    challengerListSign.setInteractive();
    challengerListSign.on("pointerdown",() => this.leaderMenu())

    challengerGuideSign = this.add.sprite(200, 620, 'BM_2I').setScale(0.16);
    challengerGuideSign.setOrigin(0.5,0.5);
    challengerGuideSign.setInteractive();
    challengerGuideSign.on("pointerdown",() => this.instructionMenu())

    challengerContract = this.add.sprite(300, challengerListSign.y + 30, 'BM_3TC').setScale(0.16);
    challengerContract.setOrigin(0.5,0.5);
    challengerContract.setInteractive();
    challengerContract.on("pointerdown",() => this.tncMenu())

    musicStatus = true;

    if(musicStatus==true){

      musicButton = this.add.sprite(530,610, 'BM_5N').setScale(0.16);
      musicButton.setOrigin(0.5,0.5);
    }
    else{

      musicButton = this.add.sprite(530,610, 'BM_5F').setScale(0.16);
      musicButton.setOrigin(0.5,0.5);
    }

    musicButton.setInteractive();
    musicButton.on('pointerdown', () => this.disableMusic());
  }

  update(){


  }

  playAd(){

    let video = document.createElement('video');
    let element;

    video.src = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
    video.playsinline = true;
    video.width = 720;
    video.height = 1280;
    video.autoplay = true;

    video.addEventListener('play', (event) => {

      element = this.add.dom(360, 640, video, {
        'background-color': 'black'
      });
    })

    video.addEventListener('ended', (event) => {

      element.destroy();
      //video.destroy();
      this.scene.start("PlayGame");
    })
  }

  getVideoSource(){

    fetch('https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/leaderboard_imlek?limit_highscore=5&limit_total_score=5&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43',{

      method:'GET'
    }).then(response => {

      if(response.ok){

        return response.json()
      }
      throw new Error(response.status)
    }).then(data => {

      console.log(data.result);
    }).catch(error => {

      console.error(error.message);
    })
  }

  playMenu(){

    this.disableButtons();
    var panelGameOptions = this.add.sprite(360,550, 'panel').setScale(1.4);
    var realPlayButton = this.add.sprite(panelGameOptions.x + 170, panelGameOptions.y-30, 'play_button').setScale(0.08);
    var realAdButton = this.add.sprite(panelGameOptions.x - 170, panelGameOptions.y-30, 'ad_button').setScale(0.35);

    panelGameOptions.setOrigin(0.5,0.5);
    realPlayButton.setOrigin(0.5,0.5);
    realAdButton.setOrigin(0.5,0.5);

    realAdButton.setInteractive();
    realAdButton.on("pointerdown",() => this.playAd())

    realPlayButton.setInteractive();
    realPlayButton.on('pointerdown', () => {

      this.scene.start('PlayGame');
    })
  }


  leaderMenu(){

    this.disableButtons();

    var leader_panel = this.add.sprite(360, 640, 'PM_3LD').setScale(1);
    leader_panel.setOrigin(0.5,0.5);

    var exit_panel =  this.add.sprite(leader_panel.x + 200, leader_panel.y - 500, 'BM_GEXB').setScale(0.2);
    exit_panel.setInteractive();
    exit_panel.setOrigin(0.5,0.5);

    exit_panel.on('pointerdown',() => {
      leader_panel.destroy();
      exit_panel.destroy();
      this.activateButtons();
    })
  }

  instructionMenu(){

    this.disableButtons();

    var instruksi_panel = this.add.sprite(360, 640, 'PM_1I').setScale(1);
    instruksi_panel.setOrigin(0.5,0.5);

    var exit_panel =  this.add.sprite(instruksi_panel.x + 200, instruksi_panel.y - 495, 'BM_GEXB').setScale(0.2);
    exit_panel.setInteractive();
    exit_panel.setOrigin(0.5,0.5);

    exit_panel.on('pointerdown',() => {
      instruksi_panel.destroy();
      exit_panel.destroy();
      this.activateButtons();
    })
  }

  tncMenu(){

    this.disableButtons();

    var tnc_panel = this.add.sprite(360,640, 'PM_2TC').setScale(1, 0.9);
    tnc_panel.setOrigin(0.5, 0.5);

    var exit_panel =  this.add.sprite(tnc_panel.x + 200, tnc_panel.y - 450, 'BM_GEXB').setScale(0.2);
    exit_panel.setInteractive();
    exit_panel.setOrigin(0.5,0.5);

    exit_panel.on('pointerdown',() => {
      tnc_panel.destroy();
      exit_panel.destroy();
      this.activateButtons();
    })
  }

  disableMusic(){

    if(musicStatus == true){

      musicStatus = false;
      musicButton.setTexture('BM_5N');
      musicButton.setScale(0.16);
    }
    else{

      musicStatus = true;
      musicButton.setTexture('BM_5F');
      musicButton.setScale(0.16);
    }
  }

  disableButtons(){

    challengeGate.disableInteractive();
    challengerListSign.disableInteractive();
    challengerGuideSign.disableInteractive();
    challengerContract.disableInteractive();
    musicButton.disableInteractive();
  }

  activateButtons(){

    challengeGate.setInteractive();
    challengerListSign.setInteractive();
    challengerGuideSign.setInteractive();
    challengerContract.setInteractive();
    musicButton.setInteractive();
  }


}
