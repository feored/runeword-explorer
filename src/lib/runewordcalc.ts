import { RUNEWORDS } from '$lib/data/runewords';
import { RUNES } from '$lib/data/runes';

const GEM_Q: string[] = ['Chipped', 'Flawed', '', 'Flawless'];
const GEM_TYPE: string[] = ['Topaz', 'Amethyst', 'Sapphire', 'Ruby', 'Emerald', 'Diamond'];

export const UPG_GEM: string[] = Array(9)
	.fill('')
	.concat(GEM_Q.flatMap((i) => GEM_TYPE.map((j) => `${i} ${j}`.trim())));

export function upgCost(runeIndex: number): number {
	return runeIndex < 20 ? 3 : 2;
}

export function getElValue(runeIndex: number): number {
	return 3 ** Math.min(runeIndex, 20) * 2 ** Math.max(runeIndex - 20, 0);
}

export function getInvElValue(runeInventory: number[]): number {
	return RUNES.reduce((sum, _, i) => sum + getElValue(i) * runeInventory[i], 0);
}

function defaultInventory(): number[] {
	return Array(RUNES.length).fill(0);
}

export function calc_runeword(
	runeInventory: number[],
	rwRunes: string[]
): { success: boolean; upgs_done: number[]; missing: number } {
	let workingInv: number[] = [...runeInventory];
	let workingRunes: number[] = RUNES.map((r) =>
		rwRunes.includes(r) ? rwRunes.filter((x) => x === r).length : 0
	);
	let upgs_done: number[] = Array(RUNES.length).fill(0);
	let highestIndex: number = Math.max(...RUNES.map((_, i) => (workingRunes[i] > 0 ? i : 0)));

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
		upgs_done[runeIndex - 1] += highestNb;
	}

	let success: boolean = workingInv[0] >= workingRunes[0];
	let missing: number[] = defaultInventory();
	return { success, upgs_done, missing: workingRunes[0] - workingInv[0] };
}

function elsDecompose(els: number): number[] {
	let runes: number[] = RUNES.map((_, i) => (i === 0 ? els : 0));
	for (let i = 1; i < RUNES.length; i++) {
		if (runes[i - 1] >= upgCost(i - 1)) {
			runes[i] += Math.floor(runes[i - 1] / upgCost(i - 1));
			runes[i - 1] %= upgCost(i - 1);
		}
	}
	return runes;
}
