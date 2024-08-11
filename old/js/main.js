var RUNEWORDS_DATA = [];
var last_clicked_th = null;
var mark_instance = null;


/* On page load */
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
		document.querySelector("#rwtable th.runeword_name").click();
		loadData().then(() => {
			updateRunewords();
		});
	}
};


/* Useful functions to update a million checkboxes */

function setRunes(minId, maxId, num) {
	for (let i = minId; i < maxId; i++) {
		let id = RUNES[i] + "_rune";
		document.getElementById(id).value = num;
	}
	updateRunewords();
}

function selectCheckboxes(selected, selector) {
	let inputs = document.querySelectorAll(selector + " input[type=checkbox]");
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].checked = selected;
	}
	updateFilters();
}


/* Updating the runewords table */


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
		let val = parseInt(document.getElementById(id).value);
		val = isNaN(val) ? 0 : val;
		inventory.push(val);
	}
	let table = document.querySelector("#rwtable tbody");
	for (let i = 0; i < RUNEWORDS.length; i++) {
		let rw = RUNEWORDS[i];
		let { success, upgsDone, missing } = getPathRw(inventory, rw.runes);
		rw.success = success;
		rw.upgsDone = upgsDone;
		rw.missing = missing;
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
	lucide.createIcons();
	updateFilters();
}


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

function filterRow(only_can_make, ladder_d2r, ladder_d2lod, checked_item_types, versions, minsocket, maxsocket, minlevel, maxlevel, required_runes, search_term, rw) {


	return show

}

function updateFilters() {
	let only_can_make = document.getElementById("can_make").checked;
	let ladder_d2r = document.getElementById("ladder_d2r").checked;
	let ladder_d2lod = document.getElementById("ladder_d2lod").checked;
	let checked_item_types = Array.from(document.querySelectorAll("#bases input[type=checkbox]:checked")).map((x) => x.value);
	let versions = Array.from(document.querySelectorAll("#filter_versions input[type=checkbox]:checked")).map((x) => x.value);
	let required_runes = Array.from(document.querySelectorAll("#required_runes input[type=checkbox]:checked")).map((x) => x.value);

	let [minsocket, maxsocket] = [document.getElementById("minsocket"), document.getElementById("maxsocket")];
	if (parseInt(minsocket.value) > parseInt(maxsocket.value)) {
		[minsocket.value, maxsocket.value] = [maxsocket.value, maxsocket.value];
	}

	let [minlevel, maxlevel] = [document.getElementById("minlevel"), document.getElementById("maxlevel")];
	if (parseInt(minlevel.value) > parseInt(maxlevel.value)) {
		[minlevel.value, maxlevel.value] = [maxlevel.value, maxlevel.value];
	}

	let search_term = document.getElementById("searchbar").value.toLowerCase();

	let shown_nb = 0;

	for (let i = 0; i < RUNEWORDS_DATA.length; i++) {
		let rw = RUNEWORDS_DATA[i];

		let show = true;
		if (((!ladder_d2lod && rw.ladder.d2lod) || (!ladder_d2r && rw.ladder.d2r))
			|| (only_can_make && !rw.success)
			|| (versions.indexOf(rw.version) == -1)
			|| (rw.sockets < minsocket.value || rw.sockets > maxsocket.value)
			|| (rw.levelreq < minlevel.value || rw.levelreq > maxlevel.value)
			|| (required_runes.some((x) => rw.runes.indexOf(x) == -1))
			|| (!isAnyBaseShown(Array.from(new Set([].concat(rw.bases, rw.bases_d2r))), checked_item_types))) {
			show = false;
		}

		// search bar
		if (show && search_term != "") {
			show = false;
			if ((rw.name.toLowerCase().includes(search_term))
				|| (rw.runes.join(" ").toLowerCase().includes(search_term))
				|| (rw.stats.some((x) => x.toLowerCase().includes(search_term)))
				|| (rw.bases.some((x) => x.toLowerCase().includes(search_term)))
				|| (rw.bases_d2r.some((x) => x.toLowerCase().includes(search_term)))) {
				show = true;
			}
		}

		shown_nb += show ? 1 : 0;
		rw.row.hidden = !show;
	}

	if (mark_instance != null) { mark_instance.unmark(); }
	mark_instance = new Mark(document.querySelectorAll("#rwtable tr:not([hidden]) .searchable")).mark(search_term, { separateWordSearch: false });

	document.getElementById("runeword-nb").innerText = `Showing: ${shown_nb}/${RUNEWORDS_DATA.length} runewords (${(shown_nb / RUNEWORDS_DATA.length * 100).toFixed(2)}%)`;
}

function resetFilters() {
	let inputs = document.querySelectorAll("#filters input");
	for (let i = 0; i < inputs.length; i++) {
		console.log(inputs[i]);
		if (inputs[i].type == "checkbox") {
			inputs[i].checked = inputs[i].defaultChecked;
		}
		else {
			inputs[i].value = inputs[i].defaultValue;
		}
	}
}



/* Making the runeword table rows */


function makeTableEntry(runeword_data) {
	let row = document.createElement("tr");
	row.appendChild(makeTableEntryPossible(runeword_data));
	row.appendChild(makeTableEntryVersion(runeword_data));
	row.appendChild(makeTableEntryName(runeword_data));
	row.appendChild(makeTableEntryBases(runeword_data));
	row.appendChild(makeTableEntrySockets(runeword_data));
	row.appendChild(makeTableEntryRunes(runeword_data));
	row.appendChild(makeTableEntryStats(runeword_data));
	row.appendChild(makeTableEntryLevelReq(runeword_data));
	row.appendChild(makeTableEntryCubeReq(runeword_data));
	return row;
}


function makeTableEntryPossible(runeword_data) {
	let possible = document.createElement("td");
	possible.classList.add("runeword_can_make");
	possible.innerHTML = `<i data-lucide="${runeword_data.success ? "check" : "circle-x"}" class="${runeword_data.success ? "color-good" : "color-bad"}"></i>`;
	possible.setAttribute("data-sort", runeword_data.success);
	return possible;
}


function makeTableEntryVersion(runeword_data) {
	let version = document.createElement("td");
	version.classList.add("runeword_version");
	version.innerText = runeword_data.version;
	return version;
}


function makeTableEntryName(runeword_data) {
	let name = document.createElement("td");
	name.classList.add("runeword_name");
	name.innerText = runeword_data.name;
	warnings = document.createElement("div");
	warnings.classList.add("warnings");
	if (runeword_data.ladder.d2lod) {
		let ladder = document.createElement("small");
		ladder.setAttribute("data-tooltip", "Runeword restricted to ladder in Diablo II:  Lord of Destruction.\nCan be made in any mode in Diablo II: Resurrected.");
		ladder.setAttribute("data-placement", "bottom");
		ladder.classList.add("d2lod_ladder");
		ladder.innerText = "Ladder";
		warnings.appendChild(ladder);

	} else if (runeword_data.d2r_only) {
		let version = document.createElement("small");
		version.setAttribute("data-tooltip", "Runeword only available in Diablo II: Resurrected.\nCannot be made in Diablo II: Lord of Destruction.");
		version.setAttribute("data-placement", "bottom");
		version.classList.add("d2r_only");
		version.innerText = "D2R";
		warnings.appendChild(version);
	}
	if (runeword_data.ladder.d2r) {
		let ladder = document.createElement("small");
		ladder.setAttribute("data-tooltip", "Runeword restricted to ladder in Diablo II: Resurrected.\nCan be made in single-player mode.");
		ladder.setAttribute("data-placement", "bottom");
		ladder.classList.add("d2r_ladder");
		ladder.innerText = "Ladder";
		warnings.appendChild(ladder);
	}
	if (warnings.childElementCount > 0) {
		name.appendChild(warnings);
	}
	name.classList.add("searchable");
	return name
}


function makeTableEntryBases(runeword_data) {
	function makeBasesHTML(bases) {
		return bases.map((x) => x in ITEM_TYPES ? `<em data-html="true" data-tooltip="${ITEM_TYPES[x].join(',\n')}">${x}</em>` : `<span>${x}</span>`).join("<br />");
	}
	let item_types = document.createElement("td");
	item_types.classList.add("runeword_bases");
	if (runeword_data.bases_d2r.length == 0) {
		item_types.innerHTML = makeBasesHTML(runeword_data.bases);
		return item_types;
	} else {
		let d2lod_bases = document.createElement("div");
		d2lod_bases.classList.add("bases_group");
		let d2lod_warning = document.createElement("small");
		d2lod_warning.setAttribute("data-tooltip", "Bases available in Diablo II: Lord of Destruction.");
		d2lod_warning.classList.add("d2lod_ladder");
		d2lod_warning.innerText = "D2LoD";
		d2lod_actual_bases = document.createElement("p");
		d2lod_actual_bases.innerHTML = makeBasesHTML(runeword_data.bases);
		d2lod_bases.appendChild(d2lod_warning);
		d2lod_bases.appendChild(d2lod_actual_bases);


		let d2r_bases = document.createElement("div");
		d2r_bases.classList.add("bases_group");
		let d2r_warning = document.createElement("small");
		d2r_warning.setAttribute("data-tooltip", "Bases available in Diablo II Resurrected.");
		d2r_warning.classList.add("d2r_only");
		d2r_warning.innerText = "D2R";
		d2r_actual_bases = document.createElement("p");
		d2r_actual_bases.innerHTML = makeBasesHTML(runeword_data.bases_d2r);
		d2r_bases.appendChild(d2r_warning);
		d2r_bases.appendChild(d2r_actual_bases);

		d2lod_bases.classList.add("searchable");
		d2r_bases.classList.add("searchable");

		item_types.appendChild(d2lod_bases);
		item_types.appendChild(d2r_bases);
		return item_types;
	}
}

function makeTableEntrySockets(runeword_data) {
	let sockets = document.createElement("td");
	sockets.classList.add("runeword_sockets");
	sockets.innerText = runeword_data.sockets;
	return sockets;
}

function makeTableEntryRunes(runeword_data) {
	let runes = document.createElement("td");
	runes.classList.add("runeword_runes");
	runes.innerText = runeword_data.runes.join(" ");
	runes.classList.add("searchable");
	runes.setAttribute("data-sort", runeword_data.el_value);
	return runes;
}

function makeTableEntryStats(runeword_data) {
	let stats = document.createElement("td");
	stats.classList.add("runeword_stats");
	stats.classList.add("searchable");
	stats.innerHTML = runeword_data.stats.map((x) => x.toLowerCase().includes('varies') ? "<span class='varying-stat'>" + x + "</span>" : x).join("<br />");
	return stats;
}

function makeTableEntryLevelReq(runeword_data) {
	let level_req = document.createElement("td");
	level_req.classList.add("runeword_levelreq");
	level_req.innerText = runeword_data.levelreq;
	return level_req;
}

function makeTableEntryCubeReq(runeword_data) {
	let cubing_required = document.createElement("td");
	cubing_required.classList.add("runeword_cubing");
	cubing_required.innerHTML = runeword_data.success ? formatUpgs(runeword_data.upgsDone, runeword_data.runes) : "";
	cubing_required.setAttribute("data-sort", runeword_data.upgsDone.filter((x) => x > 0).length);
	return cubing_required;
}






