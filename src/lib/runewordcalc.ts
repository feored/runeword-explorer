import { RUNES } from '#lib/data/runes.ts';

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
): { success: boolean; upgs_done: number[] } {
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

export function calc_missing_runes_simple(inventory: number[], rw_runes: string[]): number[] {
	let missing_runes: number[] = default_inventory();
	let inventory_simulation: number[] = Array.from(inventory);
	rw_runes.forEach((rune) => {
		if (!RUNES.includes(rune)) {
			throw new Error(`Invalid rune: ${rune}`);
		}
		if (inventory_simulation[RUNES.indexOf(rune)] <= 0) {
			missing_runes[RUNES.indexOf(rune)]++;
		} else {
			inventory_simulation[RUNES.indexOf(rune)]--;
		}
	});
	return missing_runes;
}

export function calc_missing(rune_inventory: number[], rw_runes: string[]): number[] {
	const required = RUNES.map((rune) => rw_runes.filter((r) => r === rune).length);
	const missing = default_inventory();

	let carry = 0;
	// value in Els of smaller runes left over after cubing
	let leftover_value = 0;

	for (let i = 0; i < RUNES.length; i++) {
		const available = rune_inventory[i] + carry;
		const rune_value = get_el_value(i);

		if (available < required[i]) {
			let deficit = (required[i] - available) * rune_value - leftover_value;

			// find which runes to add, using this rune or smaller ones
			for (let j = i; j >= 0; j--) {
				const value = get_el_value(j);
				const count = Math.floor(deficit / value);
				missing[j] += count;
				deficit -= count * value;
			}

			// we haveve now used up the leftover runes
			carry = 0;
			leftover_value = 0;
		} else {
			const surplus = available - required[i];
			const cost = upg_cost(i);

			carry = Math.floor(surplus / cost);
			leftover_value += (surplus % cost) * rune_value;
		}
	}

	return missing;
}
