import Renderer from "./classes/Renderer";
import Atom from "./classes/Atom";
import {AtomI, coords, MoleculeT, ParticleT} from "./types";
import ParticleI from "./ParticleI";
import Molecule from "./classes/Molecule";

let canvas = document.getElementById('space') as HTMLCanvasElement;
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

let renderer = new Renderer(ctx, w, h, '#0f1c3d');

let particles: (Atom | Molecule)[] = [
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
    new Atom({
        name: 'O',
        color: 'red',
        mass: 16,
        charge: 0,
        Z: 8,
        coords: {x: 100, y: 400}
    }),
    new Atom({
        name: 'O',
        color: 'red',
        mass: 16,
        charge: 0,
        Z: 8,
        coords: {x: 500, y: 600}
    }),
    new Atom({
        name: 'C',
        color: 'black',
        mass: 12,
        charge: 0,
        Z: 6,
        coords: {x: 200, y: 700}
    })
];


function offset(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function getDistance(coordsA: coords, coordsB: coords) {
    return Math.sqrt((coordsA.x - coordsB.x) ** 2 + (coordsA.y - coordsB.y) ** 2);
}

function particlesInteraction(particleA: ParticleI, particleB: ParticleI): { A: ParticleI, B: ParticleI } | { molecule: Molecule } {
    let coordsA = particleA.getCoords();
    let coordsB = particleB.getCoords();

    let distance = getDistance(coordsA, coordsB);
    let distX = coordsA.x - coordsB.x;
    let distY = coordsA.y - coordsB.y;

    // by electrons
    let gravity = Math.abs(particleA.getCountOfMissE() - particleB.getCountOfLastE());

    if (Math.abs(particleB.getCountOfMissE() - particleA.getCountOfLastE()) < gravity)
        gravity = Math.abs(particleB.getCountOfMissE() - particleA.getCountOfLastE());

    let moveX = distX / distance / (gravity + 1);
    let moveY = distY / distance / (gravity + 1);

    particleA.setCoords({
        x: particleA.getCoords().x - moveX,
        y: particleA.getCoords().y - moveY,
    });

    particleB.setCoords({
        x: particleB.getCoords().x + moveX,
        y: particleB.getCoords().y + moveY,
    });

    return {
        A: particleA,
        B: particleB,
    };

    // atomA.coords.x += -moveX;
    // atomA.coords.y += -moveY;
    // atomB.coords.x += moveX;
    // atomB.coords.y += moveY;
    //
    // if (distance < 50) {
    //     // atomA.taken = true;
    //     // atomB.taken = true;
    //
    //     return [atomA, atomB];
    // }

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

function objectToParticle(particle: any): Atom | Molecule | false {
    if (!(particle instanceof Array) && !(particle instanceof Atom)) return new Atom(particle);
    else if (particle instanceof Array && !(particle instanceof Molecule)) return new Molecule(particle);
    else return false;
}

renderer.render((ctx) => {
    console.log(particles);
    for (let i = 0; i < particles.length; i++) {
        ctx.beginPath();

        // ===== molecule ===== //
        // if (particles[i] instanceof Array) {
        //     let moleculeA = particles[i] as MoleculeT;
        //     // console.log(moleculeA)
        //
        //     for (let j = 0; j < particles.length; j++) {
        //         if (i == j) continue; // this is current molecule
        //
        //         if (particles[j] instanceof Array) continue;
        //         let atomB = particles[j] as AtomI;
        //         if (atomB == null) continue;
        //
        //         // let molecule = atomsInteraction(atomA, atomB);
        //
        //         // save atom updates
        //         particles[j] = atomB;
        //     }
        //
        //     for (let atom of moleculeA){
        //         ctx.beginPath();
        //         ctx.fillStyle = atom.color;
        //         ctx.arc(atom.coords.x, atom.coords.y, 50, 0, 360);
        //         ctx.fill();
        //
        //         ctx.font = '50px Arial';
        //         ctx.fillStyle = 'green';
        //         ctx.textAlign = "center";
        //         ctx.fillText(atom.name, atom.coords.x, atom.coords.y);
        //         ctx.font = '30px Arial';
        //         ctx.fillText(atom.charge.toString(), atom.coords.x, atom.coords.y + 30);
        //     }
        //
        //     continue;
        // };

        // ===== atom ===== //
        let particleA: any = particles[i];
        if (!particleA) continue;

        for (let j = 0; j < particles.length; j++) {
            if (i == j) continue; // this is current atom

            let particleB: any = particles[j];
            if (!particleB) continue;

            let interaction = particlesInteraction(particleA, particleB);

            if(!interaction) continue;

            if ('molecule' in interaction) {
                particles[j] = null;
                particles.push(interaction.molecule);
                continue;
            }

            particleA = interaction.A;
            particleB = interaction.B;

            // save atom updates
            particles[j] = particleB;


        }



        // if (!atomA.taken) {
        //     atomA.coords.x += offset(-5, 5);
        //     atomA.coords.y += offset(-5, 5);
        // }

        ctx.fillStyle = particleA.color;
        ctx.arc(particleA.coords.x, particleA.coords.y, 50, 0, 360);
        ctx.fill();

        // draw atom info
        ctx.font = '50px Arial';
        ctx.fillStyle = 'blue';
        ctx.textAlign = "center";
        ctx.fillText(particleA.name, particleA.coords.x, particleA.coords.y);
        ctx.font = '30px Arial';
        ctx.fillText(particleA.charge.toString(), particleA.coords.x, particleA.coords.y + 30);

        // save atom updates
        particles[i] = particleA;
    }
});
