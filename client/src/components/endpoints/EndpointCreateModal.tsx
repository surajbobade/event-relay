import { z } from 'zod';
import { useForm } from 'react-hook-form';

import { Modal } from '../modal/Modal';
import { TextField } from '../../forms/auth/TextField';
import { Button } from '../../forms/auth/Button';
import { TextareaField } from '../../forms/auth/TextareaField';
import { PostfixTextField } from '../../forms/auth/PostfixTextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEndpoint } from '../../api/endpoints';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/Api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type Props = {
    open: boolean;
    onClose: () => void;
};

const schema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Endpoint name must be at least 3 characters.')
        .max(50, 'Endpoint name cannot exceed 50 characters.'),
    domain: z
        .string()
        .trim()
        .min(3, 'Endpoint must be at least 3 characters.')
        .max(50, 'Endpoint cannot exceed 50 characters.')
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Only lowercase letters, numbers and hyphens are allowed.',
        ),
    description: z
        .string()
        .trim()
        .max(200, 'Description cannot exceed 200 characters.')
        .optional()
        .or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export function CreateEndpointModal({ onClose }: Props) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, disabled },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    async function onSubmit(data: FormValues) {
        try {
            const result = await createEndpoint(data);

            onClose();
            navigate(`/endpoints/${result.data.endpointId}`);
        } catch (err) {
            const error = err as AxiosError<ApiErrorResponse>;
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Something went wrong.',
            );
        }
    }

    return (
        <Modal title="Create Endpoint" onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <TextField
                    label="Endpoint Name"
                    placeholder="Test Payment Webhook"
                    error={errors.name?.message}
                    {...register('name', {
                        required: 'Name is required',
                    })}
                />
                <PostfixTextField
                    label="Endpoint"
                    postfix=".requeststudio.com"
                    placeholder="test-payment-webhook"
                    {...register('domain', {
                        required: 'Endpoint is required',
                    })}
                    error={errors.domain?.message}
                />
                <TextareaField
                    label="Description"
                    placeholder="Describe your endpoint..."
                    rows={4}
                    {...register('description')}
                    error={errors.description?.message}
                />
                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" onClick={onClose} variant="danger">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={disabled}
                        loadingText="Creating...">
                        Create Endpoint
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
