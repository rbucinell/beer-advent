import { IUser } from "@/app/models/user";
import { Avatar,  Skeleton } from "@mui/material";
import Link from "next/link";
import { Component, ReactNode } from "react";

interface IUserAvatarProps {
    user: IUser
    sx?: any
}

export default class UserAvatar extends Component<IUserAvatarProps, {}> {

    constructor(props: IUserAvatarProps) {
        super(props);
    }

    render(): ReactNode {
        return (!this.props.user?.imageUrl ? 
            <Skeleton variant="circular" width={40} height={40} animation={false} />:
            
            <Link href={`/user/${this.props.user._id}`} >
                <Avatar src={this.props.user?.imageUrl} sx={this.props?.sx } />
            </Link>)
    }
}