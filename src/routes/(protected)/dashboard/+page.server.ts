// src/routes/dashboard/+page.server.ts

import type { PageServerLoad } from './$types';
import db from '$lib/prisma';

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, Action } from '@sveltejs/kit';
import { clientSchema } from '$lib/schemas';

export const actions: Actions = {
	createClient: (async ({ request, locals }) => {
		const { userId } = locals;

		const formData = Object.fromEntries(await request.formData());

		const result = clientSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, {
				error: 'Invalid data',
				formData
			});
		}

		const { firstName, lastName, email } = result.data;

		try {
			// Check if client already exists
			const existingClient = await db.client.findUnique({
				where: { email }
			});
			if (existingClient) {
				return fail(400, {
					error: 'A client with this email already exists',
					formData
				});
			}

			// Create the client, associating it with the current user
			const newClient = await db.client.create({
				data: {
					firstName,
					lastName,
					email,
					userId // Associate the client with the current user
				}
			});

			return { success: true, client: newClient };
		} catch (error) {
			console.error('Client creation error:', error);
			return fail(500, {
				error: 'An error occurred while creating the client',
				formData
			});
		}
	}) satisfies Action,

	logout: (async ({ cookies }) => {
		// Clear the session cookie
		cookies.set('session', '', {
			path: '/',
			expires: new Date(0), // Set expiration to the past
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production'
		});

		// Redirect to the home page or login page
		return redirect(303, '/');
	}) satisfies Action
};

export const load: PageServerLoad = async ({ locals }) => {
	// Parse the session data
	const { userId } = locals;

	const user = await db.user.findUnique({
		where: { id: userId }
	});

	if (!user) {
		// If user not found, clear the invalid session and redirect to login
		cookies.delete('session', { path: '/' });
		redirect(303, '/login');
	}

	// Fetch user's clients from the database
	const clients = await db.client.findMany({
		where: { userId }
	});

	// // Return both user and clients data to be used in the page
	return {
		clients
	};
};
