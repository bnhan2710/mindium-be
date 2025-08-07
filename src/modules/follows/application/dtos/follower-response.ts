import { UserProfileDto } from './user-profile.dto';

export class FollowersResponseDto {
	followers: {
		followerId: string;
		createdAt: Date;
		userProfile: UserProfileDto | null;
	}[];
	page: number;
	size: number;
	total: number;
}
