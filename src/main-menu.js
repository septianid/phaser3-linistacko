import Phaser from 'phaser';

var adButton;
var leaderbutton;
var instruksibutton;
var musicbutton;

export class Menu extends Phaser.Scene {

  constructor(){

    super("MainMenu")
  }

  preload(){
    this.load.image('ad_button','./src/assets/ad_button.png');
    this.load.image('play_button', './src/assets/play_button.png');
    this.load.image('Leaderboard','./src/assets/Leaderboard.png');
    this.load.image('Leaderboard_panel','./src/assets/Leaderboard_panel.png');
    this.load.image("Exit",'./src/assets/Exit.png');
    //this.load.image("Exit2",'./src/assets/Exit.png');
    this.load.image('Instruksi','./src/assets/Instruksi.png');
    this.load.image('Instruksi_panel','./src/assets/Instruksi_panel.png');
    this.load.image('panel','./src/assets/panel.png');
    this.load.image('music','./src/assets/music.png');
    this.load.image('banned','./src/assets/banned.png');
  }

  create(){
    adButton = this.add.sprite(this.game.config.width / 2, 530, 'play_button').setScale(0.1);
    leaderbutton = this.add.sprite(this.game.config.width/2,660, 'Leaderboard').setScale(1);
    instruksibutton = this.add.sprite(this.game.config.width/2,720, 'Instruksi').setScale(1);
    musicbutton = this.add.sprite(610,1130, 'music').setScale(0.2);
    adButton.setOrigin(0.5, 0.5);
    adButton.setInteractive();
    adButton.on('pointerdown', () => this.playmenu())

    leaderbutton.setOrigin(0.5,0.5);
    leaderbutton.setInteractive();
    leaderbutton.on("pointerdown",() => this.leaderMenu())

    instruksibutton.setOrigin(0.5,0.5);
    instruksibutton.setInteractive();
    instruksibutton.on("pointerdown",() => this.instructionMenu())

    musicbutton.setOrigin(0.5,0.5);
    musicbutton.setInteractive();
    musicbutton.on("pointerdown",() => this.disablemusic())
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

  myIP(){

    var ip = false;
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || false;

    if (window.RTCPeerConnection){
      ip = [];
      var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
      pc.createDataChannel('');
      pc.createOffer(pc.setLocalDescription.bind(pc), noop);

      pc.onicecandidate = function(event){
        if (event && event.candidate && event.candidate.candidate){
          var s = event.candidate.candidate.split('\n');
          ip.push(s[0].split(' ')[4]);
        }
      }
    }

    return ip;
  }

  playmenu()
  {
    this.disableButtons();
    var panelgameoptions = this.add.sprite(360,550, 'panel').setScale(1.4);
    var realplaybutton = this.add.sprite(panelgameoptions.x+170,panelgameoptions.y-30, 'play_button').setScale(0.08);
    var realadbutton = this.add.sprite(panelgameoptions.x-170,panelgameoptions.y-30, 'ad_button').setScale(3);
    
    panelgameoptions.setOrigin(0.5,0.5);
    realplaybutton.setOrigin(0.5,0.5);

    realadbutton.setOrigin(0.5,0.5);
    realadbutton.setInteractive();
    realadbutton.on("pointerdown",() => this.playAd())
  }


  leaderMenu()
  {
    this.disableButtons();

    var leader_panel = this.add.sprite(360,580, 'Leaderboard_panel').setScale(3);
    leader_panel.setOrigin(0.5,0.5);

    var exit_panel =  this.add.sprite(leader_panel.x+250, leader_panel.y-450, 'Exit').setScale(1);
    exit_panel.setInteractive();
    exit_panel.setOrigin(0.5,0.5);

    exit_panel.on('pointerdown',()=>{
      leader_panel.destroy();
      exit_panel.destroy();
      this.activateButtons();
    })
  }

  instructionMenu()
  {
    this.disableButtons();

    var instruksi_panel = this.add.sprite(360,580, 'Instruksi_panel').setScale(3);
    instruksi_panel.setOrigin(0.5,0.5);

    var exit_panel2 =  this.add.sprite(instruksi_panel.x+250, instruksi_panel.y-450, 'Exit').setScale(1);
    exit_panel2.setInteractive();
    exit_panel2.setOrigin(0.5,0.5);

    exit_panel2.on('pointerdown',()=>{
      instruksi_panel.destroy();
      exit_panel2.destroy();
      this.activateButtons();
    })
  }

  disablemusic()
  {
    //this.disableButtons();
    var banned = this.add.sprite(610,1130, 'banned').setScale(0.4);
    banned.setOrigin(0.5,0.5);
    banned.setInteractive();
    banned.on('pointerdown',()=>{
      banned.destroy();
      //this.activateButtons();
    })
  }

  disableButtons()
  {
    adButton.disableInteractive();
    leaderbutton.disableInteractive();
    instruksibutton.disableInteractive();
    //musicbutton.disableInteractive();
  }

  activateButtons()
  {
    adButton.setInteractive();
    leaderbutton.setInteractive();
    instruksibutton.setInteractive();
    //musicbutton.setInteractive();
  }


}
