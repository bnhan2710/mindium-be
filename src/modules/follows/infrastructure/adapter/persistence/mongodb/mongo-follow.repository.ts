import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { Follow } from '@modules/follows/domain/entities/follow.entity';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { FollowId } from '@modules/follows/domain/value-objects/follow-id.vo';
import { FollowDocument } from '../schema/follow.schema';
import { FollowMapper } from '../../../mappers/follow.mapper';

@Injectable()
export class MongoFollowRepository implements FollowRepository {
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
			followerId: followerId.getValue(),
			followeeId: followeeId.getValue(),
		});
	}

	async findByFollowerAndFollowee(
		followerId: UserId,
		followeeId: UserId,
	): Promise<Follow | null> {
		const doc = await this.followModel.findOne({
			followerId: followerId.getValue(),
			followeeId: followeeId.getValue(),
		});

		return doc ? FollowMapper.toDomain(doc) : null;
	}

	async findFollowersByUserId(
		userId: UserId,
		limit?: number,
		offset?: number,
	): Promise<{ followers: Follow[]; total: number }> {
		const query = { followeeId: userId.getValue() };

		const [docs, total] = await Promise.all([
			this.followModel
				.find(query)
				.sort({ createdAt: -1 })
				.limit(limit || 0)
				.skip(offset || 0)
				.exec(),
			this.followModel.countDocuments(query),
		]);

		return {
			followers: FollowMapper.toDomainMany(docs),
			total,
		};
	}

	async findFollowingByUserId(
		userId: UserId,
		limit?: number,
		offset?: number,
	): Promise<{ following: Follow[]; total: number }> {
		const query = { followerId: userId.getValue() };

		const [docs, total] = await Promise.all([
			this.followModel
				.find(query)
				.sort({ createdAt: -1 })
				.limit(limit || 0)
				.skip(offset || 0)
				.exec(),
			this.followModel.countDocuments(query),
		]);

		return {
			following: FollowMapper.toDomainMany(docs),
			total,
		};
	}

	async isFollowing(followerId: UserId, followeeId: UserId): Promise<boolean> {
		const count = await this.followModel.countDocuments({
			followerId: followerId.getValue(),
			followeeId: followeeId.getValue(),
		});

		return count > 0;
	}

	async getFollowCounts(userId: UserId): Promise<{
		followersCount: number;
		followingCount: number;
	}> {
		const userIdValue = userId.getValue();

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
