import z from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Not a valid email'),
    password: z.string().min(6, 'Password length must be greater than 6'),
    confirmPassword: z.string().min(1, 'Confirm password field is required'),
    avatar: z
      .object({
        public_id: z.string().optional().nullable(),
        url: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
    courses: z
      .array(
        z
          .object({
            courseId: z.string().optional().nullable(),
          })
          .optional()
          .nullable(),
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Password don't match",
  });

export type CreateUserType = z.infer<typeof createUserSchema>;

export const loginUserSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Not a valid email'),
  password: z.string().min(6, 'Password length must be greater than 6'),
});

export const socialAuthSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Not a valid email'),
  avatar: z
    .object({
      public_id: z.string().optional().nullable(),
      url: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});
