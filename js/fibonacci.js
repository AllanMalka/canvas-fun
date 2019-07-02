
const fibInit = () => {
        
        
        const c = $('#csFibonacci')[0];
        c.width = innerWidth;
        c.height = innerHeight;
        const ctx = c.getContext('2d');
        
        class fibCircle  {
            constructor(){
                this.circleRect = {
                    x: innerWidth /2,
                    y: innerHeight /2,
                    s: 1,
                    e: Math.PI *2
                };
                this.prevVal = 0;
                this.reverse = false;
            }
            draw = () => {
                ctx.beginPath();

                ctx.arc(this.circleRect.x,this.circleRect.y,this.circleRect.s,0,this.circleRect.e)
                ctx.strokeStyle = 'rgb(0,0,0)';
                ctx.stroke();
            }
            update = () => {
                if(this.circleRect.s * 2 < innerWidth) {
                    this.circleRect.s = this.circleRect.s + this.prevVal;
                    this.prevVal = this.circleRect.s;
                }
                console.log(this.prevVal);
                this.draw();
            }
        }

        let circ = new fibCircle();
        const fibanimate = () => {
            requestAnimationFrame(fibanimate);
            circ.update();
        }
        fibanimate();

}