import mongoose, {Schema, Types } from "mongoose";
import {IUser} from "./user";

export interface IEventParticipant {
    _id: mongoose.Types.ObjectId,
    event: Types.ObjectId,
    user: IUser | null,
    xmas: IUser | null,
    days: number[],
    beers: string[],
    role: string,
    name: string
}