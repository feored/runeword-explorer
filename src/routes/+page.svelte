<script lang="ts">
	import RunesGrid from '$lib/components/RuneGrid.svelte';
	import Filters from '$lib/components/filters/Filters.svelte';
	import Table from '$lib/components/table/Table.svelte';
</script>

<div class="wrapper">
	<div id="sidebar" class="grid-sidebar">
		<div class="container">
			<Filters />
		</div>
	</div>
	<div class="container-fluid grid-runes">
		<header>
			<h4 class="text-center">Runeword Calculator</h4>
		</header>
		<RunesGrid />
	</div>
	<main class="container-fluid grid-main" id="content">
		<Table />
	</main>
</div>

<style>
	.wrapper {
		display: grid;
		gap: var(--pico-spacing);
		grid-template-columns: minmax(30em, 1fr) 3fr;
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
	}

	@media (max-width: 100em) {
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
</style>
