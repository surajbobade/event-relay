import { nanoid } from 'nanoid';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class Profile {
    @Prop({
        required: true,
        trim: true,
    })
    name!: string;

    @Prop()
    avatar?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

@Schema({ _id: false })
export class Email {
    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    address!: string;

    verified?: boolean;

    @Prop()
    verifiedAt?: Date;
}

export const EmailSchema = SchemaFactory.createForClass(Email);

@Schema({ _id: false })
export class Auth {
    @Prop({
        required: true,
    })
    password!: string;

    @Prop()
    refreshTokenHash?: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

@Schema({
    timestamps: {
        createdAt: 'cAt',
        updatedAt: 'uAt',
    },
    versionKey: false,
})
export class User {
    @Prop({
        type: String,
        default: () => nanoid(),
    })
    _id!: string;

    @Prop({
        type: ProfileSchema,
        required: true,
    })
    profile!: Profile;

    @Prop({
        type: EmailSchema,
        required: true,
    })
    email!: Email;

    @Prop({
        type: AuthSchema,
        required: true,
    })
    auth!: Auth;
}

export const UserSchema = SchemaFactory.createForClass(User);
