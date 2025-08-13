import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SessionDocument = SessionModel & Document;

@Schema({ timestamps: true, collection: 'sessions' })
export class SessionModel {
	@Prop({ required: true, unique: true })
	sessionID: string;

	@Prop({ required: true })
	userID: string;
}

export const SessionSchema = SchemaFactory.createForClass(SessionModel);
