import { Injectable } from "@nestjs/common";
import { UserEntity,UserList,UserNotification } from "../../domain/entities/user.entity";
import { UserDocument } from "../adapters/persistence/schema/user.schema";
import { Types } from "mongoose";


export class UserMapper {
 static toDomain(user:  UserDocument): UserEntity {
    const notifications: UserNotification[] = user.notifications.map(n => ({
      userId: n.userId.toString(),
      username: n.username,
      avatar: n.avatar,
      message: n.message,
      postId: n.postId?.toString(),
      postTitle: n.postTitle,
      read: n.read,
      createdAt: n.createdAt,
    }));
    const lists: UserList[] = user.lists.map(list => ({
      name: list.name,
      posts: list.posts.map(postId => postId.toString()),
      images: list.images,
    }));
    return new UserEntity({
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        followers: user.followers.map(followerId => followerId.toString()),
        followings: user.followings.map(followingId => followingId.toString()),
        lists: lists,
        interests: user.interests,
        ignore: user.ignore.map(ignoreId => ignoreId.toString()),
        mutedAuthor: user.mutedAuthor.map(mutedId => mutedId.toString()),
        notifications: notifications,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
    });
}
  static toPersistence(user: UserEntity): UserDocument {
      const notifications = user.notifications.map(n => ({
        userId: new Types.ObjectId(n.userId),
        username: n.username,
        avatar: n.avatar,
        message: n.message,
        postId: n.postId ? new Types.ObjectId(n.postId) : undefined,
        postTitle: n.postTitle,
        read: n.read,
        createdAt: n.createdAt,
      }));
      const lists = user.lists.map(list => ({
        name: list.name,
        posts: list.posts.map(postId => new Types.ObjectId(postId)),
        images: list.images,
      }));
      return {
          email: user.email,
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          followers: user.followers.map(followerId => new Types.ObjectId(followerId)),
          followings: user.followings.map(followingId => new Types.ObjectId(followingId)),
          lists: lists,
          interests: user.interests,
          ignore: user.ignore.map(ignoreId => new Types.ObjectId(ignoreId)),
          mutedAuthor: user.mutedAuthor.map(mutedId => new Types.ObjectId(mutedId)),
          notifications: notifications,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
      } as unknown as UserDocument;
    }
 
}

