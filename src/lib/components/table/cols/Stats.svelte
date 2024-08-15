<script lang="ts">
	interface Stats {
		stats: Record<string, string[]>;
		compact: boolean;
	}
	let { stats, compact }: Stats = $props();
	let single_stat: boolean = $derived.by(() => {
		return Object.keys(stats).length === 1 && 'all' in stats;
	});
	let active_tab = $state(0);
</script>

{#snippet stat_line_display(stat)}
	{#if stat.toLowerCase().includes('varies')}
		<span class="variable">{stat}</span>
	{:else}
		<span>{stat}</span>
	{/if}
	<br />
{/snippet}

{#snippet stat_list_display(stats)}
	{#each stats as stat}
		{@render stat_line_display(stat)}
	{/each}
{/snippet}

{#snippet stat_tabs(stats)}
	<div class="tabs">
		{#each Object.keys(stats) as stat_list_key, index}
			<button
				class={active_tab == index ? 'active' : 'inactive outline reset'}
				type="button"
				onclick={() => (active_tab = index)}>{stat_list_key}</button
			>
		{/each}
	</div>
	{#each Object.keys(stats) as stat_list_key, index}
		<section hidden={active_tab !== index}>
			{@render stat_list_display(stats[stat_list_key])}
		</section>
	{/each}
{/snippet}

{#snippet stats_cell(stats)}
	{#if single_stat}
		{@render stat_list_display(stats['all'])}
	{:else}
		{@render stat_tabs(stats)}
	{/if}
{/snippet}

<div class="stats">
	{#if compact}
		<details>
			<summary></summary>
			{@render stats_cell(stats)}
		</details>
	{:else}
		{@render stats_cell(stats)}
	{/if}
</div>

<style>
	details[open] summary::before {
		content: 'Hide';
	}

	details:not([open]) summary::before {
		content: 'Show';
	}

	.stats {
		color: var(--color-magic);
	}

	.variable {
		color: #86b0ff;
	}

	.tabs {
		display: flex;
		justify-content: center;
		gap: var(--pico-spacing);
	}

	.tabs button.active {
		text-decoration: var(--pico-primary) underline;
	}

	.tabs button:not(.active) {
		color: var(--pico-secondary) !important;
	}
</style>
