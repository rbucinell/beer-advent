import { IParticipant } from "./participant";
import { IUser } from "./user";

export function ParticipantName(p:IParticipant | null ): string {
    if( !p ) return '';
    return Capitalize(p.name);
}


export function Capitalize( name:string): string {
    return name.substring(0,1).toUpperCase()+ name.substring(1);
}