//Global Variables
// let scene;
let colMeshList = [];
let maxJump = false;
let keys = {
    l: false,
    r: false,
    u: false,
    d: false
};
let lookingRight = true;
let died = false;
let falling = false;
let character = {
    skelet: undefined,
    skin: undefined
};
let platforms = [];
// let renderer;
// let camera;

// const init = () => {
const frustumSize = 15;
const aspect = innerWidth / innerHeight;
let scene = new THREE.Scene();
const camBox = {
    l: frustumSize * aspect / -2,
    r: frustumSize * aspect / 2,
    t: frustumSize / 2,
    b: frustumSize / -2
}
let camera = new THREE.OrthographicCamera(camBox.l, camBox.r, camBox.t, camBox.b, 1, 1000);

const c = $('#csCanvas3d')[0];
let renderer = new THREE.WebGLRenderer({
    canvas: c,
    alpha: true
});
renderer.setSize(innerWidth, innerHeight);
const listener = new THREE.AudioListener();
camera.add(listener);
let sound = new THREE.Audio(listener);
let audioLoader = new THREE.AudioLoader();
audioLoader.load('audio/jump_01.wav', (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(0.5);
});
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);
// }
const createScene = () => {

    //Create platforms
    let leftPlatform = createCube(new THREE.Vector3(-5, -.1, .1), { color: 0xfff000 }, { x: -9, y: -3, z: .6 }, 'start');
    // let leftPlatform = createLine([new THREE.Vector3(-2, -1, 0), new THREE.Vector3(-12, -5, 0), new THREE.Vector3(-12, -1, 0), new THREE.Vector3(-2, -1, 0)], {
    //     color: 0xfff000
    // }, 'start');
    let rightPlatform = createLine([new THREE.Vector3(2, 0, 0), new THREE.Vector3(12, -2, 0), new THREE.Vector3(12, 0, 0), new THREE.Vector3(2, 0, 0)], {
        color: 0xfff000
    }, 'end');

    //Create deathline
    let deathLine = createLine([new THREE.Vector3(-frustumSize, -7, 0), new THREE.Vector3(frustumSize, -7, 0)], {
        transparent: true,
        opacity: 0.0
    }, 'die');
    
    platforms.push(rightPlatform);
    platforms.push(leftPlatform);

    colMeshList.push(leftPlatform);
    colMeshList.push(rightPlatform);
    colMeshList.push(deathLine);

    scene.add(leftPlatform);
    scene.add(rightPlatform);
    scene.add(deathLine);
}
const createCharacter = () => {
    let pos = {
        x: -9.5,
        y: 0,
        z: 0.1
    };
    let size = {
        x: 1,
        y: 1,
        z: 1
    }
    var texture = new THREE.TextureLoader().load('img/sprite/crate.gif');
    let skelet = createCube(size, { transparent: true, opacity: 0.0 }, pos);
    let skin = createCube(size, { map: texture }, pos);
    character.skin = skin;
    character.skelet = skelet;
    scene.add(skelet);
    scene.add(skin);
}

const createCube = (vector, meshMaterial, position, name = '') => {
    let geometry = new THREE.BoxGeometry(vector.x, vector.y, vector.z);
    let material = new THREE.MeshBasicMaterial(meshMaterial);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.name = name;
    return mesh;
}
const createLine = (vectors, lineBasicMaterial, name = '') => {
    let geometry = new THREE.Geometry();
    for (let i = 0; i < vectors.length; i++) {
        geometry.vertices.push(vectors[i]);
    }
    let material = new THREE.LineBasicMaterial(lineBasicMaterial);
    let mesh = new THREE.Line(geometry, material);
    mesh.name = name;
    return mesh;
}

//Animate
const sceneanimate = () => {
    requestAnimationFrame(sceneanimate);
    if (!died) {
        platforms.map(platform => {
            platform.material.color = new THREE.Color(0xfff000);
        })
        if (character.skelet)
            controlPlayer();
        renderer.render(scene, camera);
    } else
        diePlayer();
}
showsome(colMeshList);
const CollisionDetector = (cubeVertice, originPoint) => {
    let localVertx = cubeVertice.clone();
    let globalVertx = localVertx.applyMatrix4(character.skelet.matrix);
    let dirVector = globalVertx.sub(character.skelet.position.x);
    let ray = new THREE.Raycaster(originPoint, dirVector.clone().normalize());
    let colRes = ray.intersectObjects(colMeshList, true);
    

    if (colRes.length <= 0) {
        falling = true;
    } else {
        let colName = colRes[0].object.name;
        if (colName === 'die') {
            died = true;
        } else {
            if (colName === 'start' || colName === 'end') {
                colRes[0].object.material.color = new THREE.Color("deeppink");
                touchingObject = colRes[0];
            }
            falling = false;
        }
    }
}

let touchingObject = undefined;

controlPlayer = () => {

    let originPoint = character.skelet.position.clone();

    character.skelet.geometry.vertices.map(cubeVertice => {
        CollisionDetector(cubeVertice, originPoint);
    });

    if (keys.r && keys.l && keys.u) {
        if (character.skelet.position.y < 0)
            character.skelet.position.y = 0.5;
        else
            character.skelet.position.y -= (aspect / 10) * 1.2;
    } else {
        if (keys.r && character.skelet.position.x < camBox.r - 0.5)
            character.skelet.position.x += aspect / 10;
        if (keys.l && character.skelet.position.x > camBox.l + 0.5) {
            character.skelet.position.x -= aspect / 10;
        }
        if (keys.u && !maxJump) {
            character.skelet.position.y += aspect / 10;
            if (character.skelet.position.y > 2) {
                keys.u = false;
                maxJump = true;
            }
        }
        if (!keys.u) {
            if (!falling) {
                character.skelet.position.y = touchingObject.point.y + .5;
                maxJump = false;
                character.skin.rotation.z = 0;
            } else
                character.skelet.position.y -= (aspect / 10) * 1.2;
        }
        character.skin.position.x = character.skelet.position.x;
        character.skin.position.y = character.skelet.position.y;
        if (falling) {
            if (lookingRight)
                character.skin.rotation.z -= 15.0;
            else
                character.skin.rotation.z += 15.0;
        }
    }

}
diePlayer = () => {

    // showsome('Ye dieded BOI!');
}

//Eventlistners
document.addEventListener('keydown', e => {

    if (!died) {
        if (e.keyCode == 39) {
            keys.r = true;
            character.skin.scale.x = Math.abs(character.skin.scale.x);
            lookingRight = true;
        }
        if (e.keyCode == 37) {
            keys.l = true;
            character.skin.scale.x = -Math.abs(character.skin.scale.x);
            lookingRight = false;
        }
        if (e.keyCode == 38 && !maxJump) {
            keys.u = true;
            sound.play();
        }
        if (e.keyCode == 40)
            keys.d = true;
    } else {
        if (e.keyCode == 32) {
            scene.remove(character.skelet);
            scene.remove(character.skin);
            createCharacter();
            died = false;
        }
    }
});
document.addEventListener('keyup', e => {
    if (e.keyCode == 39)
        keys.r = false;
    if (e.keyCode == 37)
        keys.l = false;
    if (e.keyCode == 38)
        keys.u = false;
    if (e.keyCode == 40)
        keys.d = false;
});
createScene();
createCharacter();
sceneanimate();