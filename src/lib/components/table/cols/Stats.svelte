<script lang="ts">
	interface Stats {
		stats: Record<string, string[]>;
	}
	let { stats }: Stats = $props();
	let single_stat: boolean = $derived.by(() => {return Object.keys(stats).length === 1 && 'all' in stats});
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
	<div role="tabs">
		{#each Object.keys(stats) as stat_list_key, index}
			<button class={active_tab == index ? "active" : "inactive outline reset"} type="button" onclick={() => active_tab = index}>{stat_list_key}</button>
		{/each}
  	</div>
	{#each Object.keys(stats) as stat_list_key, index}
		<section hidden={active_tab !== index}>
			{@render stat_list_display(stats[stat_list_key])}
		</section>
	{/each}
{/snippet}

<div class="stats">
	{#if single_stat}
		{@render stat_list_display(stats['all'])}
	{:else}
		{@render stat_tabs(stats)}
	{/if}
</div>

<style>
	.stats {
		color: var(--color-magic);
	}

	.variable {
		color: #86b0ff;
	}

	[role="tabs"]{
		display:flex;
		justify-content: center;
		gap: var(--pico-spacing);
	}

	[role="tabs"] button.active {
		text-decoration: var(--pico-primary) underline;
	}

	[role="tabs"] button:not(.active) {
		color: var(--pico-secondary) !important;
	}

</style>
