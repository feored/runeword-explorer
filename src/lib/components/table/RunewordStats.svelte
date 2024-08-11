<script lang="ts">
	let stats: string[] = $props();
</script>

<div class="stats">
	<p>{rw_stats} stats</p>
	{#each rw_stats as stat}
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
