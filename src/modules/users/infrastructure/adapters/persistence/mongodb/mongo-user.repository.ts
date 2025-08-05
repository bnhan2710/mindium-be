import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@modules/users/domain/ports/repositories/user.repository';
import { User } from '@modules/users/domain/entities/user.entity';
import { Model } from 'mongoose';
import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';
import {
	UserDocument,
	UserModel,
} from '@modules/users/infrastructure/adapters/persistence/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoUserRepository implements IUserRepository {
	constructor(
		@InjectModel(UserModel.name)
		private readonly userModel: Model<UserDocument>,
	) {}

	async save(user: User): Promise<void> {
		const userDoc = UserMapper.toPersistenceCreate(user);
		await this.userModel.create(userDoc);
	}

	async findByEmail(email: string): Promise<User | null> {
		const userDoc = await this.userModel.findOne({ email }).exec();
		return userDoc ? UserMapper.toDomain(userDoc) : null;
	}

	async findById(id: string): Promise<User | null> {
		const userDoc = await this.userModel.findById(id).exec();
		return userDoc ? UserMapper.toDomain(userDoc) : null;
	}

	async findByIds(ids: string[]): Promise<User[]> {
		const userDocs = await this.userModel.find({ _id: { $in: ids } }).exec();
		return userDocs.map(UserMapper.toDomain);
	}

	update(user: Partial<User>): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
