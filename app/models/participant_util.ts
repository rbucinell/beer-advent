import { IEventParticipant } from "./event-participant";

export function ParticipantName(p:IEventParticipant): string {
    console.log( JSON.stringify(p));
    return p && p.name ? Capitalize(p.name): p._id.toString();
}

export function Capitalize( name:string): string {
    return name.substring(0,1).toUpperCase()+ name.substring(1);
}