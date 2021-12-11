import Renderer from "./classes/Renderer";
import Atom from "./classes/Atom";

type coords = { x: number, y: number };

interface AtomI {
    name: string,
    color: string,
    mass: number,
    Z: number,
    charge: number,
    coords: coords,
    taken: boolean
}

type MoleculeT = AtomI[];

let canvas = document.getElementById('space') as HTMLCanvasElement;
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

let renderer = new Renderer(ctx, w, h, '#0f1c3d');

let particles: (AtomI | MoleculeT)[] = [
    // {
    //     name: 'H',
    //     color: 'white',
    //     mass: 1,
    //     Z: 1,
    //     charge: 0,
    //     coords: {x: 800, y: 400},
    //     taken: false
    // },
    // {
    //     name: 'H',
    //     color: 'white',
    //     mass: 1,
    //     Z: 1,
    //     charge: 0,
    //     coords: {x: 600, y: 400},
    //     taken: false
    // },
    // {
    //     name: 'H',
    //     color: 'white',
    //     mass: 1,
    //     charge: 0,
    //     Z: 1,
    //     coords: {x: 400, y: 700},
    //     taken: false
    // },
    // {
    //     name: 'Li',
    //     color: 'gray',
    //     mass: 7,
    //     charge: 0,
    //     Z: 3,
    //     coords: {x: 500, y: 400},
    //     taken: false
    // },
    {
        name: 'O',
        color: 'red',
        mass: 16,
        charge: 0,
        Z: 8,
        coords: {x: 100, y: 400},
        taken: false
    },
    {
        name: 'O',
        color: 'red',
        mass: 16,
        charge: 0,
        Z: 8,
        coords: {x: 500, y: 600},
        taken: false
    },
    {
        name: 'C',
        color: 'black',
        mass: 12,
        charge: 0,
        Z: 6,
        coords: {x: 200, y: 700},
        taken: false
    }
];


function offset(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function getDistance(coordsA: coords, coordsB: coords) {
    return Math.sqrt((coordsA.x - coordsB.x) ** 2 + (coordsA.y - coordsB.y) ** 2);
}

function getCountOfMissElectrons(atom: { Z: number }): number {
    let e = atom.Z;

    if (e <= 2) return 2 - e;
    if (e <= 10) return 10 - e;
    return 0;
}

function getCountOfLastElectrons(atom: { Z: number }): number {
    let e = atom.Z;

    if (e <= 2) return e;
    if (e <= 10) return e - 2;
    return 0;
}

function atomsInteraction(atomA: AtomI, atomB: AtomI): false | MoleculeT {
    let distance = getDistance(atomA.coords, atomB.coords);
    let distX = atomA.coords.x - atomB.coords.x;
    let distY = atomA.coords.y - atomB.coords.y;

    // by electrons
    let gravity = Math.abs(getCountOfMissElectrons(atomA) - getCountOfLastElectrons(atomB));

    if (Math.abs(getCountOfMissElectrons(atomB) - getCountOfLastElectrons(atomA)) < gravity)
        gravity = Math.abs(getCountOfMissElectrons(atomB) - getCountOfLastElectrons(atomA));

    let moveX = distX / distance / (gravity + 1);
    let moveY = distY / distance / (gravity + 1);

    atomA.coords.x += -moveX;
    atomA.coords.y += -moveY;
    atomB.coords.x += moveX;
    atomB.coords.y += moveY;

    if (distance < 50) {
        // atomA.taken = true;
        // atomB.taken = true;

        return [atomA, atomB];
    }

    return false

    // ions
    // if (distance > 50) {
    //     let moveX = distX / distance;
    //     let moveY = distY / distance;
    //
    //     // attracted
    //     if (atomA.charge + atomB.charge === 0 && atomA.charge !== 0 && atomB.charge !== 0) {
    //         atomA.coords.x += -moveX;
    //         atomA.coords.y += -moveY;
    //         atomB.coords.x += moveX;
    //         atomB.coords.y += moveY;
    //     }
    //
    //     // repel
    //     if (atomA.charge === atomB.charge && atomA.charge !== 0) {
    //         atomA.coords.x += moveX;
    //         atomA.coords.y += moveY;
    //         atomB.coords.x += -moveX;
    //         atomB.coords.y += -moveY;
    //     }
    // } else {
    //     // atomA.charge = 0;
    //     // atomB.charge = 0;
    // }

}

renderer.render((ctx) => {
    console.log(particles);
    for (let i = 0; i < particles.length; i++) {
        ctx.beginPath();

        // ===== molecule ===== //
        if (particles[i] instanceof Array) {
            let moleculeA = particles[i] as MoleculeT;
            // console.log(moleculeA)

            for (let j = 0; j < particles.length; j++) {
                if (i == j) continue; // this is current molecule

                if (particles[j] instanceof Array) continue;
                let atomB = particles[j] as AtomI;
                if (atomB == null) continue;

                // let molecule = atomsInteraction(atomA, atomB);

                // save atom updates
                particles[j] = atomB;
            }

            for (let atom of moleculeA){
                ctx.beginPath();
                ctx.fillStyle = atom.color;
                ctx.arc(atom.coords.x, atom.coords.y, 50, 0, 360);
                ctx.fill();

                ctx.font = '50px Arial';
                ctx.fillStyle = 'green';
                ctx.textAlign = "center";
                ctx.fillText(atom.name, atom.coords.x, atom.coords.y);
                ctx.font = '30px Arial';
                ctx.fillText(atom.charge.toString(), atom.coords.x, atom.coords.y + 30);
            }

            continue;
        };

        // ===== atom ===== //
        let atomA = particles[i] as AtomI;
        if (atomA == null) continue;

        for (let j = 0; j < particles.length; j++) {
            if (i == j) continue; // this is current atom
            if (particles[j] instanceof Array) continue;

            let atomB = particles[j] as AtomI;
            if (atomB == null) continue;

            let molecule = atomsInteraction(atomA, atomB);

            // save atom updates
            particles[j] = atomB;

            if (molecule) {
                particles[j] = null;
                particles.push(molecule);
            }
        }

        // if (!atomA.taken) {
            atomA.coords.x += offset(-5, 5);
            atomA.coords.y += offset(-5, 5);
        // }

        ctx.fillStyle = atomA.color;
        ctx.arc(atomA.coords.x, atomA.coords.y, 50, 0, 360);
        ctx.fill();

        // draw atom info
        ctx.font = '50px Arial';
        ctx.fillStyle = 'blue';
        ctx.textAlign = "center";
        ctx.fillText(atomA.name, atomA.coords.x, atomA.coords.y);
        ctx.font = '30px Arial';
        ctx.fillText(atomA.charge.toString(), atomA.coords.x, atomA.coords.y + 30);

        // save atom updates
        particles[i] = atomA;
    }
});
