let running = true;
$(document).ready(function () {
    let textMarginTop = 30;
    let maxCircleRadius = 30;
    let mouseholded = false;
    let circlesArray = [];
    let txtrect = '';
    let linkrect = {
        x: 335,
        y: textMarginTop,
        h: textMarginTop,
        w: 0
    };
    let clearrect = {
        x: 435,
        y: textMarginTop,
        h: textMarginTop,
        w: 0
    };
    let menuRect = {
        x: 0,
        y: 0,
        h: 80,
        w: 525
    }
    let maxAmountOfCircles = 2000;

    let txtPrimCol = "rgba(0,0,0,1)";
    let txtHoverCol = "rgba(0,0,255,1)";
    let txtShadowCol = "rgba(153, 153, 153,0.3)";
    let txtWinCol = "rgba(184,134,11,1)";

    let atLink = false;
    let atClear = false;
    let mouse = {
        x: undefined,
        y: undefined
    };
    let amountstrokes = 0;
    const c = $('#csCircles')[0];
    const ctx = c.getContext('2d');

    c.width = innerWidth;
    c.height = innerHeight;
    ctx.font = "30px Arial";

    animate();

    c.addEventListener('mousemove', function (e) {
        mouse.x = e.x;
        mouse.y = e.y;

        if (e.x >= linkrect.x && e.x <= (linkrect.x + linkrect.w) && e.y <= linkrect.y && e.y >= (linkrect.y - linkrect.h)) {
            $('body').css('cursor', 'pointer');
            atLink = true;
        } else if (e.x >= clearrect.x && e.x <= (clearrect.x + clearrect.w) && e.y <= clearrect.y && e.y >= (clearrect.y - clearrect.h)) {
            $('body').css('cursor', 'pointer');
            atClear = true;
        } else {
            atLink = false;
            atClear = false;
            $('body').css('cursor', '');
        }

    });
    c.addEventListener('mouseout', function () {
        mouse.x = undefined;
        mouse.y = undefined;
        clearInterval(mouseholded);
    });
    let addTen = false;
    let addHundred = false;
    c.addEventListener('mousedown', function (e) {
        if (e.button === 0) {
            if (atLink) {
                running = false;
                atLink = false;
                clearInterval(mouseholded);
                mouse.x = undefined;
                mouse.y = undefined;
                amountstrokes = 0;
                ctx.clearRect(0, 0, innerWidth, innerHeight);
                circlesArray = [];
                addTen = false;
                addHundred = false;
                // RefreshCanvasCircle();
                $('#csCircles').toggle();
                $('#main').toggle();
                $('body').css('overflow-y', 'auto');
            } else if (atClear) {
                circlesArray = [];
                amountstrokes = 0;
            } else {
                mouseholded = setInterval(function () {
                    const caLength = circlesArray.length;
                    let amountadding = !addHundred && !addTen ? 1 : 0;
                    amountadding += addTen ? 10 : 0;
                    amountadding += addHundred ? 100 : 0;
                    if (maxAmountOfCircles > 0)
                        amountadding = caLength + amountadding > maxAmountOfCircles ? Math.abs(maxAmountOfCircles - caLength) : amountadding;

                    for (let i = 0; i < amountadding; i++) {
                        let minCircleRadius = MathRandom(1, 15);
                        let velocityy = (Math.random() - 0.5) * 5;
                        let velocityx = (Math.random() - 0.5) * 5;
                        let addstroke = MathRandom(1, 10) == 10;
                        amountstrokes = addstroke ? amountstrokes + 1 : amountstrokes;
                        circlesArray.push(new Circle(mouse.x, mouse.y, velocityx, velocityy, minCircleRadius, addstroke));
                    }
                }, 1);
            }
        }
    });
    c.addEventListener('mouseup', function (e) {
        clearInterval(mouseholded);
    });
    window.addEventListener('resize', function () {
        c.width = innerWidth;
        c.height = innerHeight;
        ctx.font = "30px Arial";
        init();
    });
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 32) {
            running = !running;
            ctx.clearRect(210, 0, txtrect.width, 40);
            MsgRunPause();
        } else {
            if (e.keyCode === 16 && running) {
                addHundred = true;
            }
            if (e.keyCode === 17 && running) {
                addTen = true;
            }
        }
    });
    window.addEventListener('keyup', function (e) {
        if (e.keyCode === 16) {
            addTen = false;
        } else if (e.keyCode === 17) {
            addHundred = false;
        }
    });

    function init() {
        circlesArray.map(circle => {
            let circsize = circle.getSize();
            let animateX = Math.floor(Math.random() * (innerWidth - circsize * 2) + circsize);
            let animateY = Math.floor(Math.random() * (innerHeight - circsize * 2) + circsize);
            circle.move(animateY, animateX);
        });
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
        this.getSize = function () {
            return circleSize;
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
        this.move = function (y, x) {
            if (animateX > innerWidth) {
                animateX = x;
                velX = -velX;
            }
            if (animateY > innerHeight) {
                animateY = y;
                velY = -velY;
            }
        }

        this.update = function () {
            if (animateX + circleSize > innerWidth || animateX - circleSize < 0)
                velX = -velX;
            if (animateY + circleSize > innerHeight || animateY - circleSize < 0)
                velY = -velY;


            if(animateY - circleSize < menuRect.h && animateX - circleSize < menuRect.w) {
                velX = -velX;
                velY = -velY;
            }

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
        let txt = running ? 'Running' : 'Paused';
        txtrect = ctx.measureText(txt);
        ctx.fillText(txt, 210, textMarginTop);
    }

    function MathRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function initTxt() {
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = txtShadowCol;
        ctx.shadowBlur = 4;

        ctx.fillStyle = txtPrimCol;
        ctx.fillText(`Bubbles: ${circlesArray.length}`, 10, textMarginTop);
        if (amountstrokes > 99)
            ctx.fillStyle = txtWinCol;
        ctx.fillText(`Bubbles with strokes: ${amountstrokes}`, 10, textMarginTop * 2.2);
        ctx.fillStyle = atLink ? txtHoverCol : txtPrimCol;
        ctx.fillText('Home', linkrect.x, linkrect.y);
        linkrect.w = ctx.measureText('Home').width;
        ctx.fillStyle = atClear ? txtHoverCol : txtPrimCol;
        ctx.fillText('Clear', clearrect.x, clearrect.y)
        clearrect.w = ctx.measureText('Clear').width;
        ctx.fillStyle = txtPrimCol;
        MsgRunPause();
    }
    function drawMenu() {
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = txtShadowCol;
        ctx.shadowBlur = 0;

        ctx.lineWidth = 2;
        ctx.strokeStyle = txtPrimCol;
        ctx.strokeRect(menuRect.x, menuRect.y, menuRect.w, menuRect.h);
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!running) return;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        circlesArray.map(circle => circle.update());
        drawMenu();
        initTxt();
    }
});