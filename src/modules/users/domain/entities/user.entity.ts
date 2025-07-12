export class UserEntity {
  public readonly id: string;
  public email: string;
  public name: string;
  public bio?: string;
  public avatar?: string;
  public readonly createdAt: Date;	
  public updatedAt: Date;

  constructor(
	id: string,
	email: string,
	name: string,
	bio?: string,
	avatar?: string,
	createdAt: Date = new Date(),
	updatedAt: Date = new Date()
  ) {
	this.id = id;
	this.email = email;
	this.name = name;
	this.bio = bio;
	this.avatar = avatar;
	this.createdAt = createdAt;
	this.updatedAt = updatedAt;
  }

}

