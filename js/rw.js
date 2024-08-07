const RUNES = [
	'El', 'Eld', 'Tir', 'Nef', 'Eth',
	'Ith', 'Tal', 'Ral', 'Ort', 'Thul',
	'Amn', 'Sol', 'Shael', 'Dol', 'Hel',
	'Io', 'Lum', 'Ko', 'Fal', 'Lem', 'Pul',
	'Um', 'Mal', 'Ist', 'Gul', 'Vex', 'Ohm',
	'Lo', 'Sur', 'Ber', 'Jah', 'Cham', 'Zod'
];

const GEM_Q = ['Chipped', 'Flawed', '', 'Flawless'];
const GEM_TYPE = ['Topaz', 'Amethyst', 'Sapphire', 'Ruby', 'Emerald', 'Diamond'];

const UPG_COST = Array(9).fill("").concat(
	GEM_Q.flatMap(i => GEM_TYPE.map(j => `${i} ${j}`.trim()))
);

const RUNES_INDEX = Object.fromEntries(RUNES.map((rune, i) => [rune, i]));

var RUNE_DATA = [];
var RUNEWORDS = [];
var ITEM_TYPES = {};

async function loadJSON(url) {
	const res = await fetch(url);
	return await res.json();
}

function upgNb(runeIndex) {
	return runeIndex < 20 ? 3 : 2;
}

function getElValue(runeIndex) {
	return (3 ** Math.min(runeIndex, 20)) * (2 ** Math.max(runeIndex - 20, 0));
}

function getInvElValue(runeInventory) {
	return RUNES.reduce((sum, _, i) => sum + getElValue(i) * runeInventory[i], 0);
}

function defaultInventory() {
	return Array(RUNES.length).fill(0);
}

function getPathRw(runeInventory, rwRunes) {
	let workingInv = [...runeInventory];
	let workingRunes = RUNES.map(r => rwRunes.includes(r) ? rwRunes.filter(x => x === r).length : 0);
	let upgsDone = Array(RUNES.length).fill(0);
	let highestIndex = Math.max(...RUNES.map((_, i) => workingRunes[i] > 0 ? i : 0));

	for (let runeIndex = highestIndex; runeIndex > 0; runeIndex--) {
		for (let i = 0; i < RUNES.length; i++) {
			if (workingRunes[i] > 0 && workingInv[i] > 0) {
				let substract = Math.min(workingRunes[i], workingInv[i]);
				workingRunes[i] -= substract;
				workingInv[i] -= substract;
			}
		}

		let highestNb = workingRunes[runeIndex];
		workingRunes[runeIndex] = 0;
		workingRunes[runeIndex - 1] += upgNb(runeIndex - 1) * highestNb;
		upgsDone[runeIndex - 1] += highestNb;
	}

	let success = workingInv[0] >= workingRunes[0];
	let missing = defaultInventory();
	return { success, upgsDone, missing: workingRunes[0] - workingInv[0] };
}

function elsDecompose(els) {
	let runes = RUNES.map((_, i) => i === 0 ? els : 0);
	for (let i = 1; i < RUNES.length; i++) {
		if (runes[i - 1] >= upgNb(i - 1)) {
			runes[i] += Math.floor(runes[i - 1] / upgNb(i - 1));
			runes[i - 1] %= upgNb(i - 1);
		}
	}
	return runes;
}

function formatMissing(missing) {
	return RUNES.map((rune, i) => missing[i] > 0 ? `${missing[i]} ${rune}` : null).filter(Boolean).join(', ');
}

function formatUpgs(upgs, rw_runes) {
	return upgs.map((nb, i) => nb > 0 ? formatUpgLine(i, nb, rw_runes.includes(RUNES[i + 1])) : null).filter(Boolean).join('<br>');
}

function formatUpgLine(runeIndex, nb, highlight = false) {
	let gemColorClass = "";
	if (nb > 0 && UPG_COST[runeIndex]) {
		let gem = UPG_COST[runeIndex].split(' ');
		gemColorClass = `${gem[gem.length - 1].toLowerCase()}"`;
	}
	return `${nb * upgNb(runeIndex)} <span class="rune-text">${RUNES[runeIndex]}</span> ${nb > 0 && UPG_COST[runeIndex] ? ' + ' + nb + ' <span class="' + gemColorClass + '">' + UPG_COST[runeIndex] + "</span>" : ''} <i data-lucide="arrow-right" style="width:1em; height:1em;"></i> ${highlight ? "<mark>" : ''}${nb} <span class="rune-text">${RUNES[runeIndex + 1]}</span>${highlight ? "</mark>" : ''} `;
}


async function loadData() {
	let result = null;
	let promises = [loadJSON('./data/runes.json'), loadJSON('./data/runewords.json'), loadJSON('./data/itemtypes.json')];

	result = await Promise.all(promises)
	RUNE_DATA = result[0];
	RUNEWORDS = result[1];
	ITEM_TYPES = result[2];
	return
}
