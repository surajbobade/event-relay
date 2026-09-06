import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, UserPlus } from 'lucide-react';
import type { AxiosError } from 'axios';
import { TextField } from '../../forms/auth/TextField';
import { PasswordField } from '../../forms/auth/PasswordField';
import { Button } from '../../forms/auth/Button';
import { createUser } from '../../api/users';
import type { ApiErrorResponse } from '../../types/Api';

const schema = z.object({
    name: z.string().min(2, 'Name is required').max(100),
    email: z.string().email('Please enter a valid email'),
    password: z
        .string()
        .min(8, 'Password must contain at least 8 characters')
        .max(64),
});

type FormValues = z.infer<typeof schema>;

export function UserCreate() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const handleCancel = () => {
        navigate('/users');
    };

    const onSubmit = async (data: FormValues) => {
        try {
            await createUser(data);
            navigate('/users');
        } catch (err: unknown) {
            const error = err as AxiosError<ApiErrorResponse>;
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Something went wrong.',
            );
        }
    };

    return (
        <div className="min-h-full p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="mb-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Users
                    </button>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create User
                    </h1>

                    <p className="mt-1 text-sm">
                        Give someone else member access to this business.
                    </p>
                </div>

                <div className="max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-5 px-6 py-6">
                            <TextField
                                label="Name"
                                type="text"
                                placeholder="Jane Doe"
                                {...register('name')}
                                error={errors.name?.message}
                            />

                            <TextField
                                label="Email"
                                type="email"
                                placeholder="jane@example.com"
                                {...register('email')}
                                error={errors.email?.message}
                            />

                            <PasswordField
                                label="Password"
                                placeholder="Enter a password"
                                {...register('password')}
                                error={errors.password?.message}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <Button
                                type="button"
                                variant="default"
                                onClick={handleCancel}>
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                loading={isSubmitting}
                                loadingText="Creating..."
                                className="inline-flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Create User
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
