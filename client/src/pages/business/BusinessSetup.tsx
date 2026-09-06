import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/Api';
import { updateMyBusiness } from '../../api/business';
import { useBusiness } from '../../hooks/useBusiness';
import { AuthLayout } from '../../forms/auth/AuthLayout';
import { TextField } from '../../forms/auth/TextField';
import { Button } from '../../forms/auth/Button';

const schema = z.object({
    name: z.string().min(2, 'Organization name is required').max(100),
});

type FormValues = z.infer<typeof schema>;

export function BusinessSetup() {
    const navigate = useNavigate();
    const { business, setBusiness } = useBusiness();

    useEffect(() => {
        if (business?.n) {
            navigate('/');
        }
    }, [business, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = useCallback(
        async (data: FormValues) => {
            try {
                const res = await updateMyBusiness(data.name);
                setBusiness(res.data);
                navigate('/');
            } catch (err: unknown) {
                const error = err as AxiosError<ApiErrorResponse>;
                toast.error(
                    error.response?.data?.message ||
                        error.message ||
                        'Something went wrong.',
                );
            }
        },
        [navigate, setBusiness],
    );

    return (
        <AuthLayout
            title="Set up your business"
            subtitle="Tell us your organization's name to get started.">
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="Organization name"
                    type="text"
                    placeholder="Acme Inc."
                    {...register('name')}
                    error={errors.name?.message}
                />
                <Button
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Saving...">
                    Continue
                </Button>
            </form>
        </AuthLayout>
    );
}
