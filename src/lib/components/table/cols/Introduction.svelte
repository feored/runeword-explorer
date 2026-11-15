<script lang="ts">
	import type { Introduction } from '#lib/data/runewords.ts';
	import { EDITIONS } from '#lib/data/rulesets.ts';

	let { introduction }: { introduction: Introduction } = $props();
</script>

<div>
	<p>{EDITIONS[introduction.edition]} {introduction.patch}</p>
</div>
