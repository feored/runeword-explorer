<script lang="ts">
	import '#lib/css/pico_override.css';
	import '#lib/css/style.css';

	import { onMount, type Snippet } from 'svelte';
	import { default_settings, settings, type ISettings } from '#lib/options.svelte.ts';

	let { children }: { children: Snippet } = $props();
	let loaded = $state(false);

	onMount(() => {
		try {
			const raw = localStorage.getItem('settings');

			if (raw !== null) {
				const saved: Partial<ISettings> = JSON.parse(raw);

				settings.max_steps = saved.max_steps ?? default_settings.max_steps;
				settings.profile = { ...(saved.profile ?? default_settings.profile) };
				settings.expand_bases = saved.expand_bases ?? default_settings.expand_bases;
				settings.missing_runes_cube_mode =
					saved.missing_runes_cube_mode ?? default_settings.missing_runes_cube_mode;
			}
		} catch (error) {
			console.warn('Could not restore saved settings:', error);
		}

		loaded = true;
	});

	$effect(() => {
		if (loaded) {
			localStorage.setItem('settings', JSON.stringify(settings));
		}
	});
</script>

{@render children()}
