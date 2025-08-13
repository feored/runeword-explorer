<script lang="ts">
	import { version } from '$app/environment';
	import { House, Github } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { RUNEWORDS } from '$lib/data/runewords';
	import { default_settings, settings, type ISettings } from '$lib/options.svelte';
	import { CircleHelp } from 'lucide-svelte';

	const MAX_STEPS = default_settings.max_steps;

	$effect(() => {
		localStorage.setItem('settings', JSON.stringify(settings));
	});

	onMount(() => {
		let local_settings = localStorage.getItem('settings');
		if (local_settings === null) {
			return;
		}
		let parsed_settings: ISettings = JSON.parse(local_settings);
		settings.max_steps = parsed_settings.max_steps || default_settings.max_steps;
		settings.blacklist = parsed_settings.blacklist || default_settings.blacklist;
		settings.expand_bases = parsed_settings.expand_bases || default_settings.expand_bases;
		settings.missing_runes_cube_mode =
			parsed_settings.missing_runes_cube_mode || default_settings.missing_runes_cube_mode;
	});

	function toggleBlacklist(rw: string): void {
		let index = settings.blacklist.indexOf(rw);
		if (index > -1) {
			settings.blacklist.splice(index, 1);
		} else {
			settings.blacklist.push(rw);
		}
	}

	let rw_names = RUNEWORDS.map((rw) => rw.name).sort();
</script>

<div class="container-fluid">
	<nav>
		<ul>
			<li>
				<strong>
					Runeword Explorer v{version}
				</strong>
			</li>
		</ul>
		<ul>
			<li>
				<a href="./"><House size="1rem" /> Home</a>
			</li>
			<li>
				<a href="https://github.com/feored/runeword-explorer/"><Github size="1rem" /> Github </a>
			</li>
		</ul>
	</nav>
	<hr />
	<div class="container">
		<h3>Settings</h3>

		<article>
			<header>
				<b>Max Cubing Steps</b>
				<p><small>Maximum number of cubing steps to show before collapsing.</small></p>
			</header>
			<div role="group" class="auto-width">
				<input type="number" name="max_steps" min="0" step="1" bind:value={settings.max_steps} />
				<button
					onclick={() => {
						settings.max_steps = MAX_STEPS;
					}}>Reset</button
				>
			</div>
		</article>
		<article>
			<header>
				<b>Expand Bases</b>
				<p>
					<small>
						Show the full list of bases instead of the category name (Weapons, Helms, etc) and a
						tooltip.</small
					>
				</p>
			</header>
			<label for="expand_bases">
				<input type="checkbox" role="switch" bind:checked={settings.expand_bases} />Expand Base
				Categories
			</label>
		</article>
		<article>
			<header>
				<b>Missing Runes Calculation</b>
				<p>
					<small>
						Calculate missing runes based on the least rune value required while taking into account
						cubing.<br /> Example: If you're missing an Um, but you have a Pul, suggest a Pul (to
						cube the two Puls into the Um.)<br /> Turn off to have the normal missing rune calc (e.g
						if you're missing an Um, show Um).
					</small>
				</p>
			</header>
			<label for="missing_runes_cube_mode">
				<input
					type="checkbox"
					role="switch"
					bind:checked={settings.missing_runes_cube_mode}
				/>Extended Missing Runes Calculation
			</label>
		</article>
		<article>
			<header>
				<h4>Blacklist</h4>
				<small>Blacklisted runewords will never be shown.</small>
			</header>
			<table id="blacklist-table">
				<thead>
					<tr>
						<th>Runeword</th>
						<th>Blacklisted</th>
					</tr>
				</thead>
				<tbody>
					{#each rw_names as rw}
						<tr>
							<td>{rw}</td>
							<td>
								<input
									type="checkbox"
									role="switch"
									checked={settings.blacklist.includes(rw)}
									oninput={() => toggleBlacklist(rw)}
								/>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<button onclick={() => (settings.blacklist = [])}>Reset Blacklist</button>
		</article>
	</div>
</div>

<style>
	#blacklist-table {
		width: max-content;
		overflow: auto;
		display: block;
		max-height: 50vh;
	}
</style>
