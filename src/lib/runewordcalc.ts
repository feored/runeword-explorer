import { RUNES } from '$lib/data/runes';
import { get } from 'svelte/store';

const GEM_Q: string[] = ['Chipped', 'Flawed', '', 'Flawless'];
const GEM_TYPE: string[] = ['Topaz', 'Amethyst', 'Sapphire', 'Ruby', 'Emerald', 'Diamond'];

export const UPG_GEM: string[] = Array(9)
	.fill('')
	.concat(GEM_Q.flatMap((i) => GEM_TYPE.map((j) => `${i} ${j}`.trim())));

export function upg_cost(rune_index: number): number {
	return rune_index < 20 ? 3 : 2;
}

export function get_el_value(rune_index: number): number {
	return 3 ** Math.min(rune_index, 20) * 2 ** Math.max(rune_index - 20, 0);
}

export function get_inv_el_value(rune_inventory: number[]): number {
	return RUNES.reduce((sum, _, i) => sum + get_el_value(i) * rune_inventory[i], 0);
}

function default_inventory(): number[] {
	return Array(RUNES.length).fill(0);
}

export function calc_runeword(
	rune_inventory: number[],
	rw_runes: string[]
): { success: boolean; upgs_done: number[]; } {
	let working_inv: number[] = Array.from(rune_inventory);
	let working_runes: number[] = RUNES.map((r) =>
		rw_runes.includes(r) ? rw_runes.filter((x) => x === r).length : 0
	);

	let upgs_done: number[] = Array(RUNES.length).fill(0);
	let highest_index: number = Math.max(...RUNES.map((_, i) => (working_runes[i] > 0 ? i : 0)));

	for (let rune_index: number = highest_index; rune_index > 0; rune_index--) {
		for (let i = 0; i < RUNES.length; i++) {
			if (working_runes[i] > 0 && working_inv[i] > 0) {
				let substract: number = Math.min(working_runes[i], working_inv[i]);
				working_runes[i] -= substract;
				working_inv[i] -= substract;
			}
		}

		let highestNb: number = working_runes[rune_index];
		working_runes[rune_index] = 0;
		working_runes[rune_index - 1] += upg_cost(rune_index - 1) * highestNb;
		upgs_done[rune_index - 1] += highestNb;
	}

	let success: boolean = working_inv[0] >= working_runes[0];
	return { success, upgs_done };
}

export function calc_missing(rune_inventory: number[], rw_runes: string[]) {
	let working_inv: number[] = [...rune_inventory];
	let working_runes: number[] = RUNES.map((r) =>
		rw_runes.includes(r) ? rw_runes.filter((x) => x === r).length : 0
	);
	let runes_needed = default_inventory();

	// remove the runes from the runeword that are already in the inventory
	// since they're not missing
	for (let i = 0; i < RUNES.length; i++) {
		if (working_runes[i] > 0 && working_inv[i] > 0) {
			let substract: number = Math.min(working_runes[i], working_inv[i]);
			working_runes[i] -= substract;
			working_inv[i] -= substract;
		}
	}

	// find the lowest rune we have
	let lowest_index: number = Math.min(
		...RUNES.map((_, i) => (working_inv[i] > 0 ? i : RUNES.length))
	);
	if (lowest_index === RUNES.length) {
		// if we have no runes left, we need all the other runes
		// in the runeword
		return working_runes;
	}

	// if we have runes left, remove all the lower-tier runes
	// from the runeword and add them straight to our missing list
	// E.g if our lowest rune is a Pul, there is no way to get
	// a shael or a lem by cubing, therefore we need to add them
	for (let i = 0; i < lowest_index; i++) {
		if (working_runes[i] > 0) {
			let nb = working_runes[i];
			working_runes[i] = 0;
			runes_needed[i] += nb;
		}
	}

	// find the highest rune we need and remove all
	// the higher-tier runes from the inventory
	// since we can't cube them down
	let highest_index: number = Math.max(...RUNES.map((_, i) => (working_runes[i] > 0 ? i : 0)));
	for (let i = RUNES.length - 1; i > highest_index; i--) {
		working_inv[i] = 0;
	}

	let need_in_el = get_inv_el_value(working_runes);
	let have_in_el = get_inv_el_value(working_inv);

	// find out the value of runes we're still
	// missing in els and decompose it into runes
	let missing = els_decompose(need_in_el - have_in_el, lowest_index, highest_index);

	// the problem with the decomposition is that if e.g
	// we're missing Vex Vex Lo for phoenix, it might decompose
	// the missing value into Lo Ohm (Ohm = 2Vex in value)

	// therefore, let's construct a list of the runes we still have
	// + the runes we think we're missing
	let new_have = [...working_inv];
	for (let i = 0; i < RUNES.length; i++) {
		new_have[i] += missing[i];
	}

	// and looping from the end, if we have more of a rune
	// than we need, we conclude that actually we needed
	// more of the previous rune
	for (let i = RUNES.length - 1; i > 0; i--) {
		if (new_have[i] > working_runes[i] && working_runes[i] > 0) {
			let nb = new_have[i] - working_runes[i];
			new_have[i] -= nb;
			new_have[i - 1] += upg_cost(i - 1) * nb;
		}
	}

	// finally, we obtain a new "have + missing" list
	// which we calculated to be correct
	// so we deduct the "have" list to get the final missing list
	missing = default_inventory();
	for (let i = 0; i < RUNES.length; i++) {
		missing[i] = new_have[i] - working_inv[i];
	}

	// and add it this missing list, to the runes we decided
	// we needed at the beginning (e.g the ones lower tier than
	// the lowest rune we have)
	for (let i = 0; i < RUNES.length; i++) {
		runes_needed[i] += missing[i];
	}
	return runes_needed;
}

function els_decompose(els: number, min = 0, max = RUNES.length): number[] {
	let runes = default_inventory();
	for (let i = max; i >= 0; i--) {
		if (els === 0) {
			break;
		}
		let el_value = get_el_value(i);
		if (els >= el_value) {
			let nb = Math.floor(els / el_value);
			runes[i] += nb;
			els -= nb * el_value;
		}
	}
	return runes;
}
