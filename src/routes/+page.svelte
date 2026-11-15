<script lang="ts">
	import RunesGrid from '#lib/components/RuneGrid.svelte';
	import Filters from '#lib/components/filters/Filters.svelte';
	import Table from '#lib/components/table/Table.svelte';
	import SettingsDialog from '#lib/components/SettingsDialog.svelte';
	import { version } from '$app/env';
	import { Settings as SettingsIcon } from '@lucide/svelte';

	let settings_dialog: SettingsDialog;
</script>

<div class="container-fluid wrapper">
	<div id="sidebar" class="grid-sidebar">
		<div class="container">
			<Filters />
		</div>
	</div>
	<div class="grid-runes container-fluid">
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
					<button class="settings-button" onclick={() => settings_dialog.open()}
						><SettingsIcon size="1rem" /> Settings</button
					>
				</li>
				<li>
					<a href="https://github.com/feored/runeword-explorer/">Github</a>
				</li>
			</ul>
		</nav>
		<hr />
		<RunesGrid />
	</div>
	<main class="grid-main container-fluid" id="content">
		<Table />
	</main>
</div>
<SettingsDialog bind:this={settings_dialog} />

<style>
	.wrapper {
		display: grid;
		gap: var(--pico-form-element-spacing-horizontal);
		grid-template-columns: minmax(20rem, 1fr) 4fr;
		grid-template-rows: auto 1fr;
		grid-template-areas:
			'sidebar runes'
			'sidebar main';
	}

	.settings-button {
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		color: var(--pico-primary);
	}

	.grid-sidebar {
		grid-area: sidebar;
	}

	.grid-runes {
		grid-area: runes;
	}

	.grid-main {
		grid-area: main;
	}

	.wrapper #sidebar .container {
		position: sticky;
		padding: var(--pico-spacing);
		top: 0;
		max-height: 100vh;
		overflow-y: auto;
		scrollbar-width: thin;
	}

	@media (max-width: 70rem) {
		.wrapper {
			grid-template-columns: 1fr;
			grid-template-areas:
				'runes'
				'sidebar'
				'main';
		}

		.wrapper #sidebar .container {
			max-height: none;
			position: relative;
		}
	}
</style>
