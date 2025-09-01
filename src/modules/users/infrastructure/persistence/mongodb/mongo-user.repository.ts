import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository';
import { User } from '@modules/users/domain/entities/user.entity';
import { Model } from 'mongoose';
import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';
import {
	UserDocument,
	UserModel,
} from '@modules/users/infrastructure/persistence/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoUserRepository implements IUserRepository {
	constructor(
		@InjectModel(UserModel.name)
		private readonly userModel: Model<UserDocument>,
	) {}

	async save(user: User): Promise<string> {
		const userDoc = UserMapper.toPersistence(user);
		const created = await this.userModel.create(userDoc);
		return (created._id as any).toString();
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

	async createIfNotExist(email: string, name: string, avatar?: string): Promise<User> {
		let user = await this.findByEmail(email);
		if (!user) {
			user = User.create(email, name, avatar);
			await this.save(user);
			const existingUser = await this.findByEmail(email);
			return existingUser!;
		}
		return user;
	}

	async update(user: User): Promise<void> {
		const userDoc = UserMapper.toPersistenceUpdate(user);
		await this.userModel.updateOne({ _id: user.getId().getValue() }, userDoc).exec();
	}
}
