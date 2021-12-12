import {coords} from "./types";
import Atom from "./classes/Atom";

export default interface ParticleI {
    getCoords: () => coords;
    getCountOfLastE: () => number;
    getCountOfMissE: () => number;
    setCoords: (coords: coords)=>void;
}