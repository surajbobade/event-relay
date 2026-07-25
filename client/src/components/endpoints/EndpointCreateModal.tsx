import { useForm } from 'react-hook-form';

import { Modal } from '../modal/Modal';
import { TextField } from '../../forms/auth/TextField';
import { Button } from '../../forms/auth/Button';
import { TextareaField } from '../../forms/auth/TextareaField';
import { PostfixTextField } from '../../forms/auth/PostfixTextField';

type Props = {
    open: boolean;
    onClose: () => void;
};

type FormValues = {
    name: string;
    endpoint: string;
    method: string;
    description: string;
};

export function CreateEndpointModal({ open, onClose }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            method: 'ANY',
        },
    });

    async function onSubmit(data: FormValues) {
        console.log(data);

        // TODO:
        // await createEndpoint(data)

        onClose();
    }

    return (
        <Modal open={open} title="Create Endpoint" onClose={onClose}>
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
                    {...register('endpoint', {
                        required: 'Endpoint is required',
                    })}
                    error={errors.endpoint?.message}
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
                        loadingText="Creating...">
                        Create Endpoint
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
