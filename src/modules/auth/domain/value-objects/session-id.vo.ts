import { v4 } from "uuid";

export class SessionId {
    constructor(private readonly value: string) {
        this.validate(value);
    }
    
    private validate(value: string): void {
        if (!value || !this.isValidUUID(value)) {
            throw new Error('Invalid session ID');
        }
    }
    
    private isValidUUID(value: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }
    
    public static generate(): SessionId {
        const uuid = v4();
        return new SessionId(uuid);
    }
}
