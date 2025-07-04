import { User } from "../entities/user.entity";

export interface IUserRepository { 
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: Partial<User>): Promise<User>;
    createUserIfNotExists(email: string, name: string, avatar?: string): Promise<User>;
}