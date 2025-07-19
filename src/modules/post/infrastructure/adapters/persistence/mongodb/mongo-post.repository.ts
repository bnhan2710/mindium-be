import { Injectable } from '@nestjs/common';
import { IPostRepository } from '@modules/post/domain/port/repositories/post.repository';
import { Post } from '@modules/post/domain/entities/post.entity';
import { PostMapper } from '@modules/post/infrastructure/mappers/post.mapper';
import {
	PostDocument,
	PostModel,
} from '@modules/post/infrastructure/adapters/persistence/schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OffsetPagination } from '@shared/common/dtos';
import { IPageRequest } from '@shared/common/types';

@Injectable()
export class MongoPostRepository implements IPostRepository {
	constructor(
		@InjectModel(PostModel.name)
		private readonly postModel: Model<PostDocument>,
	) {}

	async findById(postId: string): Promise<Post | null> {
		const postDoc = await this.postModel.findById(postId).exec();
		return postDoc ? PostMapper.toDomain(postDoc) : null;
	}

    async findByUserId(userId: string, pageRequest: IPageRequest): Promise<Post[]> {
        const { size, offset } = pageRequest;

        const postsDocs = await this.postModel
            .find({ author: new Types.ObjectId(userId) })
            .skip(offset)
            .limit(size)
            .exec();
        return postsDocs.map(PostMapper.toDomain);
    }

	async save(post: Post): Promise<void> {
		const postDoc = PostMapper.toPersistenceCreate(post);
		await this.postModel.create(postDoc);
	}
}
