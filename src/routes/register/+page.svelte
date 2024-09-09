<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	import { registerSchema } from '$lib/schemas';
	import { z } from 'zod';
	let form: ActionData = $props();
	let isLoading = $state(false);
	let serverError = $state('');

	let fieldErrors = $state({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	let formData = $state({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	function handleInput(field: keyof typeof fieldErrors) {
		return () => {
			fieldErrors[field] = '';
		};
	}

	function mapZodErrorsToFieldErrors(errors: z.ZodError) {
		const { fieldErrors: mapped } = errors.flatten();
		fieldErrors = { ...fieldErrors, ...mapped };
	}
</script>

<main>
	{#if form?.error}
		<p class="text-center text-red-500">{form.error}</p>
	{/if}
	<Card.Root class="mx-auto mt-10 max-w-md">
		<Card.Header>
			<Card.Title>Sign up</Card.Title>
		</Card.Header>
		<form
			method="POST"
			action="./register"
			use:enhance={({ formData, cancel }) => {
				isLoading = true;
				const validation = registerSchema.safeParse({
					name: formData.get('name'),
					email: formData.get('email'),
					password: formData.get('password'),
					confirmPassword: formData.get('confirmPassword')
				});

				if (!validation.success) {
					mapZodErrorsToFieldErrors(validation.error);
					isLoading = false;
					cancel();
					return;
				}

				// Clear all errors before submitting
				fieldErrors = {
					name: '',
					email: '',
					password: '',
					confirmPassword: ''
				};
				isLoading = false;

				return async ({ result }) => {
					if (result.type === 'redirect') {
						// Maybe show a "Registration successful!" message
						// The redirect will happen automatically
						alert('Registration successful!');
					} else if (result.type === 'failure') {
						// Handle errors as before
						serverError = result.error;
						alert('Registration failed!');
					}
				};
			}}
		>
			<Card.Content>
				<div class="space-y-4">
					<div>
						<Label for="name">Name</Label>
						<Input
							type="text"
							id="name"
							name="name"
							bind:value={formData.name}
							on:input={handleInput('name')}
						/>
						{#if fieldErrors.name}
							<p class="error">{fieldErrors.name}</p>
						{/if}
					</div>

					<div>
						<Label for="email">Email</Label>
						<Input
							type="email"
							id="email"
							name="email"
							bind:value={formData.email}
							on:input={handleInput('email')}
						/>
						{#if fieldErrors.email}
							<p class="error">{fieldErrors.email}</p>
						{/if}
					</div>

					<div>
						<Label for="password">Password</Label>
						<Input
							type="password"
							id="password"
							name="password"
							bind:value={formData.password}
							on:input={handleInput('password')}
						/>
						{#if fieldErrors.password}
							<p class="error">{fieldErrors.password}</p>
						{/if}
					</div>

					<div>
						<Label for="confirmPassword">Confirm password</Label>
						<Input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							bind:value={formData.confirmPassword}
							on:input={handleInput('confirmPassword')}
						/>
						{#if fieldErrors.confirmPassword}
							<p class="error">{fieldErrors.confirmPassword}</p>
						{/if}
					</div>
				</div>
			</Card.Content>
			<Card.Footer>
				<Button type="submit">{isLoading ? '...loading' : 'Sign up'}</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</main>
