import { IParticipant } from "./participant";

export function ParticipantName(p:IParticipant): string {
    return p && p.name ? Capitalize(p.name): '';
}

export function Capitalize( name:string): string {
    return name.substring(0,1).toUpperCase()+ name.substring(1);
}