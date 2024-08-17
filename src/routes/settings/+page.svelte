<script lang="ts">
	import { version } from '$app/environment';
	import { House, Github } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { RUNEWORDS } from '$lib/data/runewords';
	import { default_settings, settings, type ISettings } from '$lib/options.svelte';

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
	});

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
					<a href="/"><House size="1rem" /> Home</a>
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
			<small>Default: 100</small><br />
			<div role="group" class="auto-width">
				<input type="number" name="max_steps" min="0" step="1" bind:value={settings.max_steps} />
				<button onclick={() => (settings.max_steps = default_settings.max_steps)}>Reset</button>
			</div>
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
									oninput={() => settings.blacklist.push(rw)}
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
