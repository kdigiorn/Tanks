/*
All textures used are public domain and from opengameart.org. All sounds are also from
opengameart.org and are made by dklon.

CONTROLS:
Player1: WASD to move, Q and E to rotate the turret, F and R to raise and lower the turret, and shift to shoot.
Player2: IJKL to move, U and O to rotate the turret, Y and H to raise and lower the turret, and / to shoot.
*/

var arenaSize = 2500;
var walls = [];
var boundries = [];
var ground;
var text1;
var text2;
var counter = 0;
var k = 0;
var wall1 = false;
var wall2 = false;
var dummy = 0;
var easy = false;
var hard = false;
var l1 = false;
var l2 = false;
var random = false;
var set = false;
var wait = 0;


var Key = {
   pressed: {},

   I: 73,
   J: 74,
   K: 75,
   L: 76,
   U: 85,
   O: 79,
   H: 72,
   Y: 89,
   FSLASH: 191,
   LEFT: 37,
   UP: 38,
   RIGHT: 39,
   DOWN: 40,
   SPACEBAR: 32,
   ONE: 49,
   TWO: 50,
   THREE: 51,
   FOUR: 52,
   FIVE: 53,
   SIX: 54,
   SEVEN: 55,
   EIGHT: 56,

   W: 87,
   A: 65,
   S: 83,
   D: 68,
   Q: 81,
   E: 69,
   F: 70,
   R: 82,
   SHIFT: 16,

   B: 66,

   isDown: function(keyCode) {
      return this.pressed[keyCode];
   },

   onKeydown: function(event) {
      this.pressed[event.keyCode] = true;
   },

   onKeyup: function(event) {
      this.pressed[event.keyCode] = false;
   }
};

window.addEventListener('keyup', function(event) {
   Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function(event) {
   Key.onKeydown(event);
}, false);

function addLights() {
   var ambientLight = new THREE.AmbientLight(0x222222);
   ambientLight.intensity = 0.0;
   scene.add(ambientLight);

   var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);

   directionalLight.position.set(-750, 1125, 750);
   directionalLight.shadowCameraLeft = -2000;
   directionalLight.shadowCameraRight = 2000;
   directionalLight.shadowCameraTop = 1400;
   directionalLight.shadowCameraBottom = -1350;
   directionalLight.shadowCameraNear = 0;
   directionalLight.shadowCameraFar = 3000;
   directionalLight.castShadow = true;
   scene.add(directionalLight);
}

function setupCamera() {
   camera.position.z = 800;
   camera.position.y = 2100;
   camera.position.x = 0;
   camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function addGround() {
   var woodTex = THREE.ImageUtils.loadTexture('textures/floor.jpg');
   woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
   woodTex.repeat.set(2, 2);
   var groundGeometry = new THREE.BoxGeometry(arenaSize, 5, arenaSize);
   var groundMaterial = new THREE.MeshLambertMaterial({
      map: woodTex
   });
   ground = new THREE.Mesh(groundGeometry, groundMaterial);
   ground.receiveShadow = true;
   ground.Box3 = new THREE.Box3(new THREE.Vector3(-arenaSize / 2, -2.5, -arenaSize / 2), new THREE.Vector3(arenaSize / 2, 2.5, arenaSize / 2));
   scene.add(ground);
}

function addBoundries() {
   var woodTex = THREE.ImageUtils.loadTexture('textures/wood2.png');
   woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
   woodTex.repeat.set(1, .1);
   var uWall = new THREE.Mesh(new THREE.BoxGeometry(24, 100, arenaSize + 48), new THREE.MeshLambertMaterial({
      map: woodTex
   }));
   uWall.castShadow = true;
   uWall.receiveShadow = true;
   var dWall = new THREE.Mesh(new THREE.BoxGeometry(24, 100, arenaSize + 48), new THREE.MeshLambertMaterial({
      map: woodTex
   }));
   dWall.castShadow = true;
   dWall.receiveShadow = true;
   var lWall = new THREE.Mesh(new THREE.BoxGeometry(arenaSize, 100, 24), new THREE.MeshLambertMaterial({
      map: woodTex
   }));
   lWall.castShadow = true;
   lWall.receiveShadow = true;
   var rWall = new THREE.Mesh(new THREE.BoxGeometry(arenaSize, 100, 24), new THREE.MeshLambertMaterial({
      map: woodTex
   }));
   rWall.castShadow = true;
   rWall.receiveShadow = true;

   uWall.position.set(arenaSize / 2 + 12, 50, 0);
   dWall.position.set(-arenaSize / 2 - 12, 50, 0);
   lWall.position.set(0, 50, -arenaSize / 2 - 12);
   rWall.position.set(0, 50, arenaSize / 2 + 12);
   uWall.Box3 = new THREE.Box3(new THREE.Vector3(uWall.position.x - 12, 0, uWall.position.z - (arenaSize + 48) / 2), new THREE.Vector3(uWall.position.x + 12, 100, uWall.position.z + (arenaSize + 48) / 2));
   dWall.Box3 = new THREE.Box3(new THREE.Vector3(dWall.position.x - 12, 0, dWall.position.z - (arenaSize + 48) / 2), new THREE.Vector3(dWall.position.x + 12, 100, dWall.position.z + (arenaSize + 48) / 2));
   lWall.Box3 = new THREE.Box3(new THREE.Vector3(lWall.position.x - arenaSize / 2, 0, lWall.position.z - 12), new THREE.Vector3(lWall.position.x + arenaSize / 2, 100, lWall.position.z + 12));
   rWall.Box3 = new THREE.Box3(new THREE.Vector3(rWall.position.x - arenaSize / 2, 0, rWall.position.z - 12), new THREE.Vector3(rWall.position.x + arenaSize / 2, 100, rWall.position.z + 12));

   boundries.push(uWall);
   boundries.push(dWall);
   boundries.push(lWall);
   boundries.push(rWall);
   scene.add(uWall);
   scene.add(dWall);
   scene.add(lWall);
   scene.add(rWall);
}

function Menu() {
   var Start0 = new THREE.TextGeometry("Please pick one of the game play modes:", {
      size: 50,
      height: 30,
      font: "helvetiker"
   });
   textStart0 = new THREE.Mesh(Start0, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   textStart0.position.y = 900;
   textStart0.position.z = -300;
   textStart0.rotation.x = -1.43;
   Start0.computeBoundingBox();
   var centerX0 = 0.5 * (Start0.boundingBox.max.x - Start0.boundingBox.min.x);
   textStart0.position.x = -centerX0;

   var Start1 = new THREE.TextGeometry("1) Easy - Level 1 - Random Movement", {
      size: 50,
      height: 30,
      font: "helvetiker"
   });
   textStart1 = new THREE.Mesh(Start1, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   textStart1.position.y = 900;
   textStart1.position.z = -200;
   textStart1.rotation.x = -1.43;
   Start1.computeBoundingBox();
   var centerX1 = 0.5 * (Start1.boundingBox.max.x - Start1.boundingBox.min.x);
   textStart1.position.x = -centerX1;

   var Start2 = new THREE.TextGeometry("2) Hard - Level 1 - Random Movement", {
      size: 50,
      height: 30,
      font: "helvetiker"
   });
   textStart2 = new THREE.Mesh(Start2, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   textStart2.position.y = 900;
   textStart2.position.z = -100;
   textStart2.rotation.x = -1.43;
   Start2.computeBoundingBox();
   var centerX2 = 0.5 * (Start2.boundingBox.max.x - Start2.boundingBox.min.x);
   textStart2.position.x = -centerX2;

   var Start3 = new THREE.TextGeometry("3) Easy - Level 2 - Random Movement", {
      size: 50,
      height: 30,
      font: "helvetiker"
   });
   textStart3 = new THREE.Mesh(Start3, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   textStart3.position.y = 900;
   textStart3.position.z = 0;
   textStart3.rotation.x = -1.43;
   Start3.computeBoundingBox();
   var centerX3 = 0.5 * (Start3.boundingBox.max.x - Start3.boundingBox.min.x);
   textStart3.position.x = -centerX3;

   var Start4 = new THREE.TextGeometry("4) Hard - Level 2 - Random Movement", {
      size: 50,
      height: 30,
      font: "helvetiker"
   });
   textStart4 = new THREE.Mesh(Start4, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   textStart4.position.y = 900;
   textStart4.position.z = 100;
   textStart4.rotation.x = -1.43;
   Start4.computeBoundingBox();
   var centerX4 = 0.5 * (Start4.boundingBox.max.x - Start4.boundingBox.min.x);
   textStart4.position.x = -centerX4;

   var Start5 = new THREE.TextGeometry("5) Easy - Level 1 - Set Movement", {
      size: 50,
      height: 30,
      font: "helvetiker"
   });
   textStart5 = new THREE.Mesh(Start5, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   textStart5.position.y = 900;
   textStart5.position.z = 200;
   textStart5.rotation.x = -1.43;
   Start5.computeBoundingBox();
   var centerX5 = 0.5 * (Start5.boundingBox.max.x - Start5.boundingBox.min.x);
   textStart5.position.x = -centerX5;

   var Start6 = new THREE.TextGeometry("6) Hard - Level 1 - Set Movement", {
      size: 50,
      height: 30,
      font: "helvetiker"
   });
   textStart6 = new THREE.Mesh(Start6, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   textStart6.position.y = 900;
   textStart6.position.z = 300;
   textStart6.rotation.x = -1.43;
   Start6.computeBoundingBox();
   var centerX6 = 0.5 * (Start6.boundingBox.max.x - Start6.boundingBox.min.x);
   textStart6.position.x = -centerX6;

   var Start7 = new THREE.TextGeometry("7) Easy - Level 2 - Set Movement", {
      size: 50,
      height: 30,
      font: "helvetiker"
   });
   textStart7 = new THREE.Mesh(Start7, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   textStart7.position.y = 900;
   textStart7.position.z = 400;
   textStart7.rotation.x = -1.43;
   Start7.computeBoundingBox();
   var centerX7 = 0.5 * (Start7.boundingBox.max.x - Start7.boundingBox.min.x);
   textStart7.position.x = -centerX7;

   var Start8 = new THREE.TextGeometry("8) Hard - Level 2 - Set Movement", {
      size: 50,
      height: 30,
      font: "helvetiker"
   });
   textStart8 = new THREE.Mesh(Start8, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   textStart8.position.y = 900;
   textStart8.position.z = 500;
   textStart8.rotation.x = -1.43;
   Start8.computeBoundingBox();
   var centerX8 = 0.5 * (Start8.boundingBox.max.x - Start8.boundingBox.min.x);
   textStart8.position.x = -centerX8;

   scene.add(textStart0)
   scene.add(textStart1)
   scene.add(textStart2)
   scene.add(textStart3)
   scene.add(textStart4)
   scene.add(textStart5)
   scene.add(textStart6)
   scene.add(textStart7)
   scene.add(textStart8)

   while (wait < 1000000000) {
      if (Key.isDown(Key.ONE)) {
         easy = true;
         l1 = true;
         random = true;
         break;
      } else if (Key.isDown(Key.TWO)) {
         hard = true;
         l1 = true;
         random = true;
         break;
      } else if (Key.isDown(Key.THREE)) {
         easy = true;
         l2 = true;
         random = true;
         break;
      } else if (Key.isDown(Key.FOUR)) {
         hard = true;
         l2 = true;
         random = true
         break;
      } else if (Key.isDown(Key.FIVE)) {
         easy = true;
         l1 = true;
         set = true;
         break;
      } else if (Key.isDown(Key.SIX)) {
         hard = true;
         l1 = true;
         set = true;
         break;
      } else if (Key.isDown(Key.SEVEN)) {
         easy = true;
         l2 = true;
         set = true;
         break;
      } else if (Key.isDown(Key.EIGHT)) {
         hard = true;
         l2 = true;
         set = true;
         break;
      }
      wait++;
   }
}



function addWalls() {
   //for (var i = 0; i < 10; i++) { // USE THIS ONE FOR LEVEL 1
   for (var i = 0; i < 16; i++) { // USE THIS ONE FOR LEVEL 2
      walls.push(new THREE.Mesh(new THREE.BoxGeometry(250, 250, 250), new THREE.MeshLambertMaterial({
         map: THREE.ImageUtils.loadTexture('textures/crate.png')
      })));

      // ADDED RANDOM BLOCKS
      // MAY WANT TO CHANGE THIS TO DIFFERENT LEVELS INSTEAD
      // if (i % 2 == 0) {
      //    walls[i].position.x = Math.floor(Math.random() * 1000) + 1;
      //    walls[i].position.z = Math.floor(Math.random() * 1000) + 1;
      // } else {
      //    walls[i].position.x = -1 * (Math.floor(Math.random() * 1000) + 1);
      //    walls[i].position.z = -1 * (Math.floor(Math.random() * 1000) + 1);
      // }

      // LEVEL 1
      // if (i % 2 == 0) {
      //    walls[i].position.x = i * 100;
      //    walls[i].position.z = i * 100;
      // } else {
      //    walls[i].position.x = i * -100;
      //    walls[i].position.z = i * -100;
      // }

      // walls[i].castShadow = true;
      // walls[i].receiveShadow = true;
      // walls[i].position.y = 125;
      // walls[i].Box3 = new THREE.Box3(new THREE.Vector3(walls[i].position.x - 125, 0, walls[i].position.z - 125), new THREE.Vector3(walls[i].position.x + 125, 250, walls[i].position.z + 125));
      // scene.add(walls[i]);
   }
   // LEVEL 2
   walls[0].position.x = -600;
   walls[0].position.z = -600;
   walls[1].position.x = -600;
   walls[1].position.z = -400;
   walls[2].position.x = -400;
   walls[2].position.z = -600;
   walls[3].position.x = -400;
   walls[3].position.z = -400;
   walls[4].position.x = 600;
   walls[4].position.z = 600;
   walls[5].position.x = 600;
   walls[5].position.z = 400;
   walls[6].position.x = 400;
   walls[6].position.z = 600;
   walls[7].position.x = 400;
   walls[7].position.z = 400;
   walls[8].position.x = -600;
   walls[8].position.z = 600;
   walls[9].position.x = -600;
   walls[9].position.z = 400;
   walls[10].position.x = -400;
   walls[10].position.z = 600;
   walls[11].position.x = -400;
   walls[11].position.z = 400;
   walls[12].position.x = 600;
   walls[12].position.z = -600;
   walls[13].position.x = 600;
   walls[13].position.z = -400;
   walls[14].position.x = 400;
   walls[14].position.z = -600;
   walls[15].position.x = 400;
   walls[15].position.z = -400;


   for (var i = 0; i < 16; i++) {
      walls[i].castShadow = true;
      walls[i].receiveShadow = true;
      walls[i].position.y = 125;
      walls[i].Box3 = new THREE.Box3(new THREE.Vector3(walls[i].position.x - 125, 0, walls[i].position.z - 125), new THREE.Vector3(walls[i].position.x + 125, 250, walls[i].position.z + 125));
      scene.add(walls[i]);
   }
}

function addFloor() {
   var floorTex = THREE.ImageUtils.loadTexture('textures/hardwood.png');
   floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
   floorTex.repeat.set(1, 1);
   var planeGeometry = new THREE.PlaneBufferGeometry(10000, 5000);
   var planeMaterial = new THREE.MeshLambertMaterial({
      map: floorTex
   });
   var plane = new THREE.Mesh(planeGeometry, planeMaterial);
   plane.rotation.x = -0.5 * Math.PI;
   plane.receiveShadow = true;
   plane.position.y = -20;
   plane.position.z = -300;
   scene.add(plane);
}

function gameOver(player) {
   var text1Geom = new THREE.TextGeometry("Player " + player + " wins!", {
      size: 150,
      height: 30,
      font: "helvetiker"
   });
   text1 = new THREE.Mesh(text1Geom, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   text1.position.y = 500;
   text1.position.z = -100;
   text1.rotation.x = -1.43;
   text1Geom.computeBoundingBox();
   var centerX1 = 0.5 * (text1Geom.boundingBox.max.x - text1Geom.boundingBox.min.x);
   text1.position.x = -centerX1;

   var text2Geom = new THREE.TextGeometry("Press b to restart game", {
      size: 150,
      height: 30,
      font: "helvetiker"
   });
   text2 = new THREE.Mesh(text2Geom, new THREE.MeshLambertMaterial({
      color: 0xffffff
   }));
   text2.position.y = 500;
   text2.position.z = 100;
   text2.rotation.x = -1.43;
   text2Geom.computeBoundingBox();
   var centerX2 = 0.5 * (text2Geom.boundingBox.max.x - text2Geom.boundingBox.min.x);
   text2.position.x = -centerX2;

   scene.add(text1);
   scene.add(text2);
}

//setup the scene
var canvas = document.getElementById("canvas");
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({
   canvas: canvas,
   antialias: true
});
renderer.setSize(canvas.width - 100, canvas.height - 100);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFShadowMap;
var fov = 75,
   aspect = canvas.width / canvas.height,
   near = 0.1,
   far = 10000;
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
var clock = new THREE.Clock();

//some particle setup



// ADDED TWO EMITTERSETTINGS TO USE DIFFERENT COLORS FOR EACH TANK

var pos = new THREE.Vector3()
var emitterSettings1 = {
   type: 'sphere',
   positionSpread: new THREE.Vector3(10, 10, 10),
   radius: 1,
   speed: 100,
   sizeStart: 30,
   sizeStartSpread: 30,
   sizeEnd: 0,
   opacityStart: 1,
   opacityEnd: 0,
   colorStart: new THREE.Color('blue'),
   colorStartSpread: new THREE.Vector3(0, 10, 0),
   colorEnd: new THREE.Color('blue'),
   particleCount: 100,
   alive: 0,
   duration: 0.05
};

var emitterSettings2 = {
   type: 'sphere',
   positionSpread: new THREE.Vector3(10, 10, 10),
   radius: 1,
   speed: 100,
   sizeStart: 30,
   sizeStartSpread: 30,
   sizeEnd: 0,
   opacityStart: 1,
   opacityEnd: 0,
   colorStart: new THREE.Color('red'),
   colorStartSpread: new THREE.Vector3(0, 10, 0),
   colorEnd: new THREE.Color('red'),
   particleCount: 100,
   alive: 0,
   duration: 0.05
};

var particleGroup1 = new SPE.Group({
   texture: THREE.ImageUtils.loadTexture('textures/smokeparticle.png'),
   maxAge: 0.5,
   blending: THREE.AdditiveBlending
});
particleGroup1.addPool(150, emitterSettings1, true);
scene.add(particleGroup1.mesh);

var particleGroup2 = new SPE.Group({
   texture: THREE.ImageUtils.loadTexture('textures/smokeparticle.png'),
   maxAge: 0.5,
   blending: THREE.AdditiveBlending
});
particleGroup2.addPool(150, emitterSettings2, true);
scene.add(particleGroup2.mesh);

//call some setup functions
setupCamera();
addLights();
addGround();
addBoundries();
addFloor();
//Menu();
addWalls();

document.body.appendChild(renderer.domElement);

//setup the audio
var audioHitBox = document.createElement('audio');
var audioShoot = document.createElement('audio');
var audioHitPlayer = document.createElement('audio');
var audioHitTerrain = document.createElement('audio');
var source = document.createElement('source');
var source2 = document.createElement('source');
var source3 = document.createElement('source');
var source4 = document.createElement('source');
source.src = 'sounds/boom6.wav';
source2.src = 'sounds/boom4.wav';
source3.src = 'sounds/atari_boom.wav';
source4.src = 'sounds/atari_boom2.wav';
audioHitBox.appendChild(source);
audioShoot.appendChild(source2);
audioHitPlayer.appendChild(source3);
audioHitTerrain.appendChild(source4);

//set some variables
var shotSpeed = 25;
var p1fireRate = 60;
var p1ShotdX = 0;
var p1ShotdY = 0;
var p1ShotdZ = 0;

var p2fireRate = 60;
var p2ShotdX = 0;
var p2ShotdY = 0;
var p2ShotdZ = 0;
var gravity = 0.0;

var player1Shots = [];
var player2Shots = [];

var player1Dead = false;
var player2Dead = false;

//create player 1
var head1 = new THREE.Object3D();
var cannon1 = new THREE.Object3D();
var barrel1 = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 80, 32), new THREE.MeshPhongMaterial({
   color: 0x5555aa
}));
cannon1.rotation.x = -1.57; // Changed this so that the cannon was initially pointing straight forward
barrel1.position.y = 40;
cannon1.add(barrel1);
cannon1.position.y = 0;
var turret1 = new THREE.Mesh(new THREE.SphereGeometry(32, 32, 16), new THREE.MeshPhongMaterial({
   color: 0x73E3EB
}));
head1.add(turret1);
head1.add(cannon1);
head1.position.y = 25;
head1.position.z = 10;
head1.castShadow = true;
head1.receiveShadowShadow = true;
cannon1.castShadow = true;
cannon1.receiveShadowShadow = true;
barrel1.castShadow = true;
barrel1.receiveShadowShadow = true;

var block1 = new THREE.Mesh(new THREE.BoxGeometry(100, 50, 100), new THREE.MeshPhongMaterial({
   color: 0x73E3EB
}));
block1.castShadow = true;
block1.receiveShadowShadow = true;

var player1 = new THREE.Object3D();
player1.add(block1);
player1.add(head1);
player1.Box3 = new THREE.Box3(new THREE.Vector3(-1050, 0, 950), new THREE.Vector3(-950, 66, 1050));
player1.position.set(-1000, 26, 1000);
player1.receiveShadow = true;
player1.castShadow = true;
scene.add(player1);
var oldplayer1Box = new THREE.Box3(new THREE.Vector3(-1050, 0, 950), new THREE.Vector3(-950, 66, 1050));



//create player 2
var head2 = new THREE.Object3D();
var cannon2 = new THREE.Object3D();
var barrel2 = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 50, 32), new THREE.MeshPhongMaterial({
   color: 0xaa5555
}));
cannon2.rotation.x = -1.57; // Changed this so that the cannon was initially pointing straight forward
barrel2.position.y = 40;
cannon2.add(barrel2);
cannon2.position.y = 0;
var turret2 = new THREE.Mesh(new THREE.SphereGeometry(32, 32, 16), new THREE.MeshPhongMaterial({
   color: 0xFF6347
}));
head2.add(turret2);
head2.add(cannon2);
head2.position.y = 25;
head2.position.z = 10;
head2.castShadow = true;
head2.receiveShadowShadow = true;
cannon2.castShadow = true;
cannon2.receiveShadowShadow = true;
barrel2.castShadow = true;
barrel2.receiveShadowShadow = true;

var block2 = new THREE.Mesh(new THREE.BoxGeometry(100, 50, 100), new THREE.MeshPhongMaterial({
   color: 0xFF6347
}));
block2.castShadow = true;
block2.receiveShadowShadow = true;

var player2 = new THREE.Object3D();
player2.add(block2);
player2.add(head2);
player2.Box3 = new THREE.Box3(new THREE.Vector3(950, 0, -1050), new THREE.Vector3(1050, 66, -950));
player2.position.set(1000, 26, -1000);
player2.rotation.y = Math.PI;
player2.receiveShadow = true;
player2.castShadow = true;
scene.add(player2);
var oldplayer2Box = new THREE.Box3(new THREE.Vector3(950, 0, -1050), new THREE.Vector3(1050, 66, -950));

//game loop
var render = function() {
   if (!player1Dead && !player2Dead) {
      var i, j;
      if (p1fireRate < 60) {
         p1fireRate++;
      }
      if (p2fireRate < 180) {
         p2fireRate++;
      }
      //update bullet pos
      for (i = 0; i < player1Shots.length; i++) {
         player1Shots[i].position.x += player1Shots[i].shotdX;
         player1Shots[i].position.y += player1Shots[i].shotdY;
         player1Shots[i].position.z += player1Shots[i].shotdZ;
         player1Shots[i].shotdY -= gravity;
         player1Shots[i].Box3.min.x = player1Shots[i].position.x - 5;
         player1Shots[i].Box3.max.x = player1Shots[i].position.x + 5;

         player1Shots[i].Box3.min.y = player1Shots[i].position.y - 5;
         player1Shots[i].Box3.max.y = player1Shots[i].position.y + 5;

         player1Shots[i].Box3.min.z = player1Shots[i].position.z - 5;
         player1Shots[i].Box3.max.z = player1Shots[i].position.z + 5;
         //create particle trail
         particleGroup1.triggerPoolEmitter(1, (pos.set(player1Shots[i].position.x, player1Shots[i].position.y, player1Shots[i].position.z)));

         //check if hit player
         if (player1Shots[i].Box3.isIntersectionBox(player2.Box3)) {
            scene.remove(player1Shots[i]);
            player1Shots.splice(i, 1);
            scene.remove(player2);
            audioHitPlayer.play();
            audioHitPlayer.currentTime = 0;
            gameOver(1);
            //alert("Player 1 wins! Refresh to replay.");
            player2Dead = true;
            player2.Box3 = new THREE.Box3(new THREE.Vector3(-100, -100, -100), new THREE.Vector3(-100, -100, -100));
         } else if (player1Shots[i].Box3.isIntersectionBox(player1.Box3)) {
            scene.remove(player1Shots[i]);
            player1Shots.splice(i, 1);
            scene.remove(player1);
            audioHitPlayer.play();
            audioHitPlayer.currentTime = 0;
            gameOver(2);
            //alert("Player 1 wins! Refresh to replay.");
            player1Dead = true;
            player2.Box3 = new THREE.Box3(new THREE.Vector3(-100, -100, -100), new THREE.Vector3(-100, -100, -100));
         } else if (player1Shots[i].Box3.isIntersectionBox(boundries[0].Box3) || player1Shots[i].Box3.isIntersectionBox(boundries[1].Box3) ||
            player1Shots[i].Box3.isIntersectionBox(boundries[2].Box3) || player1Shots[i].Box3.isIntersectionBox(boundries[3].Box3) ||
            player1Shots[i].Box3.isIntersectionBox(ground.Box3)) {
            //check if out of bounds
            //scene.remove(player1Shots[i]);
            //player1Shots.splice(i, 1);
            if (player1Shots[i].Box3.isIntersectionBox(boundries[0].Box3) || player1Shots[i].Box3.isIntersectionBox(boundries[1].Box3))
               player1Shots[i].shotdX *= -1.0;
            else {
               player1Shots[i].shotdZ *= -1.0;
            }
            player1Shots[i].shotdY *= -1.0;
            player1Shots[i].counter++;
            audioHitTerrain.play();
            audioHitTerrain.currentTime = 0;
         } else if (player1Shots[i].position.y - 5 < 0) {
            scene.remove(player1Shots[i]);
            player1Shots.splice(i, 1);
            audioHitTerrain.play();
            audioHitTerrain.currentTime = 0;
         } else {
            //check if hit wall
            for (j = 0; j < walls.length; j++) {
               if (player1Shots[i].Box3.isIntersectionBox(walls[j].Box3)) {
                  //scene.remove(player1Shots[i]);
                  if (player1Shots[i].Box3.isIntersectionBox(walls[0].Box3) || player1Shots[i].Box3.isIntersectionBox(walls[1].Box3))
                     player1Shots[i].shotdX *= -1.0;
                  else {
                     player1Shots[i].shotdZ *= -1.0;
                  }
                  player1Shots[i].shotdY *= -1.0;
                  player1Shots[i].counter++;
                  scene.remove(walls[j]);
                  walls.splice(j, 1);
                  wall1 = true;
                  audioHitBox.play();
                  audioHitBox.currentTime = 0;
                  break;
               }
            }
            if (player1Shots[i].counter > 1 || wall1) {
               scene.remove(player1Shots[i]);
               player1Shots.splice(i, 1);
               wall1 = false;
            }
         }

      }
      for (i = 0; i < player2Shots.length; i++) {
         player2Shots[i].position.x += player2Shots[i].shotdX;
         player2Shots[i].position.y += player2Shots[i].shotdY;
         player2Shots[i].position.z += player2Shots[i].shotdZ;
         player2Shots[i].shotdY -= gravity;
         player2Shots[i].Box3.min.x = player2Shots[i].position.x - 5;
         player2Shots[i].Box3.max.x = player2Shots[i].position.x + 5;

         player2Shots[i].Box3.min.y = player2Shots[i].position.y - 5;
         player2Shots[i].Box3.max.y = player2Shots[i].position.y + 5;

         player2Shots[i].Box3.min.z = player2Shots[i].position.z - 5;
         player2Shots[i].Box3.max.z = player2Shots[i].position.z + 5;
         //create particle trail
         particleGroup2.triggerPoolEmitter(1, (pos.set(player2Shots[i].position.x, player2Shots[i].position.y, player2Shots[i].position.z)));

         //check if hit player
         if (player2Shots[i].Box3.isIntersectionBox(player1.Box3)) {
            scene.remove(player2Shots[i]);
            player1Shots.splice(i, 1);
            scene.remove(player1);
            audioHitPlayer.play();
            audioHitPlayer.currentTime = 0;
            gameOver(2);
            //alert("Player 1 wins! Refresh to replay.");
            player1Dead = true;
            player2.Box3 = new THREE.Box3(new THREE.Vector3(-100, -100, -100), new THREE.Vector3(-100, -100, -100));
         } else if (player2Shots[i].Box3.isIntersectionBox(boundries[0].Box3) || player2Shots[i].Box3.isIntersectionBox(boundries[1].Box3) ||
            player2Shots[i].Box3.isIntersectionBox(boundries[2].Box3) || player2Shots[i].Box3.isIntersectionBox(boundries[3].Box3) ||
            player2Shots[i].Box3.isIntersectionBox(ground.Box3)) {
            //check if out of bounds
            if (player2Shots[i].Box3.isIntersectionBox(boundries[0].Box3) || player2Shots[i].Box3.isIntersectionBox(boundries[1].Box3)) {
               player2Shots[i].shotdX *= -1.0;
               player2Shots[i].counter++;
            } else {
               player2Shots[i].shotdZ *= -1.0;
               player2Shots[i].counter++;
            }
            player2Shots[i].shotdY *= -1.0;
            audioHitTerrain.play();
            audioHitTerrain.currentTime = 0;
         } else if (player2Shots[i].position.y - 5 < 0) {
            scene.remove(player2Shots[i]);
            player2Shots.splice(i, 1);
            audioHitTerrain.play();
            audioHitTerrain.currentTime = 0;
         } else {
            //check if hit wall
            for (j = 0; j < walls.length; j++) {
               if (player2Shots[i].Box3.isIntersectionBox(walls[j].Box3)) {
                  if (player2Shots[i].Box3.isIntersectionBox(walls[0].Box3) || player2Shots[i].Box3.isIntersectionBox(walls[1].Box3))
                     player2Shots[i].shotdX *= -1.0;
                  else {
                     player2Shots[i].shotdZ *= -1.0;
                  }
                  player2Shots[i].shotdY *= -1.0;
                  player2Shots[i].counter++;
                  scene.remove(walls[j]);
                  walls.splice(j, 1);
                  wall2 = true;
                  audioHitBox.play();
                  audioHitBox.currentTime = 0;
                  break;
               }
            }
         }
         if (player2Shots[i].counter > 1 || wall2) {
            scene.remove(player2Shots[i]);
            player2Shots.splice(i, 1);
            wall2 = false;
         }
      }
      //player 1 movement
      if (Key.isDown(Key.UP)) {
         player1.position.z -= 5 * Math.cos(player1.rotation.y);
         player1.position.x -= 5 * Math.sin(player1.rotation.y);
         player1.Box3.min.x = player1.position.x - 50;
         player1.Box3.max.x = player1.position.x + 50;
         player1.Box3.min.z = player1.position.z - 50;
         player1.Box3.max.z = player1.position.z + 50;
         for (i = 0; i < walls.length; i++) {
            //check if there was even a collision
            if (player1.Box3.isIntersectionBox(walls[i].Box3)) {
               //check which way the collision came from
               //left or right
               if (oldplayer1Box.max.x < walls[i].Box3.min.x && player1.Box3.max.x > walls[i].Box3.min.x ||
                  oldplayer1Box.min.x > walls[i].Box3.max.x && player1.Box3.min.x < walls[i].Box3.max.x) {
                  player1.position.x += 5 * Math.sin(player1.rotation.y);
                  player1.Box3.min.x = player1.position.x - 50;
                  player1.Box3.max.x = player1.position.x + 50;
               } else { // up or down
                  player1.position.z += 5 * Math.cos(player1.rotation.y);
                  player1.Box3.min.z = player1.position.z - 50;
                  player1.Box3.max.z = player1.position.z + 50;
               }
            }
         }
         if (player1.Box3.isIntersectionBox(player2.Box3)) {
            player1.position.x += 5 * Math.sin(player1.rotation.y);
            player1.Box3.min.x = player1.position.x - 50;
            player1.Box3.max.x = player1.position.x + 50;
            player1.position.z += 5 * Math.cos(player1.rotation.y);
            player1.Box3.min.z = player1.position.z - 50;
            player1.Box3.max.z = player1.position.z + 50;
         }
      }
      if (Key.isDown(Key.LEFT)) {
         player1.rotation.y += 1 * Math.PI / 180;
      }
      if (Key.isDown(Key.DOWN)) {
         player1.position.z += 5 * Math.cos(player1.rotation.y);
         player1.position.x += 5 * Math.sin(player1.rotation.y);
         player1.Box3.min.x = player1.position.x - 50;
         player1.Box3.max.x = player1.position.x + 50;
         player1.Box3.min.z = player1.position.z - 50;
         player1.Box3.max.z = player1.position.z + 50;
         for (i = 0; i < walls.length; i++) {
            if (player1.Box3.isIntersectionBox(walls[i].Box3)) {
               //check which way the collision came from
               //left or right
               if (oldplayer1Box.max.x < walls[i].Box3.min.x && player1.Box3.max.x > walls[i].Box3.min.x ||
                  oldplayer1Box.min.x > walls[i].Box3.max.x && player1.Box3.min.x < walls[i].Box3.max.x) {
                  player1.position.x -= 5 * Math.sin(player1.rotation.y);
                  player1.Box3.min.x = player1.position.x - 50;
                  player1.Box3.max.x = player1.position.x + 50;
               } else { // up or down
                  player1.position.z -= 5 * Math.cos(player1.rotation.y);
                  player1.Box3.min.z = player1.position.z - 50;
                  player1.Box3.max.z = player1.position.z + 50;
               }
            }
         }
         if (player1.Box3.isIntersectionBox(player2.Box3)) {
            player1.position.x -= 5 * Math.sin(player1.rotation.y);
            player1.Box3.min.x = player1.position.x - 50;
            player1.Box3.max.x = player1.position.x + 50;
            player1.position.z -= 5 * Math.cos(player1.rotation.y);
            player1.Box3.min.z = player1.position.z - 50;
            player1.Box3.max.z = player1.position.z + 50;
         }
      }
      if (Key.isDown(Key.RIGHT)) {
         player1.rotation.y -= 1 * Math.PI / 180;
      }
      //player 2 movement

      if (counter == 90) {
         k = Math.floor(Math.random() * 4);
         counter = 0;
      }
      counter++;

      if (k == 0) {
         player2.position.z -= 5 * Math.cos(player2.rotation.y);
         player2.position.x -= 5 * Math.sin(player2.rotation.y);
         player2.Box3.min.x = player2.position.x - 50;
         player2.Box3.max.x = player2.position.x + 50;
         player2.Box3.min.z = player2.position.z - 50;
         player2.Box3.max.z = player2.position.z + 50;
         for (i = 0; i < walls.length; i++) {
            if (player2.Box3.isIntersectionBox(walls[i].Box3)) {
               //check which way the collision came from
               //left or right
               if (oldplayer2Box.max.x < walls[i].Box3.min.x && player2.Box3.max.x > walls[i].Box3.min.x ||
                  oldplayer2Box.min.x > walls[i].Box3.max.x && player2.Box3.min.x < walls[i].Box3.max.x) {
                  player2.position.x += 5 * Math.sin(player2.rotation.y);
                  player2.Box3.min.x = player2.position.x - 50;
                  player2.Box3.max.x = player2.position.x + 50;
               } else { // up or down
                  player2.position.z += 5 * Math.cos(player2.rotation.y);
                  player2.Box3.min.z = player2.position.z - 50;
                  player2.Box3.max.z = player2.position.z + 50;
               }
            }
         }
         if (player1.Box3.isIntersectionBox(player2.Box3)) {
            player2.position.x += 5 * Math.sin(player2.rotation.y);
            player2.Box3.min.x = player2.position.x - 50;
            player2.Box3.max.x = player2.position.x + 50;
            player2.position.z += 5 * Math.cos(player2.rotation.y);
            player2.Box3.min.z = player2.position.z - 50;
            player2.Box3.max.z = player2.position.z + 50;
         }
      }
      //if (Key.isDown(Key.J)) {
      if (k == 1) {
         player2.rotation.y += 1 * Math.PI / 180;
      }
      //if (Key.isDown(Key.K)) {
      if (k == 2) {
         player2.position.z += 5 * Math.cos(player2.rotation.y);
         player2.position.x += 5 * Math.sin(player2.rotation.y);
         player2.Box3.min.x = player2.position.x - 50;
         player2.Box3.max.x = player2.position.x + 50;
         player2.Box3.min.z = player2.position.z - 50;
         player2.Box3.max.z = player2.position.z + 50;
         for (i = 0; i < walls.length; i++) {
            if (player2.Box3.isIntersectionBox(walls[i].Box3)) {
               //check which way the collision came from
               //left or right
               if (oldplayer2Box.max.x < walls[i].Box3.min.x && player2.Box3.max.x > walls[i].Box3.min.x ||
                  oldplayer2Box.min.x > walls[i].Box3.max.x && player2.Box3.min.x < walls[i].Box3.max.x) {
                  player2.position.x -= 5 * Math.sin(player2.rotation.y);
                  player2.Box3.min.x = player2.position.x - 50;
                  player2.Box3.max.x = player2.position.x + 50;
               } else { // up or down
                  player2.position.z -= 5 * Math.cos(player2.rotation.y);
                  player2.Box3.min.z = player2.position.z - 50;
                  player2.Box3.max.z = player2.position.z + 50;
               }
            }
         }
         if (player1.Box3.isIntersectionBox(player2.Box3)) {
            player2.position.x -= 5 * Math.sin(player2.rotation.y);
            player2.Box3.min.x = player2.position.x - 50;
            player2.Box3.max.x = player2.position.x + 50;
            player2.position.z -= 5 * Math.cos(player2.rotation.y);
            player2.Box3.min.z = player2.position.z - 50;
            player2.Box3.max.z = player2.position.z + 50;
         }
      }
      //if (Key.isDown(Key.L)) {
      if (k == 3) {
         player2.rotation.y -= 1 * Math.PI / 180;
      }

      // SET movement

      // if (counter < 90 || (counter > 181 && counter < 270)){
      //    player2.position.z -= 5 * Math.cos(player2.rotation.y);
      //    player2.position.x -= 5 * Math.sin(player2.rotation.y);
      //    player2.Box3.min.x = player2.position.x - 50;
      //    player2.Box3.max.x = player2.position.x + 50;
      //    player2.Box3.min.z = player2.position.z - 50;
      //    player2.Box3.max.z = player2.position.z + 50;
      //    for (i = 0; i < walls.length; i++) {
      //       if (player2.Box3.isIntersectionBox(walls[i].Box3)) {
      //          //check which way the collision came from
      //          //left or right
      //          if (oldplayer2Box.max.x < walls[i].Box3.min.x && player2.Box3.max.x > walls[i].Box3.min.x ||
      //             oldplayer2Box.min.x > walls[i].Box3.max.x && player2.Box3.min.x < walls[i].Box3.max.x) {
      //             player2.position.x += 5 * Math.sin(player2.rotation.y);
      //             player2.Box3.min.x = player2.position.x - 50;
      //             player2.Box3.max.x = player2.position.x + 50;
      //          } else { // up or down
      //             player2.position.z += 5 * Math.cos(player2.rotation.y);
      //             player2.Box3.min.z = player2.position.z - 50;
      //             player2.Box3.max.z = player2.position.z + 50;
      //          }
      //       }
      //    }
      //    if (player1.Box3.isIntersectionBox(player2.Box3)) {
      //       player2.position.x += 5 * Math.sin(player2.rotation.y);
      //       player2.Box3.min.x = player2.position.x - 50;
      //       player2.Box3.max.x = player2.position.x + 50;
      //       player2.position.z += 5 * Math.cos(player2.rotation.y);
      //       player2.Box3.min.z = player2.position.z - 50;
      //       player2.Box3.max.z = player2.position.z + 50;
      //    }
      // }
      // //if (Key.isDown(Key.J)) {
      // if (counter > 271 && counter < 360){
      //    player2.rotation.y += 1 * Math.PI / 180;
      // }
      // //if (Key.isDown(Key.L)) {
      // if (counter < 180 && counter > 91){
      //    counter < 180 && counter > 91
      //    player2.rotation.y -= 1 * Math.PI / 180;
      // }
      // //
      // if (counter == 360)
      //    counter = 0;









      //Collision with boundaries
      if (player1.position.z + 50 > arenaSize / 2) {
         player1.position.z = arenaSize / 2 - 50;
         player1.Box3.min.z = player1.position.z - 50;
         player1.Box3.max.z = player1.position.z + 50;
      }
      if (player1.position.z - 50 < -arenaSize / 2) {
         player1.position.z = -arenaSize / 2 + 50;
         player1.Box3.min.z = player1.position.z - 50;
         player1.Box3.max.z = player1.position.z + 50;
      }
      if (player1.position.x + 50 > arenaSize / 2) {
         player1.position.x = arenaSize / 2 - 50;
         player1.Box3.min.x = player1.position.x - 50;
         player1.Box3.max.x = player1.position.x + 50;
      }
      if (player1.position.x - 50 < -arenaSize / 2) {
         player1.position.x = -arenaSize / 2 + 50;
         player1.Box3.min.x = player1.position.x - 50;
         player1.Box3.max.x = player1.position.x + 50;
      }
      if (player2.position.z + 50 > arenaSize / 2) {
         player2.position.z = arenaSize / 2 - 50;
         player2.Box3.min.z = player2.position.z - 50;
         player2.Box3.max.z = player2.position.z + 50;
      }
      if (player2.position.z - 50 < -arenaSize / 2) {
         player2.position.z = -arenaSize / 2 + 50;
         player2.Box3.min.z = player2.position.z - 50;
         player2.Box3.max.z = player2.position.z + 50;
      }
      if (player2.position.x + 50 > arenaSize / 2) {
         player2.position.x = arenaSize / 2 - 50;
         player2.Box3.min.x = player2.position.x - 50;
         player2.Box3.max.x = player2.position.x + 50;
      }
      if (player2.position.x - 50 < -arenaSize / 2) {
         player2.position.x = -arenaSize / 2 + 50;
         player2.Box3.min.x = player2.position.x - 50;
         player2.Box3.max.x = player2.position.x + 50;
      }
      //finally sync old hitbox states (for collision detection next frame)
      oldplayer1Box.min.x = player1.position.x - 50;
      oldplayer1Box.max.x = player1.position.x + 50;
      oldplayer1Box.min.z = player1.position.z - 50;
      oldplayer1Box.max.z = player1.position.z + 50;
      oldplayer2Box.min.x = player2.position.x - 50;
      oldplayer2Box.max.x = player2.position.x + 50;
      oldplayer2Box.min.z = player2.position.z - 50;
      oldplayer2Box.max.z = player2.position.z + 50;

      //Rotate turrets
      //left and right
      if (Key.isDown(Key.Q)) {
         head1.rotation.y += 1 * Math.PI / 180;
      }

      if (Key.isDown(Key.E)) {
         head1.rotation.y -= 1 * Math.PI / 180;
      }

      if (Key.isDown(Key.U)) {
         head2.rotation.y += 1 * Math.PI / 180;
      }

      if (Key.isDown(Key.O)) {
         head2.rotation.y -= 1 * Math.PI / 180;
      }
      //up the down
      // if (Key.isDown(Key.R)) {
      // 	cannon1.rotation.x += 0.5 * Math.PI / 180;
      // 	if (cannon1.rotation.x > 0) {
      // 		cannon1.rotation.x = 0;
      // 	}
      // }
      // if (Key.isDown(Key.F)) {
      // 	cannon1.rotation.x -= 0.5 * Math.PI / 180;
      // 	if (cannon1.rotation.x < -90 * Math.PI / 180) {
      // 		cannon1.rotation.x = -90 * Math.PI / 180;
      // 	}
      // }
      // if (Key.isDown(Key.Y)) {
      // 	cannon2.rotation.x += 0.5 * Math.PI / 180;
      // 	if (cannon2.rotation.x > 0) {
      // 		cannon2.rotation.x = 0;
      // 	}
      // }
      // if (Key.isDown(Key.H)) {
      // 	cannon2.rotation.x -= 0.5 * Math.PI / 180;
      // 	if (cannon2.rotation.x < -90 * Math.PI / 180) {
      // 		cannon2.rotation.x = -90 * Math.PI / 180;
      // 	}
      // }

      //Firing
      if (p1fireRate == 60 && Key.isDown(Key.SPACEBAR)) {
         //create bullet
         player1Shots.push(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshLambertMaterial({
            color: 0x2222aa
         })));
         player1Shots[player1Shots.length - 1].Box3 = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
         player1Shots[player1Shots.length - 1].castShadow = true;
         player1Shots[player1Shots.length - 1].receiveShadow = true;
         player1Shots[player1Shots.length - 1].position.set(player1.position.x + (80 * Math.sin(cannon1.rotation.x)) * Math.sin(head1.rotation.y + player1.rotation.y),
            player1.position.y + head1.position.y + cannon1.position.y + 80 * Math.cos(cannon1.rotation.x),
            player1.position.z + head1.position.z + (80 * Math.sin(cannon1.rotation.x)) * Math.cos(head1.rotation.y + player1.rotation.y));
         //set bullet velocity
         player1Shots[player1Shots.length - 1].shotdX = shotSpeed * Math.sin(cannon1.rotation.x) * Math.sin(head1.rotation.y + player1.rotation.y);
         player1Shots[player1Shots.length - 1].shotdY = shotSpeed * Math.cos(cannon1.rotation.x);
         player1Shots[player1Shots.length - 1].shotdZ = shotSpeed * Math.sin(cannon1.rotation.x) * Math.cos(head1.rotation.y + player1.rotation.y);
         scene.add(player1Shots[player1Shots.length - 1]);
         audioShoot.play();
         audioShoot.currentTime = 0;
         p1fireRate = 0;
         for (i = 0; i < player1Shots.length; i++) {
            player1Shots[i].counter = 0;
         }
      }
      //if (p2fireRate == 180) {
      // THIS IS FOR HARDER setting
      if (p2fireRate == 120) {
         //create bullet
         player2Shots.push(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshLambertMaterial({
            color: 0xaa2222
         })));
         player2Shots[player2Shots.length - 1].Box3 = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
         player2Shots[player2Shots.length - 1].castShadow = true;
         player2Shots[player2Shots.length - 1].receiveShadow = true;
         player2Shots[player2Shots.length - 1].position.set(player2.position.x + (80 * Math.sin(cannon2.rotation.x)) * Math.sin(head2.rotation.y + player2.rotation.y),
            player2.position.y + head2.position.y + cannon2.position.y + 80 * Math.cos(cannon2.rotation.x),
            player2.position.z + head2.position.z + (80 * Math.sin(cannon2.rotation.x)) * Math.cos(head2.rotation.y + player2.rotation.y));
         //set bullet velocity
         player2Shots[player2Shots.length - 1].shotdX = shotSpeed * Math.sin(cannon2.rotation.x) * Math.sin(head2.rotation.y + player2.rotation.y);
         player2Shots[player2Shots.length - 1].shotdY = shotSpeed * Math.cos(cannon2.rotation.x);
         player2Shots[player2Shots.length - 1].shotdZ = shotSpeed * Math.sin(cannon2.rotation.x) * Math.cos(head2.rotation.y + player2.rotation.y);
         player2Shots[player2Shots.length - 1].particles = [];
         scene.add(player2Shots[player2Shots.length - 1]);
         audioShoot.play();
         //audioShoot.currentTime = 0;
         // if (dummy < 2){
         //    p2fireRate = 0;
         //    dummy++;
         // }
         p2fireRate = 0;
         for (i = 0; i < player2Shots.length; i++) {
            player2Shots[i].counter = 0;
         }
      }
   } else {
      if (Key.isDown(Key.B)) {
         if (player1Dead) {
            scene.add(player1);
         } else {
            scene.add(player2);
         }
         var i;
         for (i = 0; i < walls.length; i++) {
            scene.remove(walls[i]);
         }
         for (i = 0; i < player1Shots.length; i++) {
            scene.remove(player1Shots[i]);
         }
         for (i = 0; i < player2Shots.length; i++) {
            scene.remove(player2Shots[i]);
         }
         walls = [];
         player1Shots = [];
         player2Shots = [];
         addWalls();
         player1.position.set(-1000, 26, 1000);
         player2.position.set(1000, 26, -1000);
         player1.rotation.set(0, 0, 0);
         player2.rotation.set(0, Math.PI, 0);
         cannon1.rotation.x = -1.57;
         cannon2.rotation.x = -1.57;
         head1.rotation.set(0, 0, 0);
         head2.rotation.set(0, 0, 0);
         player1.Box3 = new THREE.Box3(new THREE.Vector3(-1050, 0, 950), new THREE.Vector3(-950, 66, 1050));
         player2.Box3 = new THREE.Box3(new THREE.Vector3(950, 0, -1050), new THREE.Vector3(1050, 66, -950));
         player1Dead = player2Dead = false;
         scene.remove(text1);
         scene.remove(text2);
      }
   }
   particleGroup1.tick(clock.getDelta());
   particleGroup2.tick(clock.getDelta());
   renderer.render(scene, camera); // render the scene
   requestAnimationFrame(render);
};

render();
