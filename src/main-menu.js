import Phaser from 'phaser';

var adButton;

export class Menu extends Phaser.Scene {

  constructor(){

    super("MainMenu")
  }

  preload(){

    this.load.image('play_button', './src/assets/play_button.png');
  }

  create(){

    adButton = this.add.sprite(this.game.config.width / 2, 530, 'play_button').setScale(0.1);
    adButton.setOrigin(0.5, 0.5);
    adButton.setInteractive();
    adButton.on('pointerdown', () => this.playAd())
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
}
