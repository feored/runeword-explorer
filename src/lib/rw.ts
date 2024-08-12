import RUNEWORDS from '$lib/data/runewords.json';

export interface RuneData {
	name: string;
	levelreq: number;
	mods: {
		weapon: string[];
		armor: string[];
		shield: string[];
	}
}

export interface Runeword {
	name: string;
	runes: string[];
	bases: string[];
	bases_d2r: string[];
	ladder: {
		d2lod: boolean;
		d2r: boolean;
	}
	levelreq: number;
	sockets: 2 | 3 | 4 | 5 | 6;
	stats: string[];
	version: "1.09" | "1.10" | "1.11" | "2.4" | "2.6"
}


export type Bases = { [key: string]: string[] };


export const RUNES: string[] = [
	'El', 'Eld', 'Tir', 'Nef', 'Eth',
	'Ith', 'Tal', 'Ral', 'Ort', 'Thul',
	'Amn', 'Sol', 'Shael', 'Dol', 'Hel',
	'Io', 'Lum', 'Ko', 'Fal', 'Lem', 'Pul',
	'Um', 'Mal', 'Ist', 'Gul', 'Vex', 'Ohm',
	'Lo', 'Sur', 'Ber', 'Jah', 'Cham', 'Zod'
];

export const D2LOD_VERSIONS = ["1.09", "1.10", "1.11"];
export const D2R_VERSIONS = ["2.4", "2.6"];

export const VERSIONS: string[] = ['1.09', '1.10', '1.11', '2.4', '2.6'];

const GEM_Q: string[] = ['Chipped', 'Flawed', '', 'Flawless'];
const GEM_TYPE: string[] = ['Topaz', 'Amethyst', 'Sapphire', 'Ruby', 'Emerald', 'Diamond'];

export const UPG_GEM: string[] = Array(9).fill("").concat(
	GEM_Q.flatMap(i => GEM_TYPE.map(j => `${i} ${j}`.trim()))
);

const RUNES_INDEX: { [key: string]: number } = Object.fromEntries(RUNES.map((rune, i) => [rune, i]));


// export var RUNE_DATA: { [key: number]: RuneData } = $state([]);
// export var RUNEWORDS: { [key: number]: Runeword } = $state([]);
// export let ITEM_TYPES: { [key: string]: any } = $state({});

async function loadJSON(url: string): Promise<any> {
	const res = await fetch(url);
	return await res.json();
}

export function upgCost(runeIndex: number): number {
	return runeIndex < 20 ? 3 : 2;
}

export function getElValue(runeIndex: number): number {
	return (3 ** Math.min(runeIndex, 20)) * (2 ** Math.max(runeIndex - 20, 0));
}

export function getInvElValue(runeInventory: number[]): number {
	return RUNES.reduce((sum, _, i) => sum + getElValue(i) * runeInventory[i], 0);
}

function defaultInventory(): number[] {
	return Array(RUNES.length).fill(0);
}

export function getPathRw(runeInventory: number[], rwRunes: string[]) {
	let workingInv: number[] = [...runeInventory];
	let workingRunes: number[] = RUNES.map(r => rwRunes.includes(r) ? rwRunes.filter(x => x === r).length : 0);
	let upgsDone: number[] = Array(RUNES.length).fill(0);
	let highestIndex: number = Math.max(...RUNES.map((_, i) => workingRunes[i] > 0 ? i : 0));

	for (let runeIndex: number = highestIndex; runeIndex > 0; runeIndex--) {
		for (let i = 0; i < RUNES.length; i++) {
			if (workingRunes[i] > 0 && workingInv[i] > 0) {
				let substract: number = Math.min(workingRunes[i], workingInv[i]);
				workingRunes[i] -= substract;
				workingInv[i] -= substract;
			}
		}

		let highestNb: number = workingRunes[runeIndex];
		workingRunes[runeIndex] = 0;
		workingRunes[runeIndex - 1] += upgCost(runeIndex - 1) * highestNb;
		upgsDone[runeIndex - 1] += highestNb;
	}

	let success: boolean = workingInv[0] >= workingRunes[0];
	let missing: number[] = defaultInventory();
	return { success, upgsDone, missing: workingRunes[0] - workingInv[0] };
}

function elsDecompose(els: number): number[] {
	let runes: number[] = RUNES.map((_, i) => i === 0 ? els : 0);
	for (let i = 1; i < RUNES.length; i++) {
		if (runes[i - 1] >= upgCost(i - 1)) {
			runes[i] += Math.floor(runes[i - 1] / upgCost(i - 1));
			runes[i - 1] %= upgCost(i - 1);
		}
	}
	return runes;
}

// export async function loadData(): Promise<void> {
// 	let promises: Promise<any>[] = [loadJSON('/data/runes.json'), loadJSON('/data/runewords.json'), loadJSON('/data/itemtypes.json')];

// 	let result: any[] = await Promise.all(promises)
// 	RUNE_DATA = result[0];
// 	RUNEWORDS = result[1];
// 	ITEM_TYPES = result[2];
// 	return
// }

export function formatMissing(missing: number[]): string {
	return RUNES.map((rune, i) => missing[i] > 0 ? `${missing[i]} ${rune}` : null).filter(Boolean).join(', ');
}


