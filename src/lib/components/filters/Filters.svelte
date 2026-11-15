<script lang="ts">
	import Bases from '#lib/components/filters/filters/Bases.svelte';
	import IntroducedIn from '#lib/components/filters/filters/IntroducedIn.svelte';
	import RequiredRunes from '#lib/components/filters/filters/RequiredRunes.svelte';
	import Profile from '#lib/components/filters/filters/Profile.svelte';
	import { default_filter_options, filter_options } from '#lib/options.svelte.ts';

	let filter_sockets = $state({ ...filter_options.sockets });
	let filter_levelreq = $state({ ...filter_options.levelreq });
	let root_element: HTMLElement;

	$effect(() => {
		filter_sockets.max = Math.min(Math.max(filter_sockets.max, filter_sockets.min), 6);
		filter_sockets.min = Math.min(Math.max(filter_sockets.min, 2), filter_sockets.max);

		filter_options.sockets = { ...filter_sockets };
	});

	$effect(() => {
		filter_levelreq.max = Math.min(Math.max(filter_levelreq.max, filter_levelreq.min), 99);
		filter_levelreq.min = Math.min(Math.max(filter_levelreq.min, 1), filter_levelreq.max);

		filter_options.levelreq = { ...filter_levelreq };
	});

	let introduced_in: IntroducedIn;
	let bases: Bases;
	let required_runes: RequiredRunes;

	function reset_filter_options() {
		filter_options.search = default_filter_options.search;
		filter_options.only_can_make = default_filter_options.only_can_make;
		introduced_in.set_all(true);
		filter_sockets = { ...default_filter_options.sockets };
		filter_levelreq = { ...default_filter_options.levelreq };
		bases.setAllBases(true);
		required_runes.setRequiredRunes(false);
		root_element.querySelectorAll('details:not(.always_open)').forEach((details) => {
			details.removeAttribute('open');
		});
	}
</script>

<div class="flex" style="justify-content: space-between; align-items:flex-start">
	<h5>Filters</h5>
	<button class="reset outline" onclick={() => reset_filter_options()}>Reset All Filters</button>
</div>
<hr />
<aside id="filters" bind:this={root_element}>
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

	<details open class="always_open">
		<summary>Game</summary>
		<Profile />
	</details>
	<hr />
	<details open class="always_open">
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
					/><span>Compact Mode</span>
				</label>
			</fieldset>
		</article>
	</details>
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
	<hr />
	<details>
		<summary>Introduced in</summary>
		<IntroducedIn bind:this={introduced_in} />
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
	details .all_or_none {
		margin-bottom: var(--pico-spacing);
	}
</style>
