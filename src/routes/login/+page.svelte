<script lang="ts">
	import type { ActionData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { onMount } from 'svelte';

	let form: ActionData = $props();
	onMount(() => {
		console.log('form', form);
	});

	let email = $state('');
	let password = $state('');

	let fieldErrors = $state({
		email: '',
		password: ''
	});
</script>

<main>
	{#if form?.error}
		<p class="text-center text-red-500">{form.error}</p>
	{/if}
	<Card.Root class="mx-auto mt-10 max-w-md">
		<Card.Header>
			<Card.Title>Card Title</Card.Title>
		</Card.Header>
		<form method="POST" action="./login">
			<Card.Content>
				<div class="space-y-4">
					<div>
						<Label for="email">Email</Label>
						<Input type="email" id="email" name="email" bind:value={email} />
						{#if fieldErrors.email}
							<p class="error">{fieldErrors.email[0]}</p>
						{:else if form?.errors?.email}
							<p class="error">{form.errors.email}</p>
						{/if}
					</div>

					<div>
						<Label for="password">Password</Label>
						<Input type="password" id="password" name="password" bind:value={password} />
						{#if fieldErrors.password}
							<p class="error">{fieldErrors.password[0]}</p>
						{:else if form?.errors?.password}
							<p class="error">{form.errors.password}</p>
						{/if}
					</div>
				</div>
			</Card.Content>
			<Card.Footer>
				<Button type="submit">Login</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</main>

<style>
	.error {
		border-color: red;
	}
	p.error {
		color: red;
		font-size: 0.8em;
	}
</style>
