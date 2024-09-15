<script lang="ts">
	import type { ActionData, PageData } from '../$types';
	import { enhance } from '$app/forms';
	import { clientSchema } from '$lib/schemas';
	import { z } from 'zod';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Dialog from '$lib/components/ui/Dialog.svelte';

	type Props = {
		form: ActionData;
		data: PageData;
	};

	let { form }: Props = $props();
	let isOpen = $state(false);
	let isLoading = $state(false);

	let fieldErrors = $state({
		firstName: '',
		lastName: '',
		email: ''
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
		const validation = clientSchema.safeParse({
			firstName: formData.get('firstName'),
			lastName: formData.get('lastName'),
			email: formData.get('email')
		});

		if (!validation.success) {
			mapZodErrorsToFieldErrors(validation.error);
			cancel();
			return;
		}

		return async ({ result, update }) => {
			isLoading = true;
			if (result.type === 'failure') {
				isLoading = false;
				isOpen = false;
			} else if (result.type === 'success') {
				isLoading = false;
				isOpen = false;
			}
			await update();
		};
	};

	function onClose() {
		// Reset form state when opening the dialog

		fieldErrors = {
			firstName: '',
			lastName: '',
			email: ''
		};
	}
</script>

<Dialog bind:isOpen label="Add client" title="Add client" {onClose}>
	{#if form?.error}
		<p
			class="mx-auto w-fit rounded border border-red-500 bg-red-50 p-2 px-4 text-center text-red-500"
		>
			{form?.error}
		</p>
	{/if}

	<form method="POST" action="?/createClient" use:enhance={submit} class="space-y-4">
		<div class="w-full">
			<label for="firstName" class="mb-1 block">First Name</label>
			<input
				type="text"
				id="firstName"
				name="firstName"
				oninput={handleInput('firstName')}
				class="w-full rounded border p-2"
			/>
			{#if fieldErrors.firstName}
				{@render error(fieldErrors.firstName)}
			{/if}
		</div>

		<div class="w-full">
			<label for="lastName" class="mb-1 block">Last Name</label>
			<input
				type="text"
				id="lastName"
				name="lastName"
				oninput={handleInput('lastName')}
				class="w-full rounded border p-2"
			/>
			{#if fieldErrors.lastName}
				{@render error(fieldErrors.lastName)}
			{/if}
		</div>

		<div class="w-full">
			<label for="email" class="mb-1 block">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				oninput={handleInput('email')}
				class="w-full rounded border p-2"
			/>
			{#if fieldErrors.email}
				{@render error(fieldErrors.email)}
			{/if}
		</div>

		<button class="btn" type="submit">
			{isLoading ? 'Loading...' : 'Create Account'}
		</button>
	</form>
</Dialog>

{#snippet error(message: string)}
	<p class="mt-1 text-xs text-red-500">{message}</p>
{/snippet}
