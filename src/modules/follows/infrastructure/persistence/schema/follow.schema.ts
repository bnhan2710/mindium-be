import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
	collection: 'follows',
	timestamps: { createdAt: true, updatedAt: false },
	versionKey: false,
})
export class FollowDocument extends Document {
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	followerId: Types.ObjectId;

	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	followeeId: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(FollowDocument);

FollowSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });
FollowSchema.index({ followeeId: 1, createdAt: -1 }); // For followers list
FollowSchema.index({ followerId: 1, createdAt: -1 }); // For following list
