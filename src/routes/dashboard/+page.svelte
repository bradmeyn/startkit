<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="container mx-auto w-full border">
	<section class="container py-10">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-5xl text-zinc-800">Dashboard</h1>
				<p class="text-zinc-500">Welcome {data.user.name}</p>
			</div>

			<a href="/add-client" class="rounded bg-zinc-900 p-3 text-white"> Add client </a>
		</div>
		<h2 class="mb-2 mt-10 text-2xl text-zinc-800">Your Clients</h2>
		{#if data.clients.length > 0}
			<ul>
				{#each data.clients as client}
					<li class="mb-2">{client.name}</li>
				{/each}
			</ul>
		{:else}
			<p class="text-zinc-500">You don't have any clients yet.</p>
		{/if}
	</section>
</main>
