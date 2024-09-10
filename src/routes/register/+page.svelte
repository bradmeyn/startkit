<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { registerSchema } from '$lib/schemas';
	import { z } from 'zod';
	import type { SubmitFunction } from '@sveltejs/kit';

	type Props = {
		form: ActionData;
		data: PageData;
	};

	let { form }: Props = $props();
	let isLoading = $state(false);
	let serverError = $state('');
	let fieldErrors = $state({
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

	const submit: SubmitFunction = async ({ formData, cancel }) => {
		const validation = registerSchema.safeParse({
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword')
		});

		if (!validation.success) {
			mapZodErrorsToFieldErrors(validation.error);
			cancel();
			return;
		}

		return async ({ result, update }) => {
			isLoading = true;
			console.log(result);
			switch (result.type) {
				case 'failure':
					isLoading = false;
					serverError = result?.data?.error || 'An error occurred';
				default:
					break;
			}
			await update();
		};
	};
</script>

<main>
	{#if form?.error}
		<p class="text-center text-red-500">{form.error}</p>
	{/if}
	<Card.Root class="mx-auto mt-10 max-w-md">
		<Card.Header>
			<Card.Title>Sign up</Card.Title>
		</Card.Header>
		<form method="POST" action="./register" use:enhance={submit}>
			<Card.Content>
				<div class="space-y-4">
					<div>
						<Label for="name">Name</Label>
						<Input type="text" id="name" name="name" on:input={handleInput('name')} />
						{#if fieldErrors.name}
							{@render error(fieldErrors.name)}
						{/if}
					</div>

					<div>
						<Label for="email">Email</Label>
						<Input type="email" id="email" name="email" on:input={handleInput('email')} />
						{#if fieldErrors.email}
							{@render error(fieldErrors.email)}
						{/if}
					</div>

					<div>
						<Label for="password">Password</Label>
						<Input
							type="password"
							id="password"
							name="password"
							on:input={handleInput('password')}
						/>
						{#if fieldErrors.password}
							{@render error(fieldErrors.password)}
						{/if}
					</div>

					<div>
						<Label for="confirmPassword">Confirm password</Label>
						<Input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							on:input={handleInput('confirmPassword')}
						/>
						{#if fieldErrors.confirmPassword}
							{@render error(fieldErrors.confirmPassword)}
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

{#snippet error(message: string)}
	<p class="text-xs text-red-500">{message}</p>
{/snippet}
