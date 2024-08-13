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
	rw_runes: string[],
	cont: boolean = true
): { success: boolean; upgs_done: number[]; missing: number[] } {
	let working_inv: number[] = Array.from(rune_inventory);
	console.log("RUNES INVENTORY AT BEGINNING");
	console.log(rune_inventory);
	let working_runes: number[] = RUNES.map((r) =>
		rw_runes.includes(r) ? rw_runes.filter((x) => x === r).length : 0
	);
	console.log("RUNES NEEEDED");
	console.log(working_runes);
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
	console.log("WORKING INV");
	console.log(working_inv);
	console.log("WORKING RUNES");
	console.log(working_runes);

	let success: boolean = working_inv[0] >= working_runes[0];
	console.log("SUCCESS: " + success);
	let missing = default_inventory();
	if (!success && cont) {
		console.log("Now in the b4 cont part and success: " + success);
		missing = calc_missing(rune_inventory, rw_runes);
		let new_inv = Array.from(rune_inventory);
		for (let i = 0; i < RUNES.length; i++) {
			new_inv[i] += missing[i];
		}
		console.log('New inventory');
		console.log(new_inv);
		let { success: new_success, upgs_done: new_upgs_done, missing: new_missing } = calc_runeword(new_inv, rw_runes, false);
		// console.log("AFTER CONT");
		if (!new_success) {
			console.log("###########");
			console.log("###########");
			console.log("###########");
			console.log("CONTFAILED: ", rw_runes);
		} else {
			console.log("CONTSUCCESS: ", rw_runes);
		}

	}
	return { success, upgs_done, missing: missing };
}

function calc_missing(rune_inventory: number[], rw_runes: string[]) {
	console.log('Calculating missing runes for:');
	console.log(rw_runes.join(', '));
	console.log("Called with inventory: " + rune_inventory);
	let working_inv: number[] = [...rune_inventory];
	let working_runes: number[] = RUNES.map((r) =>
		rw_runes.includes(r) ? rw_runes.filter((x) => x === r).length : 0
	);

	console.log("INITIAL HAVE");
	console.log(working_inv);

	let runes_needed = default_inventory();

	let lowest_index: number = Math.min(...RUNES.map((_, i) => (working_inv[i] > 0 ? i : RUNES.length)));
	if (lowest_index === RUNES.length) {
		// console.log('Have no runes to start with');
		// console.log(working_runes);
		return working_runes;
	}
	for (let i = 0; i < lowest_index; i++) {
		if (working_runes[i] > 0) {
			let nb = working_runes[i];
			working_runes[i] = 0;
			runes_needed[i] += nb;
		}
	}
	console.log('Runes after eliminating left side');
	console.log(working_runes);
	console.log('Runes needed after eliminating left side');
	console.log(runes_needed);

	let highest_index: number = Math.max(...RUNES.map((_, i) => (working_runes[i] > 0 ? i : 0)));
	console.log('Highest index: ' + highest_index);
	console.log('Lowest index: ' + lowest_index);
	working_inv.map((r, i) => (r = i > highest_index ? 0 : r));
	console.log('Runes after eliminating right side');
	console.log(working_inv);

	let need_in_el = get_inv_el_value(working_runes);
	let have_in_el = get_inv_el_value(working_inv);
	console.log('Need in el');
	console.log(need_in_el);
	console.log('Have in el');
	console.log(have_in_el);
	console.log('runes already need');
	console.log(runes_needed);
	console.log("D IN R0")
	console.log(need_in_el - have_in_el);
	let missing = els_decompose(need_in_el - have_in_el, lowest_index, highest_index + 1);

	console.log('Runes after decomposing');
	console.log(missing);
	console.log("OLd HAVE");
	console.log(working_inv);
	let new_have = [...working_inv];

	for (let i = 0; i < RUNES.length; i++) {
		new_have[i] += missing[i];
	}
	console.log("NEW HAVE");
	console.log(new_have);
	console.log("OLd HAVE");
	console.log(working_inv);
	console.log("WORKING RUNES");
	console.log(working_runes);
	for (let i = RUNES.length - 1; i > 0; i--) {
		if (new_have[i] > working_runes[i] && working_runes[i] > 0) {
			console.log("FOr i: " + i + " new_have[i] > working_runes[i] (" + new_have[i] + " > " + working_runes[i] + ")");
			let nb = new_have[i] - working_runes[i];
			console.log("NB: " + nb);
			new_have[i] -= nb;
			console.log("for i: " + i + " new_have[i] = " + new_have[i]);
			new_have[i - 1] += upg_cost(i - 1) * nb;
			console.log("for i: " + i + " new_have[i-1] = " + new_have[i - 1]);
		}
	}
	console.log("NEW HAVE AFTER OP");
	console.log(new_have);

	console.log("old have")
	console.log(working_inv);
	missing = default_inventory();
	for (let i = 0; i < RUNES.length; i++) {
		missing[i] = new_have[i] - working_inv[i];
	}

	console.log("MISSING AFTER OP");
	console.log(missing);

	for (let i = 0; i < RUNES.length; i++) {
		runes_needed[i] += missing[i];
	}
	console.log("FINAL MISSING")
	console.log(runes_needed);
	return runes_needed;
}

function els_decompose(els: number, min = 0, max = RUNES.length): number[] {
	console.log("Decompose called with: " + els + " min: " + min + " max: " + max);
	let runes = default_inventory();
	for (let i = max; i >= 0; i--) {
		// console.log("Decompose for i: " + i + " els: " + els);
		if (els === 0) {
			// console.log("BREAK");
			break;
		}
		let el_value = get_el_value(i);
		// console.log("els left: " + els);
		// console.log("el_value: " + el_value);
		if (els >= el_value) {
			// console.log("Dividing. els: " + els + " el_value: " + el_value);
			let nb = Math.floor(els / el_value);
			// console.log("Nb: " + nb);
			runes[i] += nb;
			els -= nb * el_value;
		} else {
			// console.log("Not enough els, next.");
		}

	}
	console.log("Decompose result");
	console.log(runes);
	return runes;
}
