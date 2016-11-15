
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

    // load the simple mesh
    loadSimpleMesh();

    container = document.getElementById("container");
    container.appendChild( renderer.domElement );
    initEvents();

};

var loopCnt = 0;
var bAngle = true;
var radius = 2, theta = 0;

function simpleLoop() {
    requestAnimationFrame( simpleLoop );
    // MoveHim();

    theta += 0.1;

				camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
				//camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
				camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
				camera.lookAt( scene.position );

    renderer.render( scene, camera );
}

function loadSimpleMesh(){
  var loader = new THREE.JSONLoader();
  //loader.load( "models/hand_rig.js", addSimplMeshToScene );
  loader.load( "models/biker.json", addSimplMeshToScene );
}

var mymaterials = [];

function createMaterials(){

var alpha = .1;
var beta = .4;
var gamma = .1;

var specularShininess = Math.pow( 2, alpha * 10 );
var specularColor = new THREE.Color( beta * 0.2, beta * 0.2, beta * 0.2 );
//var diffuseColor = new THREE.Color().setHSL( alpha, 0.5, gamma * 0.5 * cnt ).multiplyScalar( 1 - beta * 0.2 );
var diffuseColor1 = new THREE.Color(beta * 0.2, beta * 0.2, beta * 0.2);//.setHSL( alpha, 0.5, gamma * 0.5 * cnt ).multiplyScalar( 1 - beta * 0.2 );
var material1 = new THREE.MeshPhongMaterial( {
								color: diffuseColor1,
								specular: specularColor,
								reflectivity: beta,
								shininess: specularShininess,
								shading: THREE.SmoothShading,
								envMap: null
							} );
mymaterials.push (material1);

var diffuseColor2 = new THREE.Color("grey");
var material2 = new THREE.MeshPhongMaterial( {
								color: diffuseColor2,
								specular: specularColor,
								reflectivity: beta,
								shininess: specularShininess,
								shading: THREE.SmoothShading,
								envMap: null
							} );
mymaterials.push (material2);

var diffuseColor3 = new THREE.Color("black");
var material3 = new THREE.MeshPhongMaterial( {
								color: diffuseColor3,
								specular: specularColor,
								reflectivity: beta,
								shininess: specularShininess,
								shading: THREE.SmoothShading,
								envMap: null
							} );
mymaterials.push (material3);


	//mymaterials.push( new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } ) );
	//mymaterials.push( new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } ) );
	//mymaterials.push( new THREE.MeshNormalMaterial( ) );
	//mymaterials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } ) );
	//mymaterials.push( new THREE.MeshBasicMaterial( { color: 0xff0000, blending: THREE.SubtractiveBlending } ) );

	//mymaterials.push( new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading } ) );
	//mymaterials.push( new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading } ) );
	//mymaterials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: false } ) );
  //mymaterials.push( new THREE.MeshBasicMaterial( { color: 0xdddddd, wireframe: false } ) );

	//mymaterials.push( new THREE.MeshDepthMaterial() );

	//mymaterials.push( new THREE.MeshLambertMaterial( { color: "grey", emissive: 0xff0000, shading: THREE.SmoothShading } ) );
  //mymaterials.push( new THREE.MeshLambertMaterial( { color: "cyan", emissive: 0xff0000, shading: THREE.SmoothShading } ) );
  //mymaterials.push( new THREE.MeshLambertMaterial( { color: "black", emissive: 0xff0000, shading: THREE.SmoothShading } ) );

	//mymaterials.push( new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0xff0000, shininess: 10, shading: THREE.SmoothShading, opacity: 0.9, transparent: true } ) );



  mymaterials.forEach (function (mat){
    mat.skinning = true;
  });
}

function addSimplMeshToScene ( model, materials ) {
  var material;

  materials.forEach (function (mat){
    mat.skinning = true;
  });

createMaterials();
  var multi = new THREE.MeshFaceMaterial (mymaterials);
  simpleMesh = new THREE.SkinnedMesh(
    model,
    multi
  );
  //simpleMesh.scale.set(50,50,50);
  //simpleMesh.castShadow = true;
  //simpleMesh.receiveShadow = true;
  //simpleMesh.rotation.y = 180 * ToRad;
  simpleMesh.castShadow = true;
  simpleMesh.receiveShadow = false;

  simpleMesh.rotation.x = 180 * ToRad;
  //simpleMesh.rotation.y = 180 * ToRad;

  scene.add( simpleMesh );

  helper = new THREE.SkeletonHelper(simpleMesh);
  scene.add (helper);

  // start the simple loop
  simpleLoop();
};

function advancedSetup(){
    // Setup a new scene
    scene = new THREE.Scene();

    //camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    initCamera(0, -1,-5);

    // lights

    scene.add( new THREE.AmbientLight( 0x3D4143 ) );
    /*
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
    */

    var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( -1, 1.75, 1 );
  dirLight.position.multiplyScalar( 50 );
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  var d = 50;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;
  scene.add( dirLight );



    // three renderer
    renderer = new THREE.WebGLRenderer({precision: "mediump", antialias:true, alpha: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.renderReverseSided = false;
    renderer.setClearColor(new THREE.Color("cyan"));

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

function moveHim(){
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
  var angle1 = Math.sin (loopCnt);
  loopCnt += .1;
  /*if (bAngle){
    angle0 = 90 * ToRad;
    bAngle = false;
  }else{
    angle0 = 1 * ToRad;
    bAngle = true;
  }*/

  mtx2.makeRotationX(angle0);
  mtx.multiply( mtx2 );

  pos.setFromMatrixPosition( mtx );
  quat.setFromRotationMatrix( mtx );
  //simpleMesh.position.copy(pos);
  //simpleMesh.bones[0].quaternion.copy(quat);

  //var xAxis = new THREE.Vector3(1,0,0);
  //rotateAroundWorldAxis(mesh, xAxis, Math.PI / 180);

  //helper.bones[16].position.copy(pos);
  //helper.bones[10].quaternion.copy(quat);
  var arm = getBone ('upper_arm.R');
  var leg = getBone ('thigh.L');
  if (arm != null){
      arm.rotation.setFromRotationMatrix(mtx);
      leg.rotation.setFromRotationMatrix(mtx);
      helper.update ();
  }

  mtx2 = new THREE.Matrix4();
  mtx.makeTranslation( 1, loc, 1);
  mtx2.makeRotationX(angle1);
  mtx.multiply( mtx2 );
  arm = getBone ('upper_arm.L');
  leg = getBone ('thigh.R');
  if (arm != null){
      arm.rotation.setFromRotationMatrix(mtx);
      leg.rotation.setFromRotationMatrix(mtx);
      helper.update ();
  }
}

function getBone (name){
    for (var i = 0, len = helper.bones.length; i < len; i++) {
        if (helper.bones[i].name == name){
            return helper.bones[i];
        }
    }
    return null;
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
