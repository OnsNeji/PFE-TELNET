import { User } from 'app/models/shared';

export class UserProfile {
    access_token: string;
    expires_in: string;
    currentUser: User;
}
