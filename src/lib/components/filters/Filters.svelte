<script lang="ts">
	import { VERSIONS } from '$lib/rw';
	import Bases from '$lib/components/Filters/Bases.svelte';
	import Versions from '$lib/components/Filters/Versions.svelte';
	import RequiredRunes from '$lib/components/Filters/RequiredRunes.svelte';
	import type { FilterOptions } from '$lib/runewords.svelte.ts';
	import { filter_options } from '$lib/runewords.svelte.ts';

	$effect(() => {
		console.log('filter options have changed');
		console.log(filter_options.bases);
		console.log(filter_options.required_runes);
		console.log(filter_options.search);
		console.log(filter_options.can_make);
		console.log(filter_options.ladder_d2r);
		console.log(filter_options.ladder_d2lod);
		console.log(filter_options.versions);
		console.log(filter_options.sockets);
		console.log(filter_options.levelreq);
	});

	let filter_sockets = $state({ ...filter_options.sockets });
	let filter_levelreq = $state({ ...filter_options.levelreq });

	$effect(() => {
		if (filter_sockets.min > filter_sockets.max) {
			filter_sockets.max = filter_sockets.min;
		}
		if (filter_levelreq.min > filter_levelreq.max) {
			filter_levelreq.max = filter_levelreq.min;
		}
		filter_options.sockets = { ...filter_sockets };
		filter_options.levelreq = { ...filter_levelreq };
	});
</script>

<div class="flex" style="justify-content: space-between;">
	<h3>Filters</h3>
	<button onclick={resetFilters()}>Reset Filters</button>
</div>
<br />
<hr />
<aside id="filters">
	<fieldset>
		<input
			id="searchbar"
			type="search"
			name="search"
			placeholder="Search runewords, runes, bases, stats..."
			aria-label="Search"
			bind:value={filter_options.search}
		/>
	</fieldset>
	<hr />
	<h5>General</h5>
	<article>
		<fieldset>
			<label
				><input
					type="checkbox"
					role="switch"
					id="can_make"
					name="can_make"
					value="can_make"
					bind:checked={filter_options.can_make}
				/> Only Show Runewords I Can Make
			</label>
			<label
				><input
					type="checkbox"
					role="switch"
					id="ladder_d2r"
					name="ladder_d2r"
					value="ladder_d2r"
					bind:checked={filter_options.ladder_d2r}
				/> Show Ladder-Only Runewords (D2R)
			</label>
			<label
				><input
					type="checkbox"
					role="switch"
					id="ladder_d2lod"
					name="ladder_d2lod"
					value="ladder_d2lod"
					bind:checked={filter_options.ladder_d2lod}
				/> Show Ladder-Only Runewords (D2LoD)
			</label>
		</fieldset>
	</article>
	<hr />
	<div class="flex">
		<h5>Version</h5>
		<div class="flex all_or_none">
			<a
				href=" #"
				onclick={VERSIONS.map((ver) => {
					filter_options.versions[ver] = true;
				})}
			>
				All
			</a>
			<p>/</p>
			<a
				href=" #"
				onclick={VERSIONS.map((ver) => {
					filter_options.versions[ver] = false;
				})}
			>
				None
			</a>
		</div>
	</div>
	<Versions />
	<hr />
	<h5>Sockets</h5>
	<fieldset class="grid">
		<fieldset>
			<input
				type="number"
				id="minsocket"
				name="minsocket"
				bind:value={filter_sockets.min}
				min="2"
				step="1"
				max="6"
			/><small>Minimum</small>
		</fieldset>
		<fieldset>
			<input
				type="number"
				id="maxsocket"
				name="maxsocket"
				bind:value={filter_sockets.max}
				min="2"
				step="1"
				max="6"
			/><small>Maximum</small>
		</fieldset>
	</fieldset>
	<hr />
	<h5>Level Required</h5>
	<fieldset class="grid">
		<fieldset>
			<input
				type="number"
				id="minlevel"
				name="minlevel"
				bind:value={filter_levelreq.min}
				min="1"
				step="1"
				max="99"
			/><small>Minimum</small>
		</fieldset>
		<fieldset>
			<input
				type="number"
				id="maxlevel"
				name="maxlevel"
				bind:value={filter_levelreq.max}
				min="1"
				step="1"
				max="99"
			/><small>Maximum</small>
		</fieldset>
	</fieldset>
	<Bases />
	<RequiredRunes />
</aside>

<style>
	#filters fieldset {
		margin-bottom: 0;
	}
</style>
