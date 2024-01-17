let mic, recorder;
let state = 0;
let recButton;
let stopRec;
let playButton;
let playBackSongButton;
let stopBackSongButton;
let backSongSlider;
let pauseButton;
let stopButton;
let deleteLast;
let rate = 1;
let tempo = 1;
let xLine = 0;
let playSwitch = false;
let bgColor = 100;
let burbujas = [];
let index = 0;
let fileInput;
let soundFile;
let mySong;
let timerText = 3;
let timerSwitch = false;
let recordSwitch = false;
let timerColor = 255;


function setup() {
  let cnv = createCanvas(windowWidth, 500);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  mySong = new p5.SoundFile();
  recButton = createButton("Grabar");
  recButton.mousePressed(triggerTimer)
  stopRec = createButton("Detener Grabación");
  stopRec.mousePressed(stopRecording);
  playButton = createButton("REPRODUCIR");
  playButton.mousePressed(reproducir);
  stopButton = createButton("Detener");
  stopButton.mousePressed(stopSound);
  pauseButton = createButton("Pausar");
  pauseButton.mousePressed(pausar);
  playBackSongButton = createButton("Reproducir Audio de Fondo");
  playBackSongButton.mousePressed(playBackSong);
  stopBackSongButton = createButton("Detener Audio de Fondo");
  stopBackSongButton.mousePressed(stopBackSong);
  deleteLast = createButton("Borrar Ultimo");
  deleteLast.mousePressed(deleteLastBubble);
  backSongSlider = createSlider(0,2,0.5,0.1);
  fileInput = createFileInput(loadSoundFile);
  
  // create an audio in
  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);
}

function draw(){
  if(playSwitch){
    xLine +=1;
    if(xLine>width-200){
      xLine = 0;
    }
  }
  background(bgColor);

  for(var i = 0; i < 21; i++ ){
    stroke(70);
    line(i*50,0,i*50,height);
    stroke(0)
  }
  for(var j = 0; j < 21; j++ ){
    stroke(70);
    line(0,j*50,width-365,j*50);
    stroke(0)
  }
  if(timerSwitch){
    textSize(100);
    timerColor = 255;
    fill(timerColor);
    if(frameCount % 60 == 0 && timerText>0){
      timerText --;
    }
    if(timerText == 0){
      timerText = "¡Empezá a grabar!"
      record();
    }
    text(timerText, width/3, height/2);
  }
  fill(200,34,50,150);
  rect(width-100,height/2,200,height);
  fill(50,50);
  triangle(width-250,50,width-300,50,width-250,height-20);
  fill(0);
  stroke(0);
  textSize(25);
  text("Volumen",width-280,30);
  stroke("red")
  strokeWeight(3);
  line(xLine, 0,xLine,height);
  //strokeWeight(1);
  stroke(0);
  for(let i = 0; i<burbujas.length;i++){
    burbujas[i].show();
    burbujas[i].update();
    if(xLine == burbujas[i].x){
      burbujas[i].soundFile.play([],rate);
    }
  }
  mySong.setVolume(backSongSlider.value())
}

function loadSoundFile(file) {
  if (file.type === "audio") {
    mySong = loadSound(file.data,songLoaded);
  } else {
    alert("Not a valid audio file!");
  }
}

function songLoaded(){
  if(mySong.isLoaded()){
    bgColor = color(0,150,0);
  }
}

function triggerTimer(){
  timerSwitch = true;
}

function record(){
  userStartAudio();
    burbujas.push(new BurbujaSonora(width-100, height/2,index));
    if(mic.enabled){
      recorder.record(burbujas[index].soundFile);
      bgColor = color(255,0,0);
  }
  index +=1;
  }

function stopRecording(){
  bgColor = color(0,150,0);
  recorder.stop();
  timerText = 3;
  timerSwitch = false;
  timerColor = bgColor;
}

function reproducir(){
  playSwitch = true;
}

function stopSound(){
  xLine = 0;
  playSwitch = false;
  for(let i = 0; i<burbujas.length;i++){
    burbujas[i].soundFile.stop();
  }
}

function pausar(){
  playSwitch = false;
}

function playBackSong(){
  mySong.play();
}

function stopBackSong(){
  mySong.stop()
}

function deleteLastBubble(){
  burbujas.pop();
  index -=1;
}

function BurbujaSonora(x,y,index){
  this.x = x;
  this.y = y;
  this.color = color(150,20,100);
  this.d;
  this.soundFile = new p5.SoundFile();
  this.index = index
  this.amp = new p5.Amplitude();
  this.diam = 40;
  this.volume = 1;


  this.update = function(){
    this.d = dist(this.x,this.y,mouseX,mouseY);
    this.diam = map(this.amp.getLevel(),0,1,40,4000);
    this.amp.setInput(this.soundFile);
    this.volume = map(this.y,500,0,0.5,2)
    this.soundFile.setVolume(this.volume);
    if(mouseIsPressed===true){
      if(this.d<50){
        this.x = mouseX;
        this.y = mouseY;
      }
    }
  }

  this.show = function(){
    fill(this.color);
    rect(this.x,this.y,this.diam,this.diam,10);
    textSize(16);
    fill(255)
    text(this.index,this.x,this.y);
  }
}
