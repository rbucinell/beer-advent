import mongoose, {Schema, Types } from "mongoose";
import { User } from "@clerk/backend";

export interface IEventParticipant {
    _id: mongoose.Types.ObjectId,
    event: Types.ObjectId,
    user: User | null,
    xmas: User | null,
    days: number[],
    beers: string[],
    role: string,
    name: string
}