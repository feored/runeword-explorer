<script lang="ts">
	import { version } from '$app/environment';
	import { House, Github } from 'lucide-svelte';
	import { onMount } from 'svelte';
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
		for (let key in default_settings) {
			console.log('Setting', key, 'to', parsed_settings[key as keyof typeof default_settings]);
			settings[key as keyof typeof default_settings] =
				parsed_settings[key as keyof typeof default_settings];
		}
	});
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
			<h3>General</h3>
			<p>Maximum number of cubing steps to show before collapsing. (Default: 100)</p>
			<div role="group" class="auto-width">
				<input type="number" name="max_steps" min="0" step="1" bind:value={settings.max_steps} />
				<button onclick={() => (settings.max_steps = default_settings.max_steps)}>Reset</button>
			</div>
		</div>
	</div>
</div>
