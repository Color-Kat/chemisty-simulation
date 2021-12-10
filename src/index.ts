import Renderer from "./classes/Renderer";

type coords = {x: number, y: number};

let canvas = document.getElementById('space') as HTMLCanvasElement;
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

let renderer = new Renderer(ctx, w, h, '#0f1c3d');

let atoms = [
    // {
    //     color: 'white',
    //     mass : 1,
    //     Z: 1,
    //     coords: {x: 200, y: 300}
    // },
    {
        color: 'gray',
        mass : 7,
        Z: 3,
        coords: {x: 400, y: 400}
    },
    {
        color: 'red',
        mass : 16,
        Z: 8,
        coords: {x: 400, y: 700}
    },
    // {
    //     color: 'black',
    //     mass : 12,
    //     Z: 6,
    //     coords: {x: 100, y: 700}
    // },
];


function offset(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function getDistance(coordsA: coords, coordsB: coords){
    return Math.sqrt((coordsA.x-coordsB.x)**2 + (coordsA.y-coordsB.y)**2);
}

renderer.render((ctx)=>{

    for (let i = 0; i<atoms.length; i++){
    // for (let i in atoms){
    //     console.log(i)
        ctx.beginPath();

        let atomA = atoms[i];
        let atomB = atoms[i+1] ?? null;

        if(atomB) {
            console.log(atomB.coords)
            let distance = getDistance(atomA.coords, atomB.coords);
            let distX = atomA.coords.x-atomB.coords.x;
            let distY = atomA.coords.y-atomB.coords.y;

            atomA.coords.x += (distX > 0 ? distX : -distX)/distance *2;
            atomA.coords.y += (distY > 0 ? distY : -distX)/distance *2;
            atomB.coords.x += (distY > 0 ? distY : distX)/distance *2;
            atomB.coords.y += (distY > 0 ? distY : distX)/distance *2;

            atoms[i+1] = atomB;
        }
        else {
            // atomA.coords.x +=offset (-5,5);
            // atomA.coords.y +=offset (-5,5);
        }

        atoms[i] = atomA;

        ctx.fillStyle = atomA.color;
        ctx.arc(atomA.coords.x, atomA.coords.y,50, 0, 360);
        ctx.fill();
    }
});
