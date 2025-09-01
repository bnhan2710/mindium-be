import { ValueObject } from "@shared/domain/base/value-object";


export class FeedId extends ValueObject<string> {
    private constructor(value: string) {
        super(value);
    }

    protected validate(value: string): void {
        if (!value || value.trim().length === 0) {
            throw new Error('FeedId cannot be empty');
        }

    }
}