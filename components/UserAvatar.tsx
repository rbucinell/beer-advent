import { IAuthUser } from "@/app/models/authuser";
import { IOldUsers } from "@/app/models/oldusers";
//import { IUsers } from "@/app/models/users";
import { Avatar, Skeleton } from "@mui/material";
import Link from "next/link";
import { Component, ReactNode } from "react";

interface IUserAvatarProps {
  user: IAuthUser | IOldUsers | undefined,
  sx?: any
}

export default class UserAvatar extends Component<IUserAvatarProps, {}> {

  constructor(props: IUserAvatarProps) {
    super(props);
  }

  render(): ReactNode {
    if( !this.props.user ) return <Skeleton variant="circular" width={40} height={40} animation={false} sx={{ ":hover": { border: "2px solid lightcoral" } }} />
    
    let username = 'username' in this.props.user ? (this.props.user as IAuthUser).username : (this.props.user as IOldUsers).email;
    let img = 'image' in this.props.user ? (this.props.user as IAuthUser).image : (this.props.user as IOldUsers).imageUrl;
    
    return (
      <Link href={`/user/${username ?? this.props.user?._id}`} title={`/user/${username ?? this.props.user?._id}`}>
        {!img ?
          <Skeleton variant="circular" width={40} height={40} animation={false} sx={{ ":hover": { border: "2px solid lightcoral" } }} /> :
          <Avatar src={img} sx={{ ...this.props?.sx, ":hover": { border: "2px solid lightcoral" } }} />
        }
      </Link>);
  }
}
