<script lang="ts">
	import { enhance } from '$app/forms';
	import Footer from '$lib/components/Footer.svelte';
	import type { LayoutData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	let { data }: { data: LayoutData } = $props();
	import '../../app.css';
</script>

<header>
	<div class="container">
		<div class="flex items-center justify-between py-4">
			<div class="flex-1">
				<a href="/" class="text-lg font-bold"> StartKit </a>
			</div>

			<div class="flex items-center space-x-4">
				{#if data.userId}
					<form method="POST" action="?/logout">
						<button type="submit" class="text-sm hover:underline"> Logout </button>
					</form>
				{:else}
					<a href="/login" class="text-sm hover:underline">Login</a>
					<a href="/register" class="text-sm hover:underline">Register</a>
				{/if}
			</div>
		</div>
	</div>
</header>
<slot></slot>
<Footer />
