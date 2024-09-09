// src/routes/dashboard/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/prisma';

export const load: PageServerLoad = async ({ cookies }) => {
	// Get the session cookie
	const session = cookies.get('session');

	console.log('session', session);

	if (!session) {
		// If there's no session, redirect to the login page
		throw redirect(303, '/login');
	}

	// Parse the session data
	const { userId } = JSON.parse(session);

	const user = await db.user.findUnique({
		where: { id: userId }
	});

	if (!user) {
		// If user not found, clear the invalid session and redirect to login
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/login');
	}

	// Fetch user's clients from the database
	const clients = await db.client.findMany({
		where: { userId }
	});

	// Return both user and clients data to be used in the page
	return {
		user,
		clients
	};
};
