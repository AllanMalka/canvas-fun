const fibInit = () => {


    const c = $('#csFibonacci')[0];
    c.width = innerWidth;
    c.height = innerHeight;
    const ctx = c.getContext('2d');
    let fibrun = true;

    class fibCircle {
        constructor() {
            this.circleRect = {
                x: innerWidth / 2,
                y: innerHeight / 2,
                s: 1,
                e: Math.PI * 2
            };
            this.prevVal = 0;
            this.reverse = false;
            this.expanding = true;
        }
        draw = () => {
            ctx.beginPath();

            let rgb = {
                r: MathRandom(0, 255),
                g: MathRandom(0, 255),
                b: MathRandom(0, 255)
            };
            let primcolor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

            ctx.arc(this.circleRect.x, this.circleRect.y, this.circleRect.s, 0, this.circleRect.e)
            ctx.strokeStyle = primcolor;
            ctx.lineWidth = 5;
            ctx.stroke();
        }
        update = () => {
            if (this.circleRect.s * 2 < innerWidth) {
                let current = this.prevVal;
                this.prevVal = this.circleRect.s;
                this.circleRect.s = this.circleRect.s + current;
            } else this.expanding = false;
            this.draw();
            return this.expanding;
        }
    }

    let circ = new fibCircle();
    const fibanimate = () => {
        requestAnimationFrame(fibanimate);
        // ctx.clearRect(0, 0, innerWidth, innerHeight);
        if (fibrun)
            fibrun = circ.update();
        else {
            // circ = new fibCircle();
            // fibrun = true;
        }
    }
    fibanimate();
}