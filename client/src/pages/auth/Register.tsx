import { useCallback } from 'react';
import { registerNewUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/Api';
import { TextField } from '../../forms/auth/TextField';
import { PasswordField } from '../../forms/auth/PasswordField';
import { Button } from '../../forms/auth/Button';
import { AuthLayout } from '../../forms/auth/AuthLayout';

const schema = z.object({
    name: z.string().min(4).max(20),
    email: z.string().email('Please enter a valid email'),
    password: z
        .string()
        .min(6, 'Password must contain at least 6 characters')
        .max(20),
});

type FormValues = z.infer<typeof schema>;

export function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const handleRegister = useCallback(
        async (data: FormValues) => {
            try {
                await registerNewUser(data);
                navigate('/login');
            } catch (err: unknown) {
                const error = err as AxiosError<ApiErrorResponse>;
                toast.error(
                    error.response?.data?.message ||
                        error.message ||
                        'Something went wrong.',
                );
            }
        },
        [navigate],
    );

    const logUserIn = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    return (
        <AuthLayout
            title="Register"
            subtitle="We are happy to see you here!"
            footer={
                <div
                    className="mb-2 block text-sm font-medium text-[var(--primary)] text-end cursor-pointer"
                    onClick={logUserIn}>
                    Already Registered? Sign In
                </div>
            }>
            <form onSubmit={handleSubmit(handleRegister)}>
                <TextField
                    label="Name"
                    type="name"
                    placeholder="Enter your name"
                    {...register('name')}
                    error={errors.name?.message}
                />
                <TextField
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    error={errors.email?.message}
                />
                <PasswordField
                    label="Password"
                    placeholder="Enter your password"
                    {...register('password')}
                    error={errors.password?.message}
                />
                <Button
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Registering...">
                    Register
                </Button>
                <div className="text-gray-600">Todo: OTP validation</div>
            </form>
        </AuthLayout>
    );
}
