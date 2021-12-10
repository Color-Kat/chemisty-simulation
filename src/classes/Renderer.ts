export default class Renderer {
    constructor(
        private ctx: CanvasRenderingContext2D,
        private w: number,
        private h: number,
        private bg: string) {
    }

    public render(callback: (ctx: CanvasRenderingContext2D) => void) {
        this.ctx.clearRect(0,0,this.w,this.h);
        this.ctx.fillStyle = this.bg;
        this.ctx.fillRect(0, 0, this.w, this.h);
        callback(this.ctx);

        setTimeout(() => this.render(callback), 1000/60);
    }
}