import type { Actions, Action } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import db from '$lib/prisma';
import { registerSchema } from '$lib/schemas';

export const actions: Actions = {
	default: (async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());

		const result = registerSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, {
				error: 'Invalid data'
			});
		}

		const { name, email, password } = result.data;

		try {
			// Check if user already exists
			const existingUser = await db.user.findUnique({
				where: { email }
			});
			if (existingUser) {
				return fail(400, {
					error: 'An account with this email already exists'
				});
			}

			// Hash the password
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			// Create the user
			const newUser = await db.user.create({
				data: {
					name,
					email,
					password: hashedPassword
				}
			});

			// Set session data
			cookies.set('session', JSON.stringify({ userId: newUser.id }), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, {
				error: 'An error occurred while registering'
			});
		}

		// Redirect to a protected route or dashboard
		return redirect(303, '/dashboard');
	}) satisfies Action


};
