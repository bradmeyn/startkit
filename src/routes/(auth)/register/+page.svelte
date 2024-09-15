<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { registerSchema } from '$lib/schemas';
	import { z } from 'zod';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Card from '$lib/components/ui/Card.svelte';

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
		<p
			class="mx-auto w-fit rounded border border-red-500 bg-red-50 p-2 px-4 text-center text-red-500"
		>
			{form.error}
		</p>
	{/if}

	<Card class="mx-auto mt-8 max-w-md">
		<h1 class="mb-8 text-2xl font-semibold">Sign up</h1>
		<form method="POST" action="./register" use:enhance={submit}>
			<div class="space-y-4">
				<div class="w-full">
					<label for="name">Name</label>
					<input type="text" id="name" name="name" oninput={handleInput('name')} />
					{#if fieldErrors.name}
						{@render error(fieldErrors.name)}
					{/if}
				</div>

				<div class="w-full">
					<label for="email">Email</label>
					<input type="email" id="email" name="email" oninput={handleInput('email')} />
					{#if fieldErrors.email}
						{@render error(fieldErrors.email)}
					{/if}
				</div>

				<div class="w-full">
					<label for="password">Password</label>
					<input type="password" id="password" name="password" oninput={handleInput('password')} />
					{#if fieldErrors.password}
						{@render error(fieldErrors.password)}
					{/if}
				</div>

				<div class="w-full">
					<label for="confirmPassword">Confirm password</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						oninput={handleInput('confirmPassword')}
					/>
					{#if fieldErrors.confirmPassword}
						{@render error(fieldErrors.confirmPassword)}
					{/if}
				</div>
			</div>

			<button class="btn mt-6" type="submit">{isLoading ? '...loading' : 'Sign up'}</button>

			<p class="mt-6 text-center text-sm">
				Already have an account? <a href="/login" class="underline underline-offset-2">Login</a>
			</p>
		</form>
	</Card>
</main>

{#snippet error(message: string)}
	<p class="text-xs text-red-500">{message}</p>
{/snippet}
