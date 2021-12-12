import {AtomI, coords} from "../types";
import Atom from "./Atom";
import ParticleI from "../ParticleI";

export default class Molecule implements ParticleI {
    private atoms: Atom[] = [];

    constructor(atoms: AtomI[]) {
        this.atoms = atoms.map(atom => new Atom(atom));
    }

    public getCoords(): coords {
        let atomsCount = 0;
        let x: number, y: number;

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

            lastLayerE += atom.getCountOfLastE();
        }

        return lastLayerE;
    }

    // не хватает - 2 (6)
    // 1 уже (1)
    //

    public getCountOfMissE(): number {
        let lastE = this.getCountOfLastE();

        if (lastE <= 2) return 2 - lastE;
        if (lastE <= 8) return 8 - lastE;
        return 0;
    }
}