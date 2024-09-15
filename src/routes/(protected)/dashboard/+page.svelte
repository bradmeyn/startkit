<script lang="ts">
	import ClientTable from '$lib/components/ClientTable.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import type { PageData } from './$types';
	import CreateClient from './_components/CreateClient.svelte';

	let { data }: { data: PageData } = $props();
</script>

<main class="container mx-auto w-full border">
	<section class="container py-10">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-5xl text-zinc-800">Dashboard</h1>
				<p class="text-zinc-500">Welcome</p>
			</div>

			<div>
				<CreateClient />
			</div>
		</div>
		<h2 class="mb-2 mt-10 text-2xl text-zinc-800">Your Clients</h2>
		<Card class="mt-4">
			<ClientTable clients={data.clients} />
		</Card>
	</section>
</main>
