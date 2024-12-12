import useSWR from "swr";
import { fetcher } from "@lib/swr";
import { IEvent } from "@models/event";
import { IParticipant } from "@models/participant";
import { IUser } from "@models/user";
import { IBeer } from "../models/beer";

export function useEvent( options: { year?: number|string, id?: string } = {} ) {
    const { year, id } = options;
    console.log(year, id);
    let path = null;
    if( id ){
        path = `/api/event/${id}`
    }else if( year ) {
        path = `/api/event?year=${year}`
    }
    const { data, error, isLoading } = useSWR<IEvent, Error>(path, fetcher);
    return { event: data, eventError:error, eventLoading:isLoading }; 
}

export function useEventParticipants( event:IEvent|undefined ) {
    const shouldFetch = event?._id !== undefined ? `/api/event/${event._id}/participants` : null;
    const { data, error, isLoading } = useSWR<IParticipant[], Error>(shouldFetch, fetcher);
    return { participants: data, participantsError: error, participantsLoading: isLoading };
}

export function useUser( userId: string|undefined ) {
    const shouldFetch = userId ? `/api/user/${userId}`: null;
    const { data, error, isLoading } = useSWR<IUser, Error>(shouldFetch, fetcher);
    return { user: data, userError: error, userLoading: isLoading };
}

export function useBeers() {
    const { data, error, isLoading } = useSWR<IBeer[], Error>(`/api/beer`, fetcher);
    return { beers: data, beersError: error, beersLoading: isLoading };
}

export function useBeer( beerId: string|undefined ) {
    const shouldFetch =  beerId ? `/api/beer/${beerId}`: null;
    const { data, error, isLoading } = useSWR<IBeer, Error>(shouldFetch, fetcher);
    return { beer: data, beerError: error, beerLoading: isLoading };
}