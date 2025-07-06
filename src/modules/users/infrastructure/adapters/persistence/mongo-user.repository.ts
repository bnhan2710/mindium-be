import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "@modules/users/domain/ports/repositories/user.repository";
import { UserEntity } from "@modules/users/domain/entities/user.entity";
import { Model } from "mongoose";
import { UserMapper } from "@modules/users/infrastructure/mappers/user.mapper";    
import { UserDocument, UserModel } from "@modules/users/infrastructure/adapters/persistence/schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class MongoUserRepository implements IUserRepository {
    constructor(
        @InjectModel(UserModel.name)
        private readonly userModel: Model<UserDocument>,
    ) {}
    
    async save(user: UserEntity): Promise<void> {
        const userDoc = UserMapper.toPersistence(user);
        await this.userModel.create(userDoc)
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const userDoc = await this.userModel.findOne({ email }).exec();
        return userDoc ? UserMapper.toDomain(userDoc) : null;
    }

    async findById(id: string): Promise<UserEntity | null> {
        const userDoc = await this.userModel.findById(id).exec();
        return userDoc ? UserMapper.toDomain(userDoc) : null;
    }

    async createUserIfNotExists(email: string, name: string, avatar?: string): Promise<UserEntity> {
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
        return UserMapper.toDomain(existingUser);
        }
    
        const newUser = new this.userModel({
        email,
        name,
        avatar,
        });
    
        const savedUser = await newUser.save();
        return UserMapper.toDomain(savedUser);
    }
}