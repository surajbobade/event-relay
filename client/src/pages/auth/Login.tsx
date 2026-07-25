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
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
                    Welcome Back
                </h1>

                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        {...register('email')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-violet-500"
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        {...register('password')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-violet-500"
                    />

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60">
                    {isSubmitting ? 'Signing in...' : 'Login'}
                </button>
                <div
                    className="mb-2 block text-sm font-medium text-violet-600 text-end cursor-pointer"
                    onClick={registerNewUser}>
                    Register new user?
                </div>
            </form>
        </div>
    );
}
