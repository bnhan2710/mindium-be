import { UserProfileDto } from "./user-profile.dto";

export class FollowingResponseDto {
    
    following: {
        followeeId: string;
        createdAt: Date;
        userProfile: UserProfileDto | null;
    }[];
    page: number;
    size: number
    total: number;
}
