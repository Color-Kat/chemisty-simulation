import {AtomI, coords} from '../types';
import ParticleI from "../ParticleI";

export default class Atom implements ParticleI {
    public name: string;
    public color: string;
    public mass: number;
    public Z: number;
    public charge: number;
    public coords: coords;

    constructor(atom: AtomI) {
        this.name = atom.name;
        this.color = atom.color;
        this.mass = atom.mass;
        this.Z = atom.Z;
        this.charge = atom.charge;
        this.coords = atom.coords;
    }

    public getCoords(): coords {
        return this.coords;
    }

    public setCoords(coords: coords) {
        this.coords = coords;
    }

    public getCountOfMissE(): number {
        let e = this.Z;
        let miss = 0;

        if(e <= (18 + 8 + 2)) {
            miss = (18 + 8 + 2) - e;
            if (miss > 9) {
                miss = 18 - miss;
            }
        }
        if (e <= 10) {
            miss = 10 - e;
            if (miss > 4) {
                miss = 8 - miss;
            }
            // console.log(this.name, miss)
        }
        if (e <= 2) miss = 2 - e;

        return Math.abs(miss);
    }

    public getCountOfLastE(): number {
        let e = this.Z;

        if (e <= 2) return e;
        if (e <= 10) return e - 2;
        if (e <= (2+8+18)) return e - (2+8);
        return 0;
    }
}