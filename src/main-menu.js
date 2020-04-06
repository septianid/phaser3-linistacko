import Phaser from 'phaser';

var adButton

var urlParams = new URLSearchParams(window.location.search);
var userSession = urlParams.get('session');

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

    this.getVideoSource();
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

    fetch('https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/check_user_limit/?lang=en&session='+userSession+'&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e',{

      method:'GET'
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json()
      }

    }).then(data => {

      console.log(data.result);
    }).catch(error => {

      console.log(error.result.code);
    })
  }

  getUserData(){

    fetch('',{

      method: 'GET'
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json()
      }
    }).then(data => {


    }).catch(error => {


    })
  }

  getLeaderboardData(){

    fetch('',{

      method: 'GET'
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json()
      }
    }).then(data => {


    }).catch(error => {


    })
  }

  getUserRank(){

    fetch('',{

      method: 'GET'
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json()
      }
    }).then(data => {


    }).catch(error => {


    })
  }

  postDataOnStart(){

    fetch('',{

      method: 'POST'
    }).then(response => {


    }).then(data => {


    }).catch(error => {


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
