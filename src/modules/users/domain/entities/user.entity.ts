export type UserList = {
  name: string;
  posts: string[];
  images: string[];
};

export type UserNotification = {
  userId: string;
  username: string;
  avatar?: string;
  message: string;
  postId?: string;
  postTitle?: string;
  read: boolean;
  createdAt: Date;
};

export class UserEntity {
  public id: string;
  public email: string;
  public name: string;
  public bio?: string;
  public avatar?: string;
  public followers: string[];
  public followings: string[];
  public lists: UserList[];
  public interests: string[];
  public ignore: string[];
  public mutedAuthor: string[];
  public notifications: UserNotification[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    id: string;
    email: string;
    name: string;
    bio?: string;
    avatar?: string;
    followers?: string[];
    followings?: string[];
    lists?: UserList[];
    interests?: string[];
    ignore?: string[];
    mutedAuthor?: string[];
    notifications?: UserNotification[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.bio = props.bio;
    this.avatar = props.avatar;
    this.followers = props.followers || [];
    this.followings = props.followings || [];
    this.lists = props.lists || [];
    this.interests = props.interests || [];
    this.ignore = props.ignore || [];
    this.mutedAuthor = props.mutedAuthor || [];
    this.notifications = props.notifications || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}

