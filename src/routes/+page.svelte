<script lang="ts">
	import RunesGrid from '$lib/components/RuneGrid.svelte';
	import Filters from '$lib/components/filters/Filters.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import { version } from '$app/environment';
	import { Github } from 'lucide-svelte';
</script>

<div class="container-fluid wrapper">
	<div id="sidebar" class="grid-sidebar">
		<div class="container">
			<Filters />
		</div>
	</div>
	<div class="grid-runes container-fluid">
		<header>
			<div class="version">
				<h6>Runeword Explorer v{version}</h6>
				<a href="https://github.com/feored/runewords"><Github size="1rem" /></a>
			</div>
		</header>
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

	header {
		padding-block: var(--pico-block-spacing-vertical);
	}

	.version {
		justify-content: end;
		display: flex;
		gap: var(--pico-spacing);
	}
</style>
