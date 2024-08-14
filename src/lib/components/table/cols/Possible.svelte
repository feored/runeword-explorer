<script lang="ts">
	import { Check, CircleX } from 'lucide-svelte';
	let { possible }: { possible: boolean } = $props();
</script>

<div class={possible ? 'success' : 'failure'}>
	{#if possible}
		<Check size="1.5rem" />
	{:else}
		<CircleX size="1.5rem" />
	{/if}
</div>

<style>
	.success {
		color: var(--pico-primary);
	}

	.failure {
		color: #c33a32;
	}
</style>
