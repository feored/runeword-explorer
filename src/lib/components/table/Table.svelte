<script lang="ts">
	import '#lib/css/sortable.css';

	import { get_runewords, type AvailableRuneword } from '#lib/data/runewords.ts';
	import { RUNES } from '#lib/data/runes.ts';
	import { SYNONYMS } from '#lib/data/synonyms.ts';

	import { isAnyBaseSelected } from '#lib/data/bases.ts';
	import {
		rune_inventory,
		settings,
		filter_options,
		type FilterOptions
	} from '#lib/options.svelte.ts';
	import { calc_runeword, get_el_value } from '#lib/runewordcalc.ts';

	import Name from '#lib/components/table/cols/Name.svelte';
	import Possible from '#lib/components/table/cols/Possible.svelte';
	import Introduction from '#lib/components/table/cols/Introduction.svelte';
	import Bases from '#lib/components/table/cols/Bases.svelte';
	import Stats from '#lib/components/table/cols/Stats.svelte';
	import Cubed from '#lib/components/table/cols/Cubed.svelte';

	import Mark from 'mark.js';

	import { onMount } from 'svelte';

	interface RunewordRow extends AvailableRuneword {
		el_value: number;
		upgs_done: number[];
		success: boolean;
		missing?: number[];
		cubing_steps: number;
	}

	let default_sort_th: HTMLElement;
	let mark_instance: Mark;

	onMount(() => {
		default_sort_th.click();
	});

	$effect(() => {
		if (mark_instance) {
			mark_instance.unmark();
		}
		mark_instance = new Mark(document.querySelectorAll('#rwtable tr:not([hidden]) .searchable'));
		mark_instance.mark(filter_options.search.toLowerCase(), {
			separateWordSearch: false,
			synonyms: SYNONYMS
		});
	});

	function sum_steps(upgs: number[]): number {
		var total = 0;
		var i = upgs.length;

		while (i--) {
			total += upgs[i];
		}

		return total;
	}

	let runewords: RunewordRow[] = $derived.by(() => {
		return get_runewords(settings.profile).map((rw) => {
			let { success, upgs_done } = calc_runeword(rune_inventory, rw.runes);
			let el_value = rw.runes
				.map((x) => get_el_value(RUNES.indexOf(x)))
				.reduce((partialSum, a) => partialSum + a, 0);
			let cubing_steps = upgs_done ? sum_steps(upgs_done) : 0;
			return { ...rw, success, upgs_done, el_value, cubing_steps };
		});
	});

	let runeword_rows = $derived.by(() => {
		let shown = [];
		for (let i = 0; i < runewords.length; i++) {
			shown.push(filter_rw(runewords[i], filter_options));
		}
		return shown;
	});

	function filter_rw(rw: RunewordRow, filter_options: FilterOptions): boolean {
		function search(search_term: string): boolean {
			if (
				rw.name.toLowerCase().includes(search_term) ||
				rw.aliases?.some((alias) => alias.toLowerCase().includes(search_term)) ||
				rw.runes.join(' ').toLowerCase().includes(search_term) ||
				rw.notes?.some((note) => note.toLowerCase().includes(search_term)) ||
				Object.values(rw.stats).some((statList) =>
					statList.some((statLine) => statLine.toLowerCase().includes(search_term))
				) ||
				rw.bases.some((x) => x.toLowerCase().includes(search_term))
			) {
				return true;
			}
			return false;
		}

		let show = true;
		if (
			(filter_options.only_can_make && !rw.success) ||
			!filter_options.introduced_in[rw.introduced_in.id] ||
			rw.sockets < filter_options.sockets.min ||
			rw.sockets > filter_options.sockets.max ||
			rw.levelreq < filter_options.levelreq.min ||
			rw.levelreq > filter_options.levelreq.max ||
			filter_options.required_runes.some(
				(selected, index) => selected && !rw.runes.includes(RUNES[index])
			) ||
			!isAnyBaseSelected(rw.bases, filter_options.bases, settings.profile.edition, rw.sockets)
		) {
			show = false;
		}

		// search bar
		let search_term = filter_options.search.toLowerCase();
		if (show && search_term != '') {
			show = search(search_term);
			// If the row is not already shown, try again with synonym of search term
			if (!show && search_term in SYNONYMS) {
				show = search(SYNONYMS[search_term]);
			}
		}

		return show;
	}
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/sortable-tablesort@3.2.3/sortable.min.js"></script>
</svelte:head>

<section>
	<section>
		<p id="runeword-nb">
			Showing {runeword_rows.filter(Boolean).length}/{runeword_rows.length} ({(
				(runeword_rows.filter(Boolean).length * 100) /
				(runeword_rows.length || 1)
			).toFixed(2)}%)
		</p>
	</section>
	<section class="overflow-auto">
		<table id="rwtable" class="striped sortable asc">
			<thead>
				<tr>
					<th>Can Make</th>
					<th bind:this={default_sort_th}>Name</th>
					<th class="no-sort">Bases</th>
					<th>Sockets</th>
					<th> Runes </th>
					<th class="no-sort">Stats</th>
					<th>Level Req.</th>
					<th>Introduced in</th>
					<th>Cubed Runes</th>
				</tr>
			</thead>
			<tbody>
				{#each runewords as rw, rw_index (rw.id)}
					<tr hidden={!runeword_rows[rw_index]}>
						<td data-sort={rw.success} class="possible">
							<Possible possible={rw.success} />
						</td>
						<td class="searchable" data-sort={rw.name}>
							<Name name={rw.name} notes={rw.notes} />
						</td>
						<td class="searchable">
							<Bases
								expand={settings.expand_bases}
								bases={rw.bases}
								edition={settings.profile.edition}
								sockets={rw.sockets}
							/>
						</td>
						<td class="sockets">
							{rw.sockets}
						</td>
						<td data-sort={rw.el_value} class="runes searchable">
							{rw.runes.join(' ')}
						</td>
						<td class="searchable" style="min-width: 15rem;"
							><Stats compact={filter_options.compact_mode} stats={rw.stats} />
						</td>
						<td class="levelreq">
							{rw.levelreq}
						</td>
						<td>
							<Introduction introduction={rw.introduced_in} />
						</td>
						<td data-sort={rw.success ? rw.cubing_steps : 0}
							><Cubed
								max_steps={settings.max_steps}
								compact={filter_options.compact_mode}
								success={rw.success}
								upgs_done={rw.upgs_done}
								rw_runes={rw.runes}
								inventory={rune_inventory}
								cubing_steps={rw.cubing_steps}
								missing_runes_cube_mode={settings.missing_runes_cube_mode}
							/></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</section>
{#if runeword_rows.filter(Boolean).length > 10}
	<section>
		<button
			class="reset outline"
			style="width: 100%; text-align:center;"
			onclick={() => {
				document.documentElement.scrollTop = 0;
			}}>Back to Top</button
		>
	</section>
{/if}

<style>
	#rwtable thead th {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	#rwtable th,
	td {
		text-align: center;
	}

	#rwtable tbody tr:hover td {
		background: rgba(0, 0, 0, 0.5) !important;
	}

	#runeword-nb {
		text-align: center;
		font-weight: 600;
		font-size: small;
		color: var(--pico-secondary);
	}

	.runes {
		color: var(--color-craft);
	}

	.levelreq,
	.sockets {
		background-color: var(--color-magic);
		padding: var(--pico-spacing);
		font-weight: 500;
	}

	.levelreq,
	.sockets,
	.possible {
		width: min-content;
	}
</style>
