let running = false;
$(document).ready(function () {

    let textMarginTop = 30;
    let maxCircles = 0;
    let maxCircleRadius = 30;
    let mouseholded = false;
    let circlesArray = [];
    let txtrect = '';
    let linkrect = {
        x: 325,
        y: textMarginTop,
        h: textMarginTop,
        w: 0
    };
    let cHeight = innerHeight;
    let cWidth = innerWidth;
    let atLink = false;
    let mouse = {
        x: undefined,
        y: undefined
    };
    const c = $('#csCircles')[0];
    const ctx = c.getContext('2d');
    
    c.width = cWidth;
    c.height = cHeight;
    ctx.font = "30px Arial";

    init();
    animate();

    c.addEventListener('mousemove', function (e) {
        mouse.x = e.x;
        mouse.y = e.y;

        if (e.x >= linkrect.x && e.x <= (linkrect.x + linkrect.w) && e.y <= linkrect.y && e.y >= (linkrect.y - linkrect.h)) {
            $('body').css('cursor', 'pointer');
            atLink = true;
        } else {
            atLink = false;
            $('body').css('cursor', '');
        }

    });
    c.addEventListener('mouseout', function () {
        mouse.x = undefined;
        mouse.y = undefined;
        clearInterval(mouseholded);
    });
    c.addEventListener('mousedown', function (e) {
        if (!atLink) {
            mouseholded = setInterval(function () {
                if (circlesArray.length < 2000 && running) {
                    let minCircleRadius = MathRandom(1, 15);
                    let velocityy = (Math.random() - 0.5) * 5;
                    let velocityx = (Math.random() - 0.5) * 5;
                    circlesArray.push(new Circle(mouse.x, mouse.y, velocityx, velocityy, minCircleRadius, false));
                }
            }, 0.1);
        } else {
            running = false;
            atLink = false;
            clearInterval(mouseholded);
            mouse.x = undefined;
            mouse.y = undefined;
            ctx.clearRect(0, 0, cWidth, cHeight);
            circlesArray = [];
            $('#csCircles').toggle();
            $('#main').toggle();
            $('body').css('overflow-y', 'auto');
        }
    });
    c.addEventListener('mouseup', function (e) {
        clearInterval(mouseholded);
    });
    window.addEventListener('resize', function () {
        c.width = cWidth;
        c.height = cHeight;
        init();
    });
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 32) {
            running = !running;
            ctx.clearRect(200, 0, txtrect.width, 40);
            MsgRunPause();
        }
    })

    function init() {
        let createdCircles = circlesArray.length;
        circlesArray = [];
        for (let i = 0; i < createdCircles; i++) {
            let minCircleRadius = MathRandom(1, 15);
            let velocityy = (Math.random() - 0.5) * 5;
            let velocityx = (Math.random() - 0.5) * 5;
            let animateX = Math.floor(Math.random() * (cWidth - minCircleRadius * 2) + minCircleRadius);
            let animateY = Math.floor(Math.random() * (cHeight - minCircleRadius * 2) + minCircleRadius);
            circlesArray.push(new Circle(animateX, animateY, velocityx, velocityy, minCircleRadius, false));
        }
    }

    function Circle(x, y, dx, dy, radius, as) {
        let animateX = x;
        let animateY = y;
        let velX = dx;
        let velY = dy;
        let circleSize = radius;
        let minradius = radius;
        let addStroke = as;
        let primcolor = '',
            seccol = '';
        let lineWidth = MathRandom(0, 4);
        let vacinity = circleSize;
        let newlycreated = true;
        setTimeout(function () {
            newlycreated = false;
        }, 2000);

        let rgb = {
            r: MathRandom(0, 255),
            g: MathRandom(0, 255),
            b: MathRandom(0, 255)
        };
        primcolor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;



        if (addStroke) {
            let hsv = RGB2HSV(rgb);
            hsv.hue = HueShift(hsv.hue, 180.0);
            secrgb = HSV2RGB(hsv);
            seccol = `rgb(${secrgb.r}, ${secrgb.g}, ${secrgb.b})`;
        }

        this.draw = function () {
            ctx.beginPath();
            ctx.shadowBlur = 6;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.shadowColor = "black";
            ctx.arc(animateX, animateY, circleSize, 0, Math.PI * 2);
            ctx.fillStyle = primcolor;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowColor = "black";

            if (addStroke && lineWidth > 0) {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = seccol;
                ctx.stroke();
            }
        }

        this.update = function () {
            if (animateX + circleSize > cWidth || animateX - circleSize < 0)
                velX = -velX;
            if (animateY + circleSize > cHeight || animateY - circleSize < 0)
                velY = -velY;

            animateX += velX;
            animateY += velY;

            // Interactivity
            if (!newlycreated) {
                if (mouse.x - animateX < vacinity && mouse.x - animateX > -vacinity && mouse.y - animateY < vacinity && mouse.y - animateY > -vacinity) {
                    if (circleSize < (maxCircleRadius * 2))
                        circleSize += 5;
                } else if (circleSize > minradius)
                    circleSize -= 1;
            }
            this.draw();
        }
    }

    function MsgRunPause() {
        ctx.fillStyle = 'black';
        let txt = 'Running';
        if (!running) {
            txt = 'Paused';
        }
        txtrect = ctx.measureText(txt);
        ctx.fillText(txt, 200, textMarginTop);
    }

    function MathRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);

    }

    function animate() {
        requestAnimationFrame(animate);
        if (running) {
            ctx.clearRect(0, 0, cWidth, cHeight);
            $.each(circlesArray, function (k, v) {
                v.update();
            });

        } 
            ctx.fillStyle = 'black';
            ctx.fillText(`Bubbles: ${circlesArray.length}`, 10, textMarginTop);
            if (atLink) {
                ctx.fillStyle = 'blue';
            }
            ctx.fillText('Home', 325, textMarginTop)
            linkrect.w = ctx.measureText('Home').width;
            MsgRunPause();
    }
});