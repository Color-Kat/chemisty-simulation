console.log('hello chemistry');

let canvas = document.getElementById('space') as HTMLCanvasElement;
// canvas.clientWidth = 123;
let w = canvas.width;
let h = canvas.height;

let ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(0,0,w,h);