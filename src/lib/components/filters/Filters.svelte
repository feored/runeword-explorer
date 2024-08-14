<script lang="ts">
	import Bases from '$lib/components/filters/filters/Bases.svelte';
	import Versions from '$lib/components/filters/filters/Versions.svelte';
	import RequiredRunes from '$lib/components/filters/filters/RequiredRunes.svelte';
	import { default_filter_options, filter_options } from '$lib/options.svelte';
	import { CircleHelp } from 'lucide-svelte';

	let filter_sockets = $state({ ...filter_options.sockets });
	let filter_levelreq = $state({ ...filter_options.levelreq });

	$effect(() => {
		filter_sockets.max = Math.min(filter_sockets.max, 6);
		filter_sockets.min = Math.max(filter_sockets.min, 2);

		if (filter_sockets.max < filter_sockets.min) {
			filter_sockets.min = filter_sockets.max;
		}

		filter_options.sockets = { ...filter_sockets };
	});

	$effect(() => {
		filter_levelreq.max = Math.min(filter_levelreq.max, 99);
		filter_levelreq.min = Math.max(filter_levelreq.min, 1);

		if (filter_levelreq.min > filter_levelreq.max) {
			filter_levelreq.max = filter_levelreq.min;
		}
		filter_options.levelreq = { ...filter_levelreq };
	});

	let versions: Versions;
	let bases: Bases;
	let required_runes: RequiredRunes;

	function reset_filter_options() {
		filter_options.search = default_filter_options.search;
		filter_options.only_can_make = default_filter_options.only_can_make;
		filter_options.ladder_d2r = default_filter_options.ladder_d2r;
		filter_options.ladder_d2lod = default_filter_options.ladder_d2lod;
		filter_options.show_d2r_only = default_filter_options.show_d2r_only;
		versions.setVersions(true);
		filter_sockets = { ...default_filter_options.sockets };
		filter_levelreq = { ...default_filter_options.levelreq };
		bases.setAllBases(true);
		required_runes.setRequiredRunes(false);
	}
</script>

<div class="flex" style="justify-content: space-between; align-items:flex-start">
	<h5>Filters</h5>
	<button class="reset outline" onclick={() => reset_filter_options()}>Reset Filters</button>
</div>
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

	<details open>
		<summary>General</summary>
		<article>
			<fieldset>
				<label
					><input
						type="checkbox"
						role="switch"
						id="can_make"
						name="can_make"
						value="can_make"
						bind:checked={filter_options.only_can_make}
					/><span style="font-weight:500">Only Show Runewords I Can Make</span>
				</label>
				<hr />
				<label
					><input
						type="checkbox"
						role="switch"
						id="compact_mode"
						name="compact_mode"
						bind:checked={filter_options.compact_mode}
					/><span>Compact Mode <span  data-tooltip="Stats will be collapsed by default."><CircleHelp size="1.25rem"/></span></span>
				</label>
				<hr />
				<label
					><input
						type="checkbox"
						role="switch"
						id="d2r_only"
						name="d2r_only"
						value="d2r_only"
						bind:checked={filter_options.show_d2r_only}
					/>
					Show
					<small
						class="warning d2r_only"
						style="display:inline-block !important"
						data-tooltip="Diablo II: Resurrected">D2R</small
					> Runewords
				</label>
				<label
					><input
						type="checkbox"
						role="switch"
						id="ladder_d2r"
						name="ladder_d2r"
						value="ladder_d2r"
						bind:checked={filter_options.ladder_d2r}
					/>
					Show
					<small
						class="warning d2r_ladder"
						style="display:inline-block !important"
						data-tooltip="Diablo II: Resurrected">D2R</small
					> Ladder-Only
				</label>
				<label
					><input
						type="checkbox"
						role="switch"
						id="ladder_d2lod"
						name="ladder_d2lod"
						value="ladder_d2lod"
						bind:checked={filter_options.ladder_d2lod}
					/>
					Show
					<small
						class="warning d2lod_ladder"
						style="display:inline-block !important;"
						data-tooltip="Diablo II: Lord of Destruction">D2LoD</small
					> Ladder-Only
				</label>
			</fieldset>
		</article>
	</details>
	<hr />
	<details>
		<summary>Versions</summary>
		<Versions bind:this={versions} />
	</details>
	<!-- <Versions bind:this={versions} /> -->
	<hr />
	<details>
		<summary>Sockets</summary>
		<div class="flex">
			<div class="all_or_none">
				<button
					class="outline"
					onclick={() => {
						filter_sockets.min = 2;
						filter_sockets.max = 6;
					}}
				>
					Reset
				</button>
			</div>
		</div>
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
	</details>
	<hr />
	<details>
		<summary>Level Required</summary>
		<div class="flex">
			<div class="all_or_none">
				<button
					class="outline"
					onclick={() => {
						filter_levelreq.min = 1;
						filter_levelreq.max = 99;
					}}
				>
					Reset
				</button>
			</div>
		</div>
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
	</details>
	<hr />
	<details>
		<summary>Bases</summary>
		<Bases bind:this={bases} />
	</details>
	<hr />
	<details>
		<summary>Required Runes</summary>
		<RequiredRunes bind:this={required_runes} />
	</details>
</aside>

<style>
	details summary {
		font-weight: 600;
		--pico-font-size: 1.125rem;
		--pico-line-height: 1.225;
		--pico-typography-spacing-top: 1.6875rem;
	}
	#filters fieldset {
		margin-bottom: 0;
	}

	.warning {
		margin-bottom: 0;
	}
	details .all_or_none {
		margin-bottom: var(--pico-spacing);
	}
</style>
