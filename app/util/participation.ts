import { IEvent } from "../models/event";
import { IParticipant } from "../models/participant";
import { Get } from "./RequestHelper";

export async function getEventParticipant( event:IEvent|undefined, userId:string|undefined ){
    if( !event || !userId ) return undefined;
    const participants = await Get<IParticipant[]>(`api/events/${event.year}/participants`);
    return participants?.find( p => p.user?.toString() == userId);
}