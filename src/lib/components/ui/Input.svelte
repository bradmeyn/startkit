<script>
	export let value = '';
	export let placeholder = 'Enter text';
	export let type = 'text';
</script>

<input
	{type}
	bind:value
	{placeholder}
	class="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
