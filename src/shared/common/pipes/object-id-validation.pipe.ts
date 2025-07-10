import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (!Types.ObjectId.isValid(value)) {
            throw new BadRequestException(`Invalid ObjectId: ${value}`);
        }
        return value;
    }
}
