import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export const registerSchema = z.object({
	name: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
	confirmPassword: z.string().min(8)
});

export const clientSchema = z.object({
	firstName: z.string().min(3),
	lastName: z.string().min(3),
	email: z.string().email()
});

export type LoginSchema = typeof loginSchema;
