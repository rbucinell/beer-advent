import { IBeer } from "@/app/models/beer";
import { IOldUsers } from "@/app/models/oldusers";
import BeerListItem from "@/components/Beer/BeerListItem";
import DayIcon from "@/components/DayIcon";
import UserAvatar from "@/components/UserAvatar";
import { ListItem, Stack } from "@mui/material";

export const EventDayDisplay = ({user, beer, day}: {user?:IOldUsers, beer?:IBeer|null, day:number}) => {
    return (
        <div key={day} className="my-1 w-full items-center rounded-sm border-b border-r border-red-100 gap-1">
            <Stack direction={'row'} gap={0.5} alignItems="center" className="w-full p-0">
                <DayIcon day={day} sx={{mt:0.25, mb:0.25}} />
                <UserAvatar user={user} sx={{mt:0.25, mb:0.25}} />
                {beer && <BeerListItem beer={beer} includeYear={false} />}
            </Stack>
        </div>
    );
}
