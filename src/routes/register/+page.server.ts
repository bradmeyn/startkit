import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import db from '$lib/prisma';
import type { Action, Actions } from '@sveltejs/kit';
import { registerSchema } from '$lib/schemas';

export const actions: Actions = {
	default: (async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());

		console.log('Form data:', formData);
		// Validate the form data using Zod
		const result = registerSchema.safeParse(formData);

		if (!result.success) {
			// If validation fails, return the errors
			console.log('Validation errors:', result.error.flatten().fieldErrors);
			return fail(400, {
				error: 'Invalid form data',
				data: formData
			});
		}

		const { name, email, password } = result.data;

		try {
			// Check if user already exists
			const existingUser = await db.user.findUnique({
				where: { email }
			});
			if (existingUser) {
				console.log('User already exists:', existingUser);
				return fail(400, {
					error: 'A account with this email already exists',
					data: { name, email }
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
			cookies.set('session', JSON.stringify({ userId: newUser.id, email: newUser.email }), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});

			// Redirect to a protected route or dashboard
			redirect(302, '/dashboard');
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, {
				errors: { server: 'An error occurred during registration. Please try again later.' },
				data: { name, email }
			});
		}
	}) satisfies Action
};
