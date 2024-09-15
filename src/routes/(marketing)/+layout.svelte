<script lang="ts">
	import type { LayoutData } from './$types';
	let { data }: { data: LayoutData } = $props();
	import Footer from '$lib/components/Footer.svelte';
	import '../../app.css';
</script>

<header>
	<div class="container">
		<div class="flex items-center justify-between py-4">
			<div class="flex-1">
				<a href="/" class="text-lg font-bold"> StartKit </a>
			</div>
			{#if data.userId}
				<div class="flex items-center space-x-4">
					<a href="/dashboard" class="text-sm"> Dashboard </a>
				</div>
			{:else}
				<div class="flex items-center space-x-4">
					<a href="/login" class="text-sm"> Login </a>
					<a href="/register" class="text-sm"> Register </a>
				</div>
			{/if}
		</div>
	</div>
</header>

<slot></slot>
<Footer />
