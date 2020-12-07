const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;

gameState = "Play";

var bee;
var beeImage;
var beeFliped;
var hive;
var hiveImage;
var flowerGroup;
var flowerImage;
var SflowerGroup;
var SflowerImage;
var hornet;
var hornetImage;
var bossHornetImage;
var hornetFliped;
var bossHornetFlipedImage;
var Necter = 0;
var Honey = 0;
var Lives = 3;
var edges;
var tempHoney = 0;

function preload() {
    
    beeImage = loadImage("images/BEEnb.png");
    beeFliped = loadImage("images/BEEFLIPEDnb.png");
    hiveImage = loadImage("images/HIVEnb.png");
    flowerImage = loadImage("images/FLOWERnb.png");
    SflowerImage = loadImage("images/SUPERFLOWER.png");
    hornetImage = loadImage("images/HORNETnb.png");
    bossHornetImage = loadImage("images/HORNETBOSSnb.png");
    hornetFliped = loadImage("images/HORNETFLIPEDnb.png");
    bossHornetFlipedImage =loadImage("images/HORNETBOSSFLIPEDnb.png");
}

function setup(){
    createCanvas(windowWidth-5,windowHeight-5);

    bee = createSprite(windowWidth/2,windowHeight/2-40,20,20);
    bee.addImage("bee", beeImage);
    bee.addImage("beeFlipped", beeFliped);
    bee.scale = 0.05;
    bee.setCollider("rectangle",0,0,1200,900);
    // bee.debug = true;
    bee.shapeColor = "yellow";

    hive = createSprite(windowWidth/2,windowHeight/2,40,40);
    hive.addImage(hiveImage);
    hive.scale = 0.1;
    // hive.debug = true;
    // hive.shapeColor = "tan";

    flowerGroup = createGroup();
    SflowerGroup = createGroup();
    hornetGroup = createGroup();
    bossHornetGroup = createGroup();

    edges = createEdgeSprites();
}

function draw(){
    background("green");

    if (gameState === "Play"){

        if (keyIsDown(UP_ARROW)){

            bee.y -= 5;
        }
    
        if (keyIsDown(DOWN_ARROW)){
    
            bee.y += 5;
        }
    
        if (keyIsDown(LEFT_ARROW)){
    
            bee.x -= 5;
            bee.changeImage("beeFlipped", beeFliped);
        }
    
        if (keyIsDown(RIGHT_ARROW)){
    
            bee.x += 5;
            bee.changeImage("bee", beeImage);
        }
    
        if (bee.isTouching(flowerGroup)){
    
            Necter = Necter+1;
            flowerGroup.destroyEach();
            // console.log("hi");
        }
    
        if (bee.isTouching(SflowerGroup)){
    
            Necter = Necter+5;
            SflowerGroup.destroyEach();
        }
    
        if (bee.isTouching(hornetGroup) || bee.isTouching(bossHornetGroup)){
    
            Necter = 0;
            Lives = Lives-1;
            hornetGroup.destroyEach();
            bossHornetGroup.destroyEach();
        }
    
        if (bee.isTouching(hive)){
            if ((Necter % 5 === 0 && Necter !== 0) || Necter > 5) {
                Honey = Honey + Math.floor(Necter / 5);
                tempHoney += Math.floor(Necter / 5);
                Necter = Necter - Math.floor(Necter / 5) * 5;
            } else {
                textSize(32);
                fill("red");
                text("You don't have enough necter!", windowWidth / 2-200, windowHeight / 2+50);
            }
        }

        if (Lives < 3 && Honey >= 10 && Honey % 10 >= 0 && bee.isTouching(hive)){

            Honey = Honey - 10;
            Lives = Lives + 1;

            if (bossHornetGroup.isTouching(bee)) {
                tempHoney = 0;
            }
        }
    
        bee.collide(hive);
    
        bee.collide(hornetGroup);
    
        flowerSpawn();
        spawnHornet();

        if (tempHoney % 2 === 0 && tempHoney >= 2 && bossHornetGroup.length === 0) {
            spawnBossHornet();
            tempHoney = 0;
        }
    
        bee.collide(edges);

        bossHornetGroup.bounceOff(edges);
        
        
        if (Lives === 0) {
            gameState = "End";
        }
        
    } else if (gameState === "End") {
        
        SflowerGroup.destroyEach();
        flowerGroup.destroyEach();
        hornetGroup.destroyEach();
        bossHornetGroup.destroyEach();
        

        stroke("red");
        fill("red");
        textSize(30);
        text("Game Over " , windowWidth/2-80,windowHeight/2-40);
    }
    
    stroke("yellow");
    fill("yellow");
    textSize(15);
    text("Nectar: " + Necter, windowWidth/2-25,20);

    stroke("orange");
    fill("orange");
    textSize(15);
    text("Honey: " + Honey, windowWidth/2-25,40);

    if (Lives <= 1){

        stroke("red");
        fill("red");
        textSize(15);
        text("Life: " + Lives, windowWidth/2-25,60);

    } else {

        stroke("red");
        fill("red");
        textSize(15);
        text("Lives: " + Lives, windowWidth/2-25,60);
    }

    drawSprites();
}

function flowerSpawn() {

    if (frameCount % 50 === 0) {
      var flower = createSprite(400, 200, 10, 10);
      flower.addImage(flowerImage);
      flower.scale = 0.09;
    //   flower.debug = true;
    //   flower.shapeColor = "red";
      flower.y = Math.round(random(0, windowHeight));
      flower.x = Math.round(random(0,windowWidth));
      flower.lifetime = 300;
    //   flower.addImage();
    //   flower.scale = 0.1;
  
      flowerGroup.add(flower);
    }
// 200
    if (frameCount % 50 === 0) {
        var Sflower = createSprite(400,200,10,10);
        Sflower.addImage(SflowerImage);
        Sflower.scale = 0.09;
        // Sflower.debug = true;
        Sflower.y = Math.round(random(0,windowHeight));
        Sflower.x = Math.round(random(0,windowWidth));
        Sflower.lifetime = 150;

        SflowerGroup.add(Sflower);
    }
  }

function spawnHornet(){

    if (frameCount % 500 === 0) {
        hornet  = createSprite(400, 200, 30, 30);
        // hornet.debug = true;
        // hornet.shapeColor = "orange";
        hornet.y = Math.round(random(0, windowHeight));
        hornet.x = Math.round(random(0,windowWidth));
        if (hornet.x < windowWidth / 2) {
            hornet.velocityX = Math.round(random(1, 6))
            hornet.addImage("hornet", hornetImage);
        }

        if (hornet.x > windowWidth / 2) {
            hornet.velocityX = Math.round(random(-6, -1))
            hornet.addImage("hornetFlipped", hornetFliped);
        }

        if (hornet.y < windowHeight / 2) {
            hornet.velocityY = Math.round(random(1, 6))
        }

        if (hornet.y > windowHeight / 2) {
            hornet.velocityY = Math.round(random(-6, -1))
        }

        hornet.lifetime = 500;
        hornet.scale = 0.2;
    
        hornetGroup.add(hornet);
    }
}

function spawnBossHornet(){
    
    bossHornet  = createSprite(400, 200, 30, 30);
    // hornet.debug = true;
    // hornet.shapeColor = "orange";
    bossHornet.y = Math.round(random(0, windowHeight));
    bossHornet.x = Math.round(random(0,windowWidth));
    if (bossHornet.x < windowWidth / 2) {
        bossHornet.velocityX = 6
        bossHornet.addImage("bossHornet", bossHornetImage);
    }

    if (bossHornet.x > windowWidth / 2) {
        bossHornet.velocityX = -6
        bossHornet.addImage("bossHornetFliped", bossHornetFlipedImage);
    }

    if (bossHornet.y < windowHeight / 2) {
        bossHornet.velocityY = 6
    }

    if (bossHornet.y > windowHeight / 2) {
        bossHornet.velocityY = -6
    }

    bossHornet.lifetime = 500;
    bossHornet.scale = 0.3;

    bossHornetGroup.add(bossHornet);
}
