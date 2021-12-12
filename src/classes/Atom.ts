import {AtomI, coords} from '../types';
import ParticleI from "../ParticleI";

export default class Atom implements ParticleI{
   public name: string;
   public color: string;
   public mass: number;
   public Z: number;
   public charge: number;
   public coords: coords;

    constructor( atom: AtomI ) {
        this.name = atom.name;
        this.color= atom.color;
        this.mass= atom.mass;
        this.Z= atom.Z;
        this.charge= atom.charge;
        this.coords= atom.coords;
    }

    public getCoords(): coords{
        return this.coords;
    }

    public setCoords(coords: coords) {
        this.coords = coords;
    }

    public getCountOfMissE(): number {
        let e = this.Z;

        if (e <= 2) return 2 - e;
        if (e <= 10) return 10 - e;
        return 0;
    }

    public getCountOfLastE(): number {
        let e = this.Z;

        if (e <= 2) return e;
        if (e <= 10) return e - 2;
        return 0;
    }
}