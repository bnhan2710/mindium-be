export class Session {
    public readonly sessionId: string;
    public readonly userId: string;

    constructor(prop: { sessionId: string; userId: string }) {
        this.sessionId = prop.sessionId;
        this.userId = prop.userId;
    }
}