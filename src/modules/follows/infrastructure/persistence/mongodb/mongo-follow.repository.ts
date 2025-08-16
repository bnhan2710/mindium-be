import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IFollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { Follow } from '@modules/follows/domain/entities/follow.entity';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { FollowId } from '@modules/follows/domain/value-objects/follow-id.vo';
import { FollowDocument } from '../schema/follow.schema';
import { FollowMapper } from '../../mappers/follow.mapper';
import { IPageRequest } from '@libs/common/types';

@Injectable()
export class MongoFollowRepository implements IFollowRepository {
	constructor(
		@InjectModel(FollowDocument.name)
		private readonly followModel: Model<FollowDocument>,
	) {}

	async save(follow: Follow): Promise<void> {
		const followDoc = FollowMapper.toPersistence(follow);

		await this.followModel.create(followDoc);
	}

	async delete(followId: FollowId): Promise<void> {
		await this.followModel.deleteOne({ _id: followId.getValue() });
	}

	async deleteByFollowerAndFollowee(
		followerId: UserId,
		followeeId: UserId,
	): Promise<void> {
		await this.followModel.deleteOne({
			followerId: new Types.ObjectId(followerId.getValue()),
			followeeId: new Types.ObjectId(followeeId.getValue()),
		});
	}

	async findFollowersByUserId(
		userId: UserId,
		pageRequest: IPageRequest,
	): Promise<{ followers: Follow[]; total: number }> {
		const query = { followeeId: new Types.ObjectId(userId.getValue()) };

		const { size, offset } = pageRequest;

		const [docs, total] = await Promise.all([
			this.followModel
				.find(query)
				.sort({ createdAt: -1 })
				.limit(size)
				.skip(offset)
				.exec(),
			this.followModel.countDocuments(query).exec(),
		]);

		return {
			followers: FollowMapper.toDomainMany(docs),
			total,
		};
	}

	async findFollowingByUserId(
		userId: UserId,
		pageRequest: IPageRequest,
	): Promise<{ following: Follow[]; total: number }> {
		const query = { followerId: new Types.ObjectId(userId.getValue()) };
		const { size, offset } = pageRequest;
		const [docs, total] = await Promise.all([
			this.followModel
				.find(query)
				.sort({ createdAt: -1 })
				.limit(size)
				.skip(offset)
				.exec(),
			this.followModel.countDocuments(query).exec(),
		]);
		return {
			following: FollowMapper.toDomainMany(docs),
			total,
		};
	}

	async isFollowing(followerId: UserId, followeeId: UserId): Promise<boolean> {
		const isExist = await this.followModel
			.findOne({
				followerId: new Types.ObjectId(followerId.getValue()),
				followeeId: new Types.ObjectId(followeeId.getValue()),
			})
			.exec();
		return !!isExist;
	}

	async getFollowCounts(userId: UserId): Promise<{
		followersCount: number;
		followingCount: number;
	}> {
		const userIdValue = new Types.ObjectId(userId.getValue());

		const [followersCount, followingCount] = await Promise.all([
			this.followModel.countDocuments({ followeeId: userIdValue }),
			this.followModel.countDocuments({ followerId: userIdValue }),
		]);

		return {
			followersCount,
			followingCount,
		};
	}
}
