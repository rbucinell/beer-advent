import { IParticipant } from "./participant";

export function ParticipantName(p:IParticipant): string {
    if(p && p.name)
        return p.name.substring(0,1).toUpperCase()+ p.name.substring(1);
    else
        return ""
}