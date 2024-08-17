<script lang="ts">
	import RunesGrid from '$lib/components/RuneGrid.svelte';
	import Filters from '$lib/components/filters/Filters.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import { version } from '$app/environment';
	import { Settings, Github } from 'lucide-svelte';
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
					<a href="/settings"><Settings size="1rem" /> Settings</a>
				</li>
				<li>
					<a href="https://github.com/feored/runeword-explorer/"><Github size="1rem" /> Github </a>
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
