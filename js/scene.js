
const sceneInit = () => {

    const frustumSize = 10;
    let scene = new THREE.Scene();
    const aspect = innerWidth / innerHeight;
    const camBox = {l:frustumSize * aspect / - 2, r:frustumSize * aspect / 2, t:frustumSize / 2, b:frustumSize / - 2}
    // let camera = new THREE.PerspectiveCamera( 90, innerWidth / innerHeight, 0.1, 1000);
    let camera = new THREE.OrthographicCamera( camBox.l,camBox.r,camBox.t,camBox.b, 1, 1000 );

    let keys = {
        l: false,
        r: false,
        u: false,
        d: false
    };

    const c = $('#csCanvas3d')[0];
    let renderer = new THREE.WebGLRenderer({canvas:c});
    renderer.setSize(innerWidth,innerHeight);
    const listener = new THREE.AudioListener();
    camera.add(listener);
    let sound = new THREE.Audio(listener);
    let audioLoader = new THREE.AudioLoader();
    let maxJump = false;
    audioLoader.load('audio/jump_01.wav', (buffer) =>{
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume (0.5);
    })
    let colMeshList = [];

    createCube = () => {
        let geometry = new THREE.CubeGeometry(1,1,1,1,1,1);
        var texture = new THREE.TextureLoader().load( 'img/sprite/crate.gif' );
        let material = new THREE.MeshBasicMaterial({map:texture });
        let mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(-9.5,-.5,0.1)
        return mesh;
    }
    createLine = (vectors) => {
        let geometry = new THREE.Geometry();
        for(let i = 0; i < vectors.length; i++ ){
            geometry.vertices.push(vectors[i]);
        }
        let material = new THREE.LineBasicMaterial( { color: 0xfff000 } );
        return new THREE.Line( geometry, material );
    }

    let cube = createCube();

    let line1 = createLine([new THREE.Vector3( -1, -1, 0),new THREE.Vector3( -12, -5, 0),new THREE.Vector3( -12, -1, 0),new THREE.Vector3( -1, -1, 0)]);
    
    let line2 = createLine([new THREE.Vector3( 2, -1, 0),new THREE.Vector3( 12, -5, 0),new THREE.Vector3( 12, -1, 0),new THREE.Vector3( 2, -1, 0)]);
    colMeshList.push(line1);
    colMeshList.push(line2);
    scene.add(cube);
    // scene.add(cube);
    scene.add(line1);
    scene.add(line2);
    camera.position.set( 0, 0, 5);
    document.addEventListener('mousewheel', e => {
        e.preventDefault;
        if(e.deltaY > 0  && camera.position.z < 50)
            camera.position.z += (e.deltaY / 100);
        else if (e.deltaY < 0 && camera.position.z > 5)
            camera.position.z += (e.deltaY / 100);
    });

    let lookingRight = true;
    document.addEventListener('keydown', e => {
        if(e.keyCode == 39){
            keys.r = true;
            cube.scale.x = 1;
            lookingRight = true;
        }
        if(e.keyCode == 37) {
            keys.l = true;
            cube.scale.x = -1;
            lookingRight = false;
        }
        if(e.keyCode == 38 && !maxJump) {
            keys.u = true;
            // sound.play();
        }
        if(e.keyCode == 40) 
            keys.d = true;
    });
    document.addEventListener('keyup', e => {
        if(e.keyCode == 39)
            keys.r = false;
        if(e.keyCode == 37)
            keys.l = false;
        if(e.keyCode == 38) 
            keys.u = false;
        if(e.keyCode == 40) 
            keys.d = false;
    });
    window.addEventListener('resize', () => {
        renderer.setSize(innerWidth,innerHeight);
        camera.aspect = innerWidth / innerHeight;
    });
    camera.lookAt( 0, 0, 0 );
    
    sceneanimate = () => {
        requestAnimationFrame(sceneanimate);
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        controlPlayer();
        renderer.render(scene, camera);
    }
    controlPlayer = () => {

        let originPoint = cube.position.clone();

        cube.geometry.vertices.map(cubeVertice => {
            let localVertx = cubeVertice.clone();
            let globalVertx = localVertx.applyMatrix4(cube.matrix);
            let dirVector = globalVertx.sub(cube.position);

            let ray = new THREE.Raycaster(originPoint, dirVector.clone().normalize());
            let colRes = ray.intersectObjects(colMeshList);

            if(colRes.length <= 0)
                falling = true;
            else 
                falling = false;
            
            // if(colRes.length < 0 && colRes[0].distance <= 0.3)
            //     falling = true;
            // else 
            //     falling = false;
        
        })

        if(keys.r && keys.l && keys.u) {
            if(cube.position.y < 0)
                cube.position.y = 0.5;
            else
                cube.position.y -= (aspect / 10) *1.2;
        }
        else{
            // if(keys.r) cube.position.x += aspect / 10;
            // if(keys.l) cube.position.x -= aspect / 10;
            // if(keys.u) cube.position.y += aspect / 10;
            // if(keys.d) cube.position.y -= aspect / 10;
            if(keys.r && cube.position.x < camBox.r - 0.5)
                cube.position.x += aspect / 10;
            if(keys.l && cube.position.x > camBox.l + 0.5){
                cube.position.x -= aspect / 10;
            }
            if(keys.u && !maxJump){
                cube.position.y += aspect / 10;
                if(cube.position.y > 2){
                    keys.u = false;
                    maxJump = true;
                }
            }
            if(!keys.u){
                if(!falling){
                    cube.position.y = -0.5;
                    maxJump = false;
                    cube.rotation.z = 0;
                }
                else
                    cube.position.y -= (aspect / 10) *1.2;
            }
            // if(falling){
            //     if (lookingRight)
            //         cube.rotation.z -= 10.0;
            //     else 
            //         cube.rotation.z += 10.0;
            // }
        }

        // if (falling) {
        //     cube.position.y -= (aspect / 10) *1.2;
        // }
    }
    let falling = false;
    sceneanimate();
}
