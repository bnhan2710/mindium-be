import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = UserModel & Document;

@Schema({ timestamps: true })
export class UserModel {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  bio?: string;

  @Prop()
  avatar?: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  followers: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  followings: MongooseSchema.Types.ObjectId[];

  @Prop([{
    name: { type: String },
    posts: [{ type: MongooseSchema.Types.ObjectId, ref: 'Post' }],
    images: [{ type: String }],
  }])
  lists: Array<{
    name: string;
    posts: MongooseSchema.Types.ObjectId[];
    images: string[];
  }>;

  @Prop([{ type: String }])
  interests: string[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Post' }])
  ignore: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  mutedAuthor: MongooseSchema.Types.ObjectId[];

  @Prop([{
    userId: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
    username: { type: String, required: true },
    avatar: String,
    message: { type: String, required: true },
    postId: { type: MongooseSchema.Types.ObjectId, ref: 'Post' },
    postTitle: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }])
  notifications: Array<{
    userId: MongooseSchema.Types.ObjectId;
    username: string;
    avatar?: string;
    message: string;
    postId?: MongooseSchema.Types.ObjectId;
    postTitle?: string;
    read: boolean;
    createdAt: Date;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(UserModel); 