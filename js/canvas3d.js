const canvInit = () => {
    const c = $('#csCanvas3d')[0];
    c.width = innerWidth;
    c.height = innerHeight;
    const gl = c.getContext('webgl') || c.getContext("experimental-webgl");

    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    
    // gl.clearColor(0,0,0,1);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, [
        'attribute vec2 position;',
        'void main(){',
            'gl_Position = vec4(position, 0.0, 1.0);',
        '}',
    ].join('\n'));
    gl.compileShader(vertexShader);

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,[
        'precision highp float;',
        'uniform vec4 color;',
        'void main(){',
            'gl_FragColor = color;',
        '}',
    ].join('\n'));
    gl.compileShader(fragmentShader);

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let vertices = new Float32Array([
        -0.5,-0.5,
        0.5,-0.5,
        0.0,0.5
    ]);

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(program);
    program.color = gl.getUniformLocation(program, 'color');
    gl.uniform4fv(program.color, [0,1,0,1.0]);

    program.position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(program.position);
    gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0,0);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}