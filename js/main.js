var RUNEWORDS_DATA = [];
var last_clicked_th = null;

function setAllRunes(num) {
	for (let i = 0; i < RUNES.length; i++) {
		let id = RUNES[i] + "_rune";
		document.getElementById(id).value = num;
	}
	updateRunewords();
}

function resetAllRunes() {
	setAllRunes(0);
}

function cleanTable() {
	let table_element = document.querySelector("#rwtable tbody");
	while (table_element.firstChild) {
		table_element.removeChild(table_element.firstChild);
	}
}

function updateRunewords() {
	cleanTable();
	RUNEWORDS_DATA = [];
	let inventory = [];
	for (let i = 0; i < RUNES.length; i++) {
		let id = RUNES[i] + "_rune";
		inventory.push(document.getElementById(id).value);
	}
	let table = document.querySelector("#rwtable tbody");
	for (let i = 0; i < RUNEWORDS.length; i++) {
		let rw = RUNEWORDS[i];
		let { success, upgsDone, lacking } = getPathRw(inventory, rw.runes);
		rw.success = success;
		rw.upgsDone = upgsDone;
		rw.lacking = lacking;
		rw.el_value = rw.runes.map((x) => getElValue(RUNES.indexOf(x))).reduce((partialSum, a) => partialSum + a, 0);
		row = makeTableEntry(rw);
		rw.row = row;
		RUNEWORDS_DATA.push(rw);
		table.appendChild(row);
	}
	if (last_clicked_th) {
		// Sort the table again
		last_clicked_th.click();
		last_clicked_th.click();
	}
	updateFilters();
}

function makeTableEntryName(runeword_data) {
	let name = document.createElement("td");
	name.innerText = runeword_data.name;
	if (runeword_data.ladder) {
		name.appendChild(document.createElement("br"));
		let ladder = document.createElement("small");
		ladder.innerText = "Ladder Only";
		name.appendChild(ladder);
	}
	return name
}

function makeTableEntryBases(runeword_data) {
	let item_types = document.createElement("td");
	item_types.innerHTML = runeword_data.type.map((x) => x in ITEM_TYPES ? ('<em data-html="true" data-tooltip="' + (ITEM_TYPES[x].join(',\n')) + '"">' + x + '</em>') : x).join("<br />");
	return item_types;
}

function makeTableEntrySockets(runeword_data) {
	let sockets = document.createElement("td");
	sockets.innerText = runeword_data.sockets;
	return sockets;
}

function makeTableEntryRunes(runeword_data) {
	let runes = document.createElement("td");
	runes.innerText = runeword_data.runes.join(" ");
	runes.setAttribute("data-sort", runeword_data.el_value);
	return runes;
}

function makeTableEntryStats(runeword_data) {
	let stats = document.createElement("td");
	stats.innerHTML = runeword_data.stats.join("<br />");
	return stats;
}

function makeTableEntryLevelReq(runeword_data) {
	let level_req = document.createElement("td");
	level_req.innerText = runeword_data.levelreq;
	return level_req;
}

function makeTableEntryCubeReq(runeword_data) {
	let cubing_required = document.createElement("td");
	if (runeword_data.success && runeword_data.upgsDone.reduce((partialSum, a) => partialSum + a, 0) > 0) {
		cubing_required.innerHTML = formatUpgs(runeword_data.upgsDone, runeword_data.runes);
	}
	return cubing_required;
}

function makeTableEntryPossible(runeword_data) {
	let possible = document.createElement("td");
	let checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = runeword_data.success;
	checkbox.disabled = true;
	possible.appendChild(checkbox);
	return possible;
}


function makeTableEntry(runeword_data) {
	let row = document.createElement("tr");
	row.appendChild(makeTableEntryName(runeword_data));
	row.appendChild(makeTableEntryBases(runeword_data));
	row.appendChild(makeTableEntrySockets(runeword_data));
	row.appendChild(makeTableEntryRunes(runeword_data));
	row.appendChild(makeTableEntryStats(runeword_data));
	row.appendChild(makeTableEntryLevelReq(runeword_data));
	row.appendChild(makeTableEntryCubeReq(runeword_data));
	row.appendChild(makeTableEntryPossible(runeword_data));
	return row;
}


document.onreadystatechange = () => {
	if (document.readyState === "interactive") {
		for (let i = 0; i < RUNES.length; i++) {
			let id = RUNES[i] + "_rune";
			document.getElementById(id).addEventListener("input", updateRunewords);
		}
		// Keep track of how the table is sorted for when we need to update the table
		document.querySelectorAll("#rwtable thead th").forEach((x) => x.addEventListener("click", function () {
			last_clicked_th = x;
		}));
		// Set table to sort by name by default
		document.getElementById("runeword_name").click();
		loadData().then(() => {
			updateRunewords();
		});
	}
};

function isAnyBaseShown(itemtypes, selected_bases) {
	let final_item_types = [];
	for (let i = 0; i < itemtypes.length; i++) {
		if (itemtypes[i] in ITEM_TYPES) {
			final_item_types = final_item_types.concat(ITEM_TYPES[itemtypes[i]]);
		} else {
			final_item_types.push(itemtypes[i]);
		}
	}
	return final_item_types.some((x) => selected_bases.indexOf(x) != -1);
}

function updateFilters() {
	let ladder = document.getElementById("ladder").checked;
	let checked_item_types = [];
	document.querySelectorAll("#bases input[type=checkbox]:checked").forEach((x) => checked_item_types.push(x.name));
	let versions = [];
	let [minsocket, maxsocket] = [document.getElementById("minsocket"), document.getElementById("maxsocket")];
	if (parseInt(minsocket.value) > parseInt(maxsocket.value)) {
		[minsocket.value, maxsocket.value] = [maxsocket.value, maxsocket.value];
	}
	let [minlevel, maxlevel] = [document.getElementById("minlevel"), document.getElementById("maxlevel")];
	if (parseInt(minlevel.value) > parseInt(maxlevel.value)) {
		[minlevel.value, maxlevel.value] = [maxlevel.value, maxlevel.value];
	}

	document.getElementsByName("version").forEach((x) => x.checked ? versions.push(x.value) : null);
	let search_term = document.getElementById("searchbar").value.toLowerCase();
	let shown_nb = 0;

	for (let i = 0; i < RUNEWORDS_DATA.length; i++) {
		let rw = RUNEWORDS_DATA[i];
		let show = true;
		if (!ladder && rw.ladder) {
			show = false;
		}
		else if (document.getElementById("can_make").checked && !rw.success) {
			show = false;
		}
		else if (versions.indexOf(rw.version) == -1) {
			show = false;
		}
		else if (rw.sockets < minsocket.value || rw.sockets > maxsocket.value) {
			show = false;
		}
		else if (rw.levelreq < minlevel.value || rw.levelreq > maxlevel.value) {
			show = false;
		}
		else if (!isAnyBaseShown(rw.type, checked_item_types)) {
			show = false;
		}

		// search bar
		if (search_term != "") {
			show = false;
			if ((rw.name.toLowerCase().includes(search_term))
				|| (rw.runes.some((x) => x.toLowerCase().includes(search_term)))
				|| (rw.stats.some((x) => x.toLowerCase().includes(search_term)))
				|| (rw.type.some((x) => x.toLowerCase().includes(search_term)))) {
				show = true;
			}
		}
		shown_nb += show ? 1 : 0;
		rw.row.hidden = !show;
	}
	document.getElementById("runeword-nb").innerText = "Showing: " + shown_nb + "/" + RUNEWORDS_DATA.length + " runewords (" + (shown_nb / RUNEWORDS_DATA.length * 100).toFixed(2) + "%)";
}

function resetFilters() {
	let inputs = document.querySelectorAll("#filters input");
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].type == "checkbox") {
			inputs[i].checked = inputs[i].defaultChecked;
		}
		else {
			inputs[i].value = inputs[i].defaultValue;
		}
	}
}

function selectBases(selected, bases = '') {
	let inputs = document.querySelectorAll("#bases " + bases + " input[type=checkbox]");
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].checked = selected ? true : false;
	}
	updateFilters();
}

function selectVersions(selected) {
	let inputs = document.querySelectorAll("#filters input[name=version]");
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].checked = selected ? true : false;
	}
	updateFilters();
}