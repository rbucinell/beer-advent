import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { IEvent } from "@models/event";
import { IParticipant } from "@models/participant";
import { IOldUsers } from "@models/oldusers";
import { IBeer } from "../models/beer";


export function useEvents() {
  const { data, error, isLoading } = useSWR<IEvent[], Error>('/api/events', fetcher);
  return { events: data, eventsError: error, eventsLoading: isLoading };
}

export function useEvent(options: { year?: number | string } = {}) {
  const { year } = options;
  let path = `/api/events/${year}`;
  const { data, error, isLoading } = useSWR<IEvent, Error>(path, fetcher);
  return { event: data, eventError: error, eventLoading: isLoading };
}

export function useEventParticipants(event: IEvent | undefined) {
  const shouldFetch = event?._id !== undefined ? `/api/events/${event.year}/participants` : null;
  const { data, error, isLoading } = useSWR<IParticipant[], Error>(shouldFetch, fetcher);
  return { participants: data, participantsError: error, participantsLoading: isLoading };
}

export function useUsers() {
  const { data, error, isLoading } = useSWR<IOldUsers[], Error>(`/api/user`, fetcher);
  return { users: data, usersError: error, usersLoading: isLoading };
}

export function useUser(userId: string | undefined) {
  const shouldFetch = userId ? `/api/user/${userId}` : null;
  const { data, error, isLoading } = useSWR<IOldUsers, Error>(shouldFetch, fetcher);
  return { user: data, userError: error, userLoading: isLoading };
}

export function useBeers() {
  const { data, error, isLoading } = useSWR<IBeer[], Error>(`/api/beer`, fetcher);
  return { beers: data, beersError: error, beersLoading: isLoading };
}

export function useBeer(beerId: string | undefined) {
  const shouldFetch = beerId ? `/api/beer/${beerId}` : null;
  const { data, error, isLoading } = useSWR<IBeer, Error>(shouldFetch, fetcher);
  return { beer: data, beerError: error, beerLoading: isLoading };
}
