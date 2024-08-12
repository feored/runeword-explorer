<script lang="ts">
	interface Stats {
		stats: string[];
	}
	let { stats }: Stats = $props();
</script>

<div class="stats">
	{#each stats as stat}
		{#if stat.toLowerCase().includes('varies')}
			<span class="variable">{stat}</span>
		{:else}
			<span>{stat}</span>
		{/if}
		<br />
	{/each}
</div>

<style>
	.stats {
		color: var(--color-magic);
	}

	.variable {
		color: #86b0ff;
	}
</style>
