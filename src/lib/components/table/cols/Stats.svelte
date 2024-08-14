<script lang="ts">
	interface Stats {
		stats: Record<string, string[]>;
	}
	let { stats }: Stats = $props();
	let single_stat: boolean = $derived.by(() => {return Object.keys(stats).length === 1 && 'all' in stats});
</script>

{#snippet stat_line_display(stat)}
	{#if stat.toLowerCase().includes('varies')}
		<span class="variable">{stat}</span>
	{:else}
		<span>{stat}</span>
	{/if}
	<br />
{/snippet}

<div class="stats">
	{#if single_stat}
		{#each stats['all'] as stat}
			{@render stat_line_display(stat)}
		{/each}
	{:else}
		{#each Object.keys(stats) as statListKey}
			<h4>{statListKey}</h4>
			{#each stats[statListKey] as stat}
				{@render stat_line_display(stat)}
			{/each}
		{/each}
	{/if}
</div>

<style>
	.stats {
		color: var(--color-magic);
	}

	.variable {
		color: #86b0ff;
	}
</style>
