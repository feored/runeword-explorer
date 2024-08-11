<script lang="ts">
	import { Check, CircleX } from 'lucide-svelte';
	let { possible } = $props();
</script>

<div>
	{#if possible}
		<Check color="green" size="1.5em" />
	{:else}
		<CircleX color="red" size="1.5em" />
	{/if}
</div>
