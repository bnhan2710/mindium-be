export class UserId {
    constructor(private readonly value: string) {
        this.validate(value);
    }
    
    private validate(value: string): void {
        if (!value || value.trim().length === 0) {
            throw new Error('UserId cannot be empty');
        }
    }

    public getValue(): string {
        return this.value;
    }
}