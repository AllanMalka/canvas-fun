
    // let camera = new THREE.PerspectiveCamera( 90, innerWidth / innerHeight, 0.1, 1000);

            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;
            //Test movement
            // if(keys.r) cube.position.x += aspect / 10;
            // if(keys.l) cube.position.x -= aspect / 10;
            // if(keys.u) cube.position.y += aspect / 10;
            // if(keys.d) cube.position.y -= aspect / 10;
            // if(colRes.length < 0 && colRes[0].distance <= 0.3)
            //     falling = true;
            // else 
            //     falling = false;
        // if (falling) {
        //     cube.position.y -= (aspect / 10) *1.2;
        // }

const sceneInit = () => {
    const frustumSize = 15;
    const aspect = innerWidth / innerHeight;
    let scene = new THREE.Scene();
    const camBox = {l:frustumSize * aspect / - 2, r:frustumSize * aspect / 2, t:frustumSize / 2, b:frustumSize / - 2}
    let camera = new THREE.OrthographicCamera( camBox.l,camBox.r,camBox.t,camBox.b, 1, 1000 );

    let keys = {
        l: false,
        r: false,
        u: false,
        d: false
    };

    const c = $('#csCanvas3d')[0];
    let renderer = new THREE.WebGLRenderer({canvas:c, alpha: true});
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

    createCube = (meshMaterial) => {
        let geometry = new THREE.CubeGeometry(1,1,1,1,1,1);
        let material = new THREE.MeshBasicMaterial(meshMaterial);
        let mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(-9.5,-.5,0.1)
        return mesh;
    }
    createLine = (vectors, lineBasicMaterial, name = '') => {
        let geometry = new THREE.Geometry();
        for(let i = 0; i < vectors.length; i++ ){
            geometry.vertices.push(vectors[i]);
        }
        let material = new THREE.LineBasicMaterial( lineBasicMaterial );
        let mesh = new THREE.Line( geometry, material );
        mesh.name = name;
        return mesh;
    }

    var texture = new THREE.TextureLoader().load( 'img/sprite/crate.gif' );

    let skelet = createCube({ transparent: true, opacity: 0.0 } );
    let skin = createCube({map:texture });

    let leftPlatform = createLine([new THREE.Vector3( -1, -1, 0),new THREE.Vector3( -12, -5, 0),new THREE.Vector3( -12, -1, 0),new THREE.Vector3( -1, -1, 0)], { color: 0xfff000 }, 'start');
    let rightPlatform = createLine([new THREE.Vector3( 2, -1, 0),new THREE.Vector3( 12, -5, 0),new THREE.Vector3( 12, -1, 0),new THREE.Vector3( 2, -1, 0)], { color: 0xfff000 }, 'end');
    let deathLine = createLine([new THREE.Vector3(-3,-5,0), new THREE.Vector3(3,-5,0)], { color: 0xff0000 }, 'die');
    
    colMeshList.push(leftPlatform);
    colMeshList.push(rightPlatform);
    colMeshList.push(deathLine);

    scene.add(skelet);
    scene.add(skin);
    scene.add(leftPlatform);
    scene.add(rightPlatform);
    scene.add(deathLine);

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
        
        if(!died){
            if(e.keyCode == 39){
                keys.r = true;
                    skin.scale.x = Math.abs(skin.scale.x);
                    lookingRight = true;
            }
            if(e.keyCode == 37) {
                keys.l = true;
                    skin.scale.x = -Math.abs(skin.scale.x);
                    lookingRight = false;
            }
            if(e.keyCode == 38 && !maxJump) {
                keys.u = true;
                    sound.play();
            }
            if(e.keyCode == 40) 
                keys.d = true;
        }else {
            if(e.keyCode == 32) {
                
            }
        }
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
        if(!died){
            leftPlatform.material.color = new THREE.Color(0xfff000);
            rightPlatform.material.color = new THREE.Color(0xfff000);
            if(!died)
                controlPlayer();
            renderer.render(scene, camera);
        } else
            diePlayer();
    }
    let died = false;
    controlPlayer = () => {

        let originPoint = skelet.position.clone();

        skelet.geometry.vertices.map(cubeVertice => {
            let localVertx = cubeVertice.clone();
            let globalVertx = localVertx.applyMatrix4(skelet.matrix);
            let dirVector = globalVertx.sub(skelet.position);

            let ray = new THREE.Raycaster(originPoint, dirVector.clone().normalize());
            let colRes = ray.intersectObjects(colMeshList);

            if(colRes.length <= 0){
                falling = true;
            }
            else {
                let colName = colRes[0].object.name;
                if(colName === 'die') {
                    died = true;
                } else {
                    if(colName === 'start' || colName === 'end' ){
                        colRes[0].object.material.color = new THREE.Color("deeppink");
                    }
                    falling = false;
                }
            }
        
        })

        if(keys.r && keys.l && keys.u) {
            if(skelet.position.y < 0)
                skelet.position.y = 0.5;
            else
                skelet.position.y -= (aspect / 10) *1.2;
        }
        else{
            if(keys.r && skelet.position.x < camBox.r - 0.5)
                skelet.position.x += aspect / 10;
            if(keys.l && skelet.position.x > camBox.l + 0.5){
                skelet.position.x -= aspect / 10;
            }
            if(keys.u && !maxJump){
                skelet.position.y += aspect / 10;
                if(skelet.position.y > 2){
                    keys.u = false;
                    maxJump = true;
                }
            }
            if(!keys.u){
                if(!falling){
                    skelet.position.y = -0.5;
                    maxJump = false;
                    skin.rotation.z = 0;
                }
                else
                    skelet.position.y -= (aspect / 10) *1.2;
            }
            skin.position.x = skelet.position.x;
            skin.position.y = skelet.position.y;
            if(falling){
                if (lookingRight)
                    skin.rotation.z -= 15.0;
                else 
                    skin.rotation.z += 15.0;
            }
        }

    }
    diePlayer = () => {
        showsome('Ye dieded BOI!');
    }
    let falling = false;
    sceneanimate();
}
