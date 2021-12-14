import {AtomI, coords} from "../types";
import Atom from "./Atom";
import ParticleI from "../ParticleI";

export default class Molecule implements ParticleI {
    // private atoms: Atom[] = [];

    constructor(public atoms: Atom[]) {
        // this.atoms = atoms.map(atom => new Atom(atom));
    }

    public getCoords(): coords {
        let atomsCount = 0;
        let x: number = 0;
        let y: number = 0;

        for (let atom of this.atoms) {
            atomsCount++;
            x += atom.getCoords().x;
            y += atom.getCoords().y;
        }

        return {
            x: x / atomsCount,
            y: y / atomsCount
        }
    }

    public setCoords(coords: coords) {
        let molecule_coords = this.getCoords();
        let molecule_offset = {
            x: coords.x - molecule_coords.x,
            y: coords.y - molecule_coords.y,
        }

        for (let atom of this.atoms) {
            atom.setCoords({
                x: atom.getCoords().x + molecule_offset.x,
                y: atom.getCoords().x + molecule_offset.y,
            });
        }
    }

    public getCountOfLastE(): number {
        let lastLayerE = 0;

        for (let i_atom of this.atoms) {
            let atom = new Atom(i_atom);

            lastLayerE -= atom.getCountOfLastE();
        }

        return Math.abs(lastLayerE);
    }

    public getCountOfMissE(): number {
        let maxMissAtom = 0;
        let missE = 0;

        // get the
        for (let i_atom of this.atoms) {
            let atom = new Atom(i_atom);
            if (atom.getCountOfMissE() > maxMissAtom) {
                maxMissAtom = atom.getCountOfMissE();
            }
        }

        missE = 2*  maxMissAtom;
        console.log('strat',missE)

        for (let i_atom of this.atoms) {
            let atom = new Atom(i_atom);

            missE -= atom.getCountOfMissE();

            console.log(missE)
        }
        console.log('-------------')

        // missE -= maxMissAtom;

        // console.log(maxMissAtom)

        return Math.abs(missE);
    }

    public addAtom(atom: Atom) {
        this.atoms.push(atom);
    }
}