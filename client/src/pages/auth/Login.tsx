import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { login } from '../../api/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCallback } from 'react';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/Api';
import { getMe } from '../../api/users';
import { AuthLayout } from '../../forms/auth/AuthLayout';
import { TextField } from '../../forms/auth/TextField';
import { PasswordField } from '../../forms/auth/PasswordField';
import { Button } from '../../forms/auth/Button';

const schema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z
        .string()
        .min(6, 'Password must contain at least 6 characters')
        .max(20),
});

type FormValues = z.infer<typeof schema>;

export function Login() {
    const navigate = useNavigate();
    const { setUser, setAccessToken } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const res = await login(data);

            setAccessToken(res.data.accessToken);

            const me = await getMe();

            setUser(me.data);

            navigate('/');
        } catch (err: unknown) {
            const error = err as AxiosError<ApiErrorResponse>;
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Something went wrong.',
            );
        }
    };

    const registerNewUser = useCallback(() => {
        navigate('/register');
    }, [navigate]);

    return (
        <AuthLayout
            title="Welcome Back 👋"
            subtitle="Log in to continue"
            footer={
                <div
                    className="cursor-pointer text-right text-sm font-medium text-[var(--primary)]"
                    onClick={registerNewUser}>
                    Register new user?
                </div>
            }>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    loadingText="Logging in...">
                    Log In
                </Button>
            </form>
        </AuthLayout>
    );
}
