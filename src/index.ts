import Renderer from "./classes/Renderer";
import Atom from "./classes/Atom";
import {AtomI, coords, MoleculeT, ParticleT} from "./types";
import ParticleI from "./ParticleI";
import Molecule from "./classes/Molecule";
import controlPanel from "./controlPanel";
import atomsList from "./atomsList";

let canvas = document.getElementById('space') as HTMLCanvasElement;
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

let renderer = new Renderer(ctx, w, h, '#0f1c3d');

let particles: (Atom | Molecule)[] = [
    // new Atom({
    //     name: 'H',
    //     color: 'white',
    //     mass: 1,
    //     Z: 1,
    //     charge: 0,
    //     coords: {x: 600, y: 900}
    // }),
    // new Atom({
    //     name: 'H',
    //     color: 'white',
    //     mass: 1,
    //     charge: 0,
    //     Z: 1,
    //     coords: {x: 600, y: 800}
    // }),
    // new Atom({
    //     name: 'H',
    //     color: 'white',
    //     mass: 1,
    //     charge: 0,
    //     Z: 1,
    //     coords: {x: 0, y: 0}
    // }),
    // new Atom({
    //     name: 'Li',
    //     color: 'gray',
    //     mass: 9,
    //     charge: 0,
    //     Z: 3,
    //     coords: {x: 100, y: 200}
    // }),
    // new Atom({
    //     name: 'O',
    //     color: 'red',
    //     mass: 16,
    //     charge: 0,
    //     Z: 8,
    //     coords: {x: 700, y: 100}
    // }),
];

let selectedParticle: any = null;

controlPanel(document.getElementById('panel'), (id) => {
    selectedParticle = atomsList[id];
});

canvas.addEventListener('click', function (e) {
    if (selectedParticle)
        particles.push(new Atom({
            ...selectedParticle,
            coords: {
                x: e.pageX,
                y: e.pageY
            }
        }))
});

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

    if (
        distance < 50 &&
        particleA instanceof Atom &&
        particleB instanceof Atom &&
        particleA.getCountOfMissE() != 0 &&
        particleB.getCountOfMissE() != 0
    ) {
        return {molecule: new Molecule([particleA, particleB])};
    }

    // by electrons
    let gravity = Math.abs(particleA.getCountOfMissE() - particleB.getCountOfLastE());

    if (Math.abs(particleB.getCountOfMissE() - particleA.getCountOfLastE()) < gravity)
        gravity = Math.abs(particleB.getCountOfMissE() - particleA.getCountOfLastE());

    let moveX = distX / distance * 2 / (gravity + 1);
    let moveY = distY / distance * 2 / (gravity + 1);

    particleA.setCoords({
        x: particleA.getCoords().x - moveX,
        y: particleA.getCoords().y - moveY,
    });

    particleB.setCoords({
        x: particleB.getCoords().x + moveX,
        y: particleB.getCoords().y + moveY,
    });


    // molecule + atom
    // if (distance < 50 &&
    //
    //     particleA instanceof Molecule && particleB instanceof Atom)
    //     console.log(particleA, particleA.getCountOfMissE(), particleB.getCountOfLastE());

    if (
        distance < 50 &&
        (
            particleA instanceof Molecule && particleB instanceof Molecule
        )) console.log( particleA.getCountOfMissE(), particleB.getCountOfMissE())

    // molecule + molecule
    if (
        distance < 50 &&
        (
            particleA instanceof Molecule && particleB instanceof Molecule
            &&
            particleB.getCountOfMissE() != 0
            &&
            particleA.getCountOfMissE() - particleB.getCountOfMissE() >= 0
        )) {

        return {molecule: new Molecule([...(particleA as Molecule).atoms, ... (particleB  as Molecule).atoms])};
    }


    if (
        distance < 50 &&
        (
            particleA instanceof Molecule && particleB instanceof Atom
            &&
            particleA.getCountOfMissE() - particleB.getCountOfMissE() >= 0
        )) {

        particleA.addAtom(particleB);

        return {molecule: particleA};
    }

    return {
        A: particleA,
        B: particleB,
    };

    // ions
    // if (distance > 500 && particleA instanceof Atom && particleB instanceof Atom) {
    //     let moveX = distX / distance;
    //     let moveY = distY / distance;
    //
    //     // attracted
    //     if (particleA.charge + particleB.charge === 0 && particleA.charge !== 0 && particleB.charge !== 0) {
    //         particleA.setCoords({
    //             x: particleA.getCoords().x - moveX,
    //             y: particleA.getCoords().y - moveY
    //         });
    //
    //         particleB.setCoords({
    //             x: particleB.getCoords().x + moveX,
    //             y: particleB.getCoords().y + moveY
    //         });
    //     }
    //
    //     // repel
    //     // if (atomA.charge === particleB.charge && atomA.charge !== 0) {
    //     //     atomA.coords.x += moveX;
    //     //     atomA.coords.y += moveY;
    //     //     particleB.coords.x += -moveX;
    //     //     particleB.coords.y += -moveY;
    //     // }
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

function drawAtom(ctx: CanvasRenderingContext2D, atom: Atom) {
    ctx.beginPath();
    ctx.fillStyle = atom.color;
    ctx.arc(atom.getCoords().x, atom.getCoords().y, 40, 0, 360);
    ctx.fill();

    // draw atom info
    ctx.font = '40px Arial';
    ctx.fillStyle = 'blue';
    ctx.textAlign = "center";
    ctx.fillText(atom.name, atom.getCoords().x, atom.getCoords().y);
    ctx.font = '25px Arial';
    ctx.fillText(atom.Z.toString(), atom.getCoords().x, atom.getCoords().y + 30);
}

function drawMolecule(ctx: CanvasRenderingContext2D, molecule: Molecule) {
    for (let atom of molecule.atoms) {
        drawAtom(ctx, atom);
    }
}

renderer.render((ctx) => {
    for (let i = 0; i < particles.length; i++) {
        let particleA: any = particles[i];
        if (!particleA) continue;

        for (let j = 0; j < particles.length; j++) {
            if (i == j) continue; // this is current atom

            let particleB: any = particles[j];
            if (!particleB) continue;
            if (!particleA) continue;

            let interaction = particlesInteraction(particleA, particleB);

            if (!interaction) continue;

            if ('molecule' in interaction) {
                particles[j] = null;
                particles[i] = null;
                particleA = null;
                particles.push(interaction.molecule);
                // console.log(interaction.molecule, particles, interaction.molecule.getCountOfMissE())

                continue;
            }

            particleA = interaction.A;
            particleB = interaction.B;

            // save second particle updates
            particles[j] = particleB;
        }

        if (particleA != null) {
            if (particleA instanceof Atom) {
                particleA.setCoords({
                    x: particleA.getCoords().x + offset(-5, 5),
                    y: particleA.getCoords().y + offset(-5, 5),
                });

                drawAtom(ctx, particleA);
            } else if (particleA instanceof Molecule) {
                particleA.setCoords({
                    x: particleA.getCoords().x + offset(-5, 5),
                    y: particleA.getCoords().y + offset(-5, 5),
                });
                drawMolecule(ctx, particleA);
            }

            // save atom updates
            particles[i] = particleA;
        }
    }
});
