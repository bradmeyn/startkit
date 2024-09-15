<script lang="ts">
	import type { Client } from '@prisma/client';

	const { clients }: { clients: Client[] } = $props();
</script>

<table class="w-full">
	<thead>
		<tr>
			<th class="w-[100px] text-left">First name</th>
			<th class="text-left">Last name</th>
			<th class="text-left">Email</th>
		</tr>
	</thead>
	<tbody>
		{#each clients as c}
			{@render clientRow(c)}
		{/each}
	</tbody>
</table>

{#snippet clientRow(c: Client)}
	<tr>
		<td class="font-medium">{c.firstName}</td>
		<td>{c.lastName}</td>
		<td>{c.email}</td>
	</tr>
{/snippet}
