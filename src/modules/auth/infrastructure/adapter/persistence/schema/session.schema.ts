import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, unique: true })
  sessionID: string;

  @Prop({ required: true })
  userID: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session); 