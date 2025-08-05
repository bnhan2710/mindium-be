import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = PostModel & Document;

@Schema({ timestamps: true, collection: 'posts' })
export class PostModel {
	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	content: string;

	@Prop({ type: Types.ObjectId, ref: 'users', required: true })
	authorId: Types.ObjectId;

	@Prop({ type: [String] })
	tags: string[];

	@Prop({ required: true })
	slug: string;

	@Prop()
	summary?: string;
}


export const PostSchema = SchemaFactory.createForClass(PostModel);
