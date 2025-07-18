// import { Post } from "@modules/posts/domain/entities/post.entity";
// import { Tag } from "@modules/posts/domain/value-objects/tag";
// import { PostDocument } from '../adapters/persistence/schemas/post.schema';
// import { Types } from 'mongoose';

// export class PostMapper {
//     static toDomain(postDoc: PostDocument): Post {
//         const tags = postDoc.tags.map(tag => Tag.create(tag));
//         return new Post(
//             postDoc._id.toString(),
//             postDoc.title,
//             postDoc.content,
//             postDoc.author.toString(),
//             tags,
//             postDoc.createdAt,
//             postDoc.updatedAt,
//             postDoc.summary
//         );
//     }

//     static toPersistence(post: Post): Partial<PostDocument> {
//         return {
//             _id: new Types.ObjectId(post.getId().getValue()),
//             title: post.getTitle(),
//             content: post.getContent(),
//         }
//     }

// }