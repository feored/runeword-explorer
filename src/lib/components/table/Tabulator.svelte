<script>
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onMount } from 'svelte';

	let { data, columns } = $props();

	let tableComponent;

	onMount(() => {
		new Tabulator(tableComponent, {
			layout: 'fitDataFill',
			data: data, //link data to table
			reactiveData: true, //enable data reactivity
			columns: columns //define table columns
		});
	});
</script>

<div bind:this={tableComponent}></div>

<svelte:head>
	<link
		href="https://unpkg.com/tabulator-tables@4.9.1/dist/css/tabulator.min.css"
		rel="stylesheet"
	/>
</svelte:head>
