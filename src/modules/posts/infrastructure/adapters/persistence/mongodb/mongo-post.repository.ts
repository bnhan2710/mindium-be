import { Injectable } from '@nestjs/common';
import { IPostRepository } from '@modules/posts/domain/port/repositories/post.repository';
import { Post } from '@modules/posts/domain/entities/post.entity';
import { PostMapper } from '@modules/posts/infrastructure/mappers/post.mapper';
import {
	PostDocument,
	PostModel,
} from '@modules/posts/infrastructure/adapters/persistence/schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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

	async save(post: Post): Promise<void> {
		const postDoc = PostMapper.toPersistenceCreate(post);
		await this.postModel.create(postDoc);
	}
}
