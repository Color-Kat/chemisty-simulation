import Atom from "./classes/Atom";
import Molecule from "./classes/Molecule";

export type coords = { x: number, y: number };

export interface AtomI {
    name: string,
    color: string,
    mass: number,
    Z: number,
    charge: number,
    coords: coords
}

export type MoleculeT = AtomI[];

export type ParticleT = (Atom|Molecule);