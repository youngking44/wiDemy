import z from 'zod';

export const activateUserSchema = z.object({
  activation_token: z.string().min(1, 'Activation token is required'),
  activation_code: z.string().min(1, 'Activation code is required'),
});
