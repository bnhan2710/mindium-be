import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
	collection: 'follows',
	timestamps: true,
	versionKey: false,
})
export class FollowDocument extends Document {
	@Prop({ required: true, index: true })
	followerId: string;

	@Prop({ required: true, index: true })
	followeeId: string;

	@Prop({ default: Date.now })
	createdAt: Date;
}

export const FollowSchema = SchemaFactory.createForClass(FollowDocument);

FollowSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });
FollowSchema.index({ followeeId: 1, createdAt: -1 }); // For followers list
FollowSchema.index({ followerId: 1, createdAt: -1 }); // For following list
