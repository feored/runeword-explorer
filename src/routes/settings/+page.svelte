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
			<h4>General</h4>
			<p>Maximum number of cubing steps to show before collapsing.</p>
			<div role="group" class="auto-width">
				<input type="number" name="max_steps" min="0" step="1" bind:value={settings.max_steps} />
				<button
					onclick={() => {
						settings.max_steps = MAX_STEPS;
					}}>Reset</button
				>
			</div>
			<br />
			<label for="expand_bases">
				<input type="checkbox" role="switch" bind:checked={settings.expand_bases} />Expand Base
				Categories
				<span
					data-tooltip="Show the full list of bases instead of the category name (Weapons, Helms, etc) and a tooltip."
					><CircleHelp size="1rem" /></span
				></label
			>

			<hr />
			<h4>Blacklist</h4>
			<small>Blacklisted runewords will never be shown.</small>
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
		</div>
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
