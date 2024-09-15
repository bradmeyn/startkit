<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children,
		class: className = ''
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div class={` rounded-xl border p-6 shadow-sm ${className}`}>
	{@render children()}
</div>
