export class UserEntity {
  public id: string;
  public email: string;
  public name: string;
  public bio?: string;
  public avatar?: string;


  constructor(
	id: string,
	email: string,
	name: string,
	bio?: string,
	avatar?: string
  ) {
	this.id = id;
	this.email = email;
	this.name = name;
	this.bio = bio;
	this.avatar = avatar;
  }
}

