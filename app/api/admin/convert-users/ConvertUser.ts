import OldUsers, { IOldUsers } from '@/app/models/oldusers';
import AuthUser, { IAuthUser } from "@/app/models/authuser";

export type ConvertUser = {
    oldUserId: string;
    currentUserId: string;
    deleteOldUser: boolean;
}