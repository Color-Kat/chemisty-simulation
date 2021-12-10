import Renderer from "./classes/Renderer";

let canvas = document.getElementById('space') as HTMLCanvasElement;
let w = canvas.width;
let h = canvas.height;

let ctx = canvas.getContext('2d');

let renderer = new Renderer(ctx, w, h, '#0f1c3d');
let start = 0;
let startY = 50;
renderer.render((ctx)=>{
    ctx.fillStyle = 'black';
    ctx.fillRect(start,startY,10,10);

    if (start > 100) startY++;
    else start++;
});
