export class User{

  public readonly id: string; 
  public email: string;
  public name: string;
  public bio?: string;
  public avatar?: string;
  public followers: string[]; 
  public followings: string[]; 
  public interests: string[];
  public ignore: string[];
  public mutedAuthor: string[]; 
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    id: string;
    email: string;
    name: string;
    bio?: string;
    avatar?: string;
    followers?: string[];
    followings?: string[];
    interests?: string[];
    ignore?: string[];
    mutedAuthor?: string[];
  }) {
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.bio = props.bio;
    this.avatar = props.avatar;
    this.followers = props.followers || [];
    this.followings = props.followings || [];
    this.interests = props.interests || [];
    this.ignore = props.ignore || [];
    this.mutedAuthor = props.mutedAuthor || [];
  }
}