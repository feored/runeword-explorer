<script lang="ts">
	import RunesGrid from '$lib/components/RuneGrid.svelte';
	import Filters from '$lib/components/filters/Filters.svelte';
	import Table from '$lib/components/table/Table.svelte';
</script>

<div class="container mx-auto p-4">
	<header>
		<h1 class="text-xl font-semibold">Runeword Calculator</h1>
	</header>
	<RunesGrid />

	<div class="flex gap-4">
		<div class="flex-initial basis-1/4">
			<Filters />
		</div>
		<div class="grow">
			<Table />
		</div>
	</div>
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
