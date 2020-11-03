var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var otherGround;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bird1, bird2, birdGroup;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
 
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  backgroundImg = loadImage("bg.png");

  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  bird1 = loadImage("bird1.png");
  bird2 = loadImage("bird2.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  song = loadSound('hit.mp3');
  song2 = loadSound('points.mp3');
  song3 = loadSound('click.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight-10);
 // obstacle1.debug=true;
 
  trex = createSprite(windowWidth-500,0,0,0);  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  trex.scale = 0.5;
  //trex.debug = true;
  trex.setCollider("rectangle",0,0,100,100);
  //console.log(trex);
    
  ground = createSprite(0,windowHeight-500,12000,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.windowWidth /2;
  ground.velocityX = -(6 + 3*score/100);
 // ground.debug = true;
  ground.setCollider("rectangle",0,0,400,50);
  ground.visible=false;
  
  gameOver = createSprite(windowWidth-750,windowHeight-420);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth-750,windowHeight-370);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(500,windowHeight-50,6040,70);
  invisibleGround.visible = false;

  otherGround = createSprite(500,windowHeight-30,6040,70);
  otherGround.isStatic = true;
  otherGround.shapeColor = "green"
  
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  birdGroup = new Group();
  //obstacle2.debug=true;
  
  score = 0;
}

function draw() {
  background(backgroundImg);
  strokeWeight(2);
  stroke("red");
  fill("white");
  textFont("Georgia");
  textSize(20)
  text("Score: "+ score, windowWidth-150,windowHeight-570);

  strokeWeight(3);
  stroke("white");
  fill("red");
  textFont("Georgia");
  textSize(40)
  text("ATHLETIC RACE", windowWidth-900,windowHeight-570);
  textSize(20)
  text("Keep running, running and running to earn points.", windowWidth-940,windowHeight-520);
  
  if (gameState===PLAY){
    song.pause();
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if((touches.length > 0 || keyDown("space")) && trex.y >= 420) {
      trex.velocityY = -6;
      touches = [];
    }

    if (score>0 && score%100 === 0){
      song2.play();
    }
  
    trex.velocityY = trex.velocityY + 0.7
  
    if (ground.x < 0){
      ground.x = ground.windowWidth/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnBirds();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        song.play();
    }
    if(birdGroup.isTouching(trex)){
      gameState = END;
      song.play();
  }
    }
    else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    //trex.x = 10;
    obstaclesGroup.setVelocityXEach(0);
    birdGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    birdGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      song3.play();
      reset();
    }
    strokeWeight(2);
    stroke("red");
    fill("white");
    textFont("Georgia");
    textSize(40)
    text("Total points earned: "+ score, windowWidth-900,windowHeight-270);
    textSize(20)
    text("Tap reset button to replay ", windowWidth-900,windowHeight-230);
   
  }
  
 // obstacle1.debug=true;
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
    var cloud = createSprite(windowWidth-200,windowHeight-100,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(windowWidth-200,windowHeight-80,30,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;

    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
  //  obstacle.debug=true;
    obstacle.setCollider("rectangle",0,0,60,160);
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnBirds() {
  if(frameCount % 350 === 0) {
    var bird = createSprite(windowWidth-200,windowHeight-140,30,40);
    //obstacle.debug = true;
    bird.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: bird.addImage(bird1);
              break;
      case 2: bird.addImage(bird2);
              break;
      default: break;

    }
    
    //assign scale and lifetime to the obstacle           
    bird.scale = 0.2;
    bird.lifetime = 300;
    bird.debug=true;
    bird.setCollider("rectangle",0,0,60,160);
    //add each obstacle to the group
    birdGroup.add(bird);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  birdGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  //console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}