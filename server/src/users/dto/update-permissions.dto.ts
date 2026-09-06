import { ArrayUnique, IsArray, IsIn } from 'class-validator';
import { PERMISSION_KEYS } from '../permissions.constants';

export class UpdatePermissionsDto {
    @IsArray()
    @ArrayUnique()
    @IsIn(PERMISSION_KEYS, { each: true })
    permissions!: string[];
}
