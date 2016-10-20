
window.addEventListener('DOMContentLoaded', function() {
   Go();
});

var scene = null;
var camera = null;
var renderer = null;
var light = null;
var container = null;
var mats = {};
var geos = {};
var total_body_parts = 9;
var body_part_cnt = 0;
var body_parts = {
    body: 0,
    upperArmL: 1,
    upperArmR: 2,
    lowerArmL: 3,
    lowerArmR: 4,
    upperLegL: 5,
    upperLegR: 6,
    lowerLegL: 7,
    lowerLegR: 8
}

// Models
var athelete = [null, null, null, null, null, null,null, null, null];

// oimo
var world = null;
var Hmeshs = {};
var Hbodys = {};
var bodys = [];
var meshs = [];
var helper;

// human
var human;
var nHuman = 1;
var sliders;

// Simple mesh
var simpleMesh;

var ToRad = Math.PI / 180;

function Go() {

    advancedSetup();

    // geometrys
    geos['sphere'] = new THREE.BufferGeometry();
    geos['sphere'].fromGeometry( new THREE.SphereGeometry( 1 , 20, 10 ) );
    geos['box'] = new THREE.BufferGeometry();
    geos['box'].fromGeometry( new THREE.BoxGeometry( 1, 1, 1 ) );

    // materials
    mats['sph'] = new THREE.MeshPhongMaterial( { color: 0x99999A, name:'sph' ,specular: 0xFFFFFF, shininess: 120, transparent: true, opacity: 0.9 } );
    mats['box'] = new THREE.MeshLambertMaterial( {  color: 0xAA8058, name:'box' } );
    mats['ssph'] = new THREE.MeshPhongMaterial( { color:  0x666667, name:'ssph', specular: 0xFFFFFF, shininess: 120 , transparent: true, opacity: 0.7} );
    mats['sbox'] = new THREE.MeshLambertMaterial( {  color: 0x383838, name:'sbox' } );
    mats['ground'] = new THREE.MeshLambertMaterial( { color: 0x3D4143 } );

    // load the simple mesh
    loadSimpleMesh();

    container = document.getElementById("container");
    container.appendChild( renderer.domElement );
    initEvents();

};
var loopCnt = 0;
var bAngle = true;
function simpleLoop() {
    requestAnimationFrame( simpleLoop );

    var mtx, mtx2;
    mtx = new THREE.Matrix4();
    var pos = new THREE.Vector3();
    var quat = new THREE.Quaternion();

    var loc = 1;
    if (bAngle){
      loc *= -1;
      bAngle = false;
    }else{
      bAngle = true;
    }

    mtx.makeTranslation( 1, loc, 1);
    mtx2 = new THREE.Matrix4();
    //mtx2.makeRotationY(90*ToRad);
    //mtx.multiply( mtx2 );
    var angle0 = Math.cos (loopCnt);// * ToRad;
    loopCnt += .1;
    /*if (bAngle){
      angle0 = 90 * ToRad;
      bAngle = false;
    }else{
      angle0 = 1 * ToRad;
      bAngle = true;
    }*/

    mtx2.makeRotationZ(angle0);
    mtx.multiply( mtx2 );

    pos.setFromMatrixPosition( mtx );
    quat.setFromRotationMatrix( mtx );
    //simpleMesh.position.copy(pos);
    //simpleMesh.bones[0].quaternion.copy(quat);

    //var xAxis = new THREE.Vector3(1,0,0);
    //rotateAroundWorldAxis(mesh, xAxis, Math.PI / 180);

    //helper.bones[16].position.copy(pos);
    //helper.bones[10].quaternion.copy(quat);
    helper.bones[10].rotation.setFromRotationMatrix(mtx);
    helper.update ();
    renderer.render( scene, camera );
}
// Rotate an object around an arbitrary axis in object space
var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(rotObjectMatrix);

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js r50-r58:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // new code for Three.js r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = rotWorldMatrix;

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

function loop() {
    requestAnimationFrame( loop );

   var mtx, mtx2;
    var pos = new THREE.Vector3(), quat = new THREE.Quaternion();

    if( body_part_cnt == total_body_parts ){
        for (var i = 0; i < body_part_cnt; i++){
            mtx = new THREE.Matrix4();

            if (i == body_parts.upperLegR){
                mtx.makeTranslation( 140, 20, 0);
                mtx2 = new THREE.Matrix4();
                mtx2.makeRotationY(90*ToRad);
                mtx.multiply( mtx2 );

                mtx2 = new THREE.Matrix4();
                mtx2.makeRotationX(-33*ToRad);
                mtx.multiply( mtx2 );
            }else if(i == body_parts.lowerLegR){
                mtx.makeTranslation( 15, 5, 0);
                mtx2 = new THREE.Matrix4();
                mtx2.makeRotationY(90*ToRad);
                mtx.multiply( mtx2 );

                mtx2 = new THREE.Matrix4();
                mtx2.makeRotationX(30*ToRad);
                mtx.multiply( mtx2 );
            }else if(i == body_parts.lowerArmR){
                mtx.makeTranslation( 15, 5, 0);
                mtx2 = new THREE.Matrix4();
                mtx2.makeRotationY(90*ToRad);
                mtx.multiply( mtx2 );

                mtx2 = new THREE.Matrix4();
                mtx2.makeRotationX(-180*ToRad);
                mtx.multiply( mtx2 );
            }else if(i == body_parts.upperArmR){
                mtx.makeTranslation( 15, 5, 0);
                mtx2 = new THREE.Matrix4();
                mtx2.makeRotationY(90*ToRad);
                mtx.multiply( mtx2 );

                mtx2 = new THREE.Matrix4();
                mtx2.makeRotationX(-180*ToRad);
                mtx.multiply( mtx2 );
            }else{
                mtx.makeTranslation( 0, 0, 0);
                mtx2 = new THREE.Matrix4();
                mtx2.makeRotationY(90*ToRad);
                mtx.multiply( mtx2 );

                mtx2 = new THREE.Matrix4();
                mtx2.makeRotationX(10*ToRad);
                mtx.multiply( mtx2 );
            }

            pos.setFromMatrixPosition( mtx );
            quat.setFromRotationMatrix( mtx );

            athelete[i].position.copy(pos);
            athelete[i].quaternion.copy(quat);

        }
    }

    renderer.render( scene, camera );
}

function loadSimpleMesh(){
  var loader = new THREE.JSONLoader();
  //loader.load( "models/hand_rig.js", addSimplMeshToScene );
  loader.load( "models/athele_rig.json", addSimplMeshToScene );
}

function addSimplMeshToScene ( model, materials ) {
  var material;

  materials.forEach (function (mat){
    mat.skinning = true;
  });

  simpleMesh = new THREE.SkinnedMesh(
    model,
    materials[0]
  );
  //simpleMesh.scale.set(50,50,50);
  //simpleMesh.castShadow = true;
  //simpleMesh.receiveShadow = true;
  simpleMesh.rotation.x = 90 * ToRad;

  scene.add( simpleMesh );

  helper = new THREE.SkeletonHelper(simpleMesh);
  scene.add (helper);

  // start the simple loop
  simpleLoop();
};

function loadAtheleteMeshes(){
  // Load the JSON files and provide callback functions (modelToScene
  var loader = new THREE.JSONLoader();
  loader.load( "models/body.js", addBodyToScene );
  loader.load( "models/upperArm.L.js", addupperArmLToScene );
  loader.load( "models/upperArm.R.js", addupperArmRToScene );
  loader.load( "models/lowerArm.L.js", addlowerArmLToScene );
  loader.load( "models/lowerArm.R.js", addlowerArmRToScene );
  loader.load( "models/upperLeg.L.js", addupperLegLToScene );
  loader.load( "models/upperLeg.R.js", addupperLegRToScene );
  loader.load( "models/lowerLeg.L.js", addlowerLegLToScene );
  loader.load( "models/lowerLeg.R.js", addlowerLegRToScene );
}

function addMeshToScene(mesh){
    mesh.scale.set(500,500,500);
    //mesh.matrixAutoUpdate = false;
    // mesh.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
    //mesh.rotation.y = Math.PI / 2;
    //mesh.rotation.x = Math.PI / 4;
    scene.add( mesh );
    // increment the body_parts
    body_part_cnt++;
    // Check if we are good to good
    isAtheleteLoaded();
}

function simpleSetup(){
    scene = new THREE.Scene();

    // Setup the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    camera.position.y = 0;

    // Setup the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add the lights
    var ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);

    light = new THREE.PointLight( 0xFFFFFF00 );
    light.position.set( -15, 10, 15 );
    scene.add( light );

    var axisHelper = new THREE.AxisHelper( 50 );
    scene.add( axisHelper );
}

function advancedSetup(){
    // Setup a new scene
    scene = new THREE.Scene();

    //camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    initCamera(0, -1,-5);

    // lights
    scene.add( new THREE.AmbientLight( 0x3D4143 ) );
    light = new THREE.DirectionalLight( 0xffffff , 1);
    light.position.set( 300, 1000, 500 );
    light.target.position.set( 0, 0, 0 );
    light.castShadow = true;
    light.shadowCameraNear = 500;
    light.shadowCameraFar = 1600;
    light.shadowCameraFov = 70;
    light.shadowBias = 0.0001;
    light.shadowDarkness = 0.7;
    //light.shadowCameraVisible = true;
    light.shadowMapWidth = light.shadowMapHeight = 1024;
    scene.add( light );

    // background
    var buffgeoBack = new THREE.BufferGeometry();
    buffgeoBack.fromGeometry( new THREE.IcosahedronGeometry(8000,1) );
    var back = new THREE.Mesh( buffgeoBack, new THREE.MeshBasicMaterial( { map:gradTexture([[1,0.75,0.5,0.25], ['#1B1D1E','#3D4143','#72797D', '#b0babf']]), side:THREE.BackSide, depthWrite: false }  ));
    back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15*ToRad));
    scene.add( back );

    // three renderer
    renderer = new THREE.WebGLRenderer({precision: "mediump", antialias:true, alpha: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;

    var axisHelper = new THREE.AxisHelper( 500 );
    scene.add( axisHelper );
}

function isAtheleteLoaded(){
    if( body_part_cnt == total_body_parts ){
        //initOimoPhysics();
        loop();
    }
}

function addStaticBox(size, position, rotation) {
    var mesh = new THREE.Mesh( geos.box, mats.ground );
    mesh.scale.set( size[0], size[1], size[2] );
    mesh.position.set( position[0], position[1], position[2] );
    mesh.rotation.set( rotation[0]*ToRad, rotation[1]*ToRad, rotation[2]*ToRad );
    scene.add( mesh );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
}

//----------------------------------
//  HUMAN KINEMATIC
//----------------------------------

function initHuman() {
    var older = document.body;
    sliders = {
        speed : new UI.Slide(older, "speed", humanSets, 0.3, [5,100, 150, 20], 0.5, 0, ' ', 2),
        thighRange : new UI.Slide(older, "thigh Range", humanSets, 50, [5,140, 150, 20], 90,0, '°'),
        thighBase : new UI.Slide(older, "thigh Base", humanSets, 100, [5,180, 150, 20], 180, 0, '°'),
        calfRange : new UI.Slide(older, "calf Range", humanSets, 30, [5,220, 150, 20], 90,0, '°'),
        calfOffset : new UI.Slide(older, "calf Offset", humanSets, -1.57, [5,260, 150, 20], 3.14, -3.14, '°', 2),
        armRange : new UI.Slide(older, "arm Range", humanSets, 55, [5,300, 150, 20], 360,0, '°'),
        foreArmRange : new UI.Slide(older, "foreArm Range", humanSets, 20, [5,340, 150, 20], 75, 0, '°'),
        foreArmOffset : new UI.Slide(older, "foreArm Offset", humanSets, -1.57, [5,380, 150, 20], 3.14, -3.14, '°', 2),
        gravity : new UI.Slide(older, "gravity", humanSets, 0.88, [5,420, 150, 20], 1,0, 'g', 2),
    }
    document.getElementById( "walk" ).addEventListener( "click", initWalk, false );
    document.getElementById( "run" ).addEventListener( "click", initRun, false );

    human = new Human();
    human.zw = 1000;
    human.zh = 400;
    initWalk();
}

function initWalk() {
	human.initWalk();
	slideUpdate();
}

function initRun() {
	human.initRun();
	slideUpdate();
}

function slideUpdate() {
	for ( var key in sliders ){
		sliders[ key ].value = human.sets[ key ];
	    sliders[ key ].updatePosition();
	}
}

function humanSets() {
    for ( var key in sliders ){
		human.sets[ key ] = sliders[ key ].value;
	}
}

//----------------------------------
//  OIMO PHYSICS
//----------------------------------

function initOimoPhysics(){
    collisionGroupes = {
        group1 : 1 << 0,  // 00000000 00000000 00000000 00000001
        group2 : 1 << 1,  // 00000000 00000000 00000000 00000010
        group3 : 1 << 2,  // 00000000 00000000 00000000 00000100
        all : 0xffffffff  // 11111111 11111111 11111111 11111111
    };

    world = new OIMO.World(1/60, 2, 8, true);

    var ground = new OIMO.Body({size:[1000, 40, 1000], pos:[0,-18,0], world:world});
    addStaticBox([1000, 40, 1000], [0,-18,0], [0,0,0]);

    // make physics humans
    initHuman();

    var bone, name, size, pos;
    for ( var i=0; i<nHuman; i++ ){
        for ( var key in human.bones ){
            bone = human.bones[ key ];
            name = key+i;
            pos = [bone.x, bone.y, bone.z];
            size = [bone.height, bone.width, bone.deepth];
            addOimoObjectToMesh (key, name, pos, size);
        }
    }

    setInterval(updateOimoPhysics, 1000/60);
}

function addOimoObjectToMesh(key, name, pos, size){
    var config = [10,0.4,0.2, collisionGroupes.group1, collisionGroupes.group2];
    var mesh, body;
    var pos = pos || [0, 0, 0];
    var size = size || [10, 10, 10];

    body = new OIMO.Body({type:'box', name:name, size:size, pos:pos, move:true, noSleep:true, world:world, config:config});

    if(key == 'body'){
        mesh = athelete[body_parts.body];
    } else if(key == 'LeftUpLeg'){
        mesh = athelete[body_parts.upperLegL];
    } else if(key == 'LeftLowLeg'){
        mesh = athelete[body_parts.lowerLegL];
    } else if(key == 'RightUpLeg'){
        mesh = athelete[body_parts.upperLegR];
    } else if(key == 'RightLowLeg'){
        mesh = athelete[body_parts.lowerLegR];
    } else if(key == 'LeftUpArm'){
        mesh = athelete[body_parts.upperArmL];
    } else if(key == 'LeftLowArm'){
        mesh = athelete[body_parts.lowerArmL];
    } else if(key == 'RightUpArm'){
        mesh = athelete[body_parts.upperArmR];
    }  else if(key == 'RightLowArm'){
        mesh = athelete[body_parts.lowerArmR];
    }

    Hmeshs[name] = mesh;
    Hbodys[name] = body;
}


function updateOimoPhysics() {
    world.step();

    //update humans
    human.update();
    var bone, name;
    var mtx, mtx2;
    var pos = new THREE.Vector3(), quat = new THREE.Quaternion();
    for ( var i=0; i<nHuman; i++ ){
        for ( var key in human.bones ){
            bone = human.bones[ key ];
            name = key+i;

            mtx = new THREE.Matrix4();
            mtx.makeTranslation( bone.x, 400-bone.y, 400-bone.z+(i*120)-250);

            mtx2 = new THREE.Matrix4();

            mtx2.makeRotationY(90*ToRad);
            mtx.multiply( mtx2 );

            mtx2 = new THREE.Matrix4();
            //mtx2.makeRotationX(15*ToRad);
            mtx2.makeRotationX(-bone.rotation+(90*ToRad));
            if (i == 0)
                mtx.multiply( mtx2 );

            mtx2 = new THREE.Matrix4();
            mtx2.makeTranslation( 0,-bone.width*0.5,0);
            mtx.multiply( mtx2 );

            pos.setFromMatrixPosition( mtx );
            quat.setFromRotationMatrix( mtx );

            Hbodys[name].setPosition(pos);
            Hbodys[name].setQuaternion(quat);
            Hmeshs[name].position.copy(pos);
            Hmeshs[name].quaternion.copy(quat);
        }
    }
}

//----------------------------------
//  TEXTURES
//----------------------------------

function gradTexture(color) {
    var c = document.createElement("canvas");
    var ct = c.getContext("2d");
    c.width = 16; c.height = 256;
    var gradient = ct.createLinearGradient(0,0,0,256);
    var i = color[0].length;

    while(i--){
        gradient.addColorStop(color[0][i],color[1][i]);
    }

    ct.fillStyle = gradient;
    ct.fillRect(0,0,16,256);
    var texture = new THREE.Texture(c);
    texture.needsUpdate = true;
    return texture;
}

function addBodyToScene ( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial(materials);
    athelete[body_parts.body] = new THREE.Mesh( geometry, material );
    addMeshToScene ( athelete[body_parts.body] );
};

function addupperArmLToScene ( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial(materials);
    athelete[body_parts.upperArmL] = new THREE.Mesh( geometry, material );
    addMeshToScene ( athelete[body_parts.upperArmL] );
};

function addupperArmRToScene ( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial(materials);
    athelete[body_parts.upperArmR] = new THREE.Mesh( geometry, material );
    addMeshToScene ( athelete[body_parts.upperArmR] );
};

function addlowerArmLToScene ( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial(materials);
    athelete[body_parts.lowerArmL] = new THREE.Mesh( geometry, material );
    addMeshToScene ( athelete[body_parts.lowerArmL] );
};

function addlowerArmRToScene ( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial(materials);
    athelete[body_parts.lowerArmR] = new THREE.Mesh( geometry, material );
    addMeshToScene ( athelete[body_parts.lowerArmR] );
};

function addupperLegLToScene ( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial(materials);
    athelete[body_parts.upperLegL] = new THREE.Mesh( geometry, material );
    addMeshToScene ( athelete[body_parts.upperLegL] );
};

function addupperLegRToScene ( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial(materials);
    athelete[body_parts.upperLegR] = new THREE.Mesh( geometry, material );
    addMeshToScene ( athelete[body_parts.upperLegR] );
};

function addlowerLegLToScene ( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial(materials);
    athelete[body_parts.lowerLegL] = new THREE.Mesh( geometry, material );
    addMeshToScene ( athelete[body_parts.lowerLegL] );
};

function addlowerLegRToScene ( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial(materials);
    athelete[body_parts.lowerLegR] = new THREE.Mesh( geometry, material );
    addMeshToScene ( athelete[body_parts.lowerLegR] );

};
