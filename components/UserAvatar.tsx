import { IAuthUser } from "@/app/models/authuser";
import { Avatar, Skeleton } from "@mui/material";
import Link from "next/link";
import { Component, ReactNode } from "react";

interface IUserAvatarProps {
  user: IAuthUser | undefined,
  sx?: any
}

export default class UserAvatar extends Component<IUserAvatarProps, {}> {

  constructor(props: IUserAvatarProps) {
    super(props);
  }

  render(): ReactNode {
    return (
      <Link href={`/user/${this.props.user?.username ?? this.props.user?._id}`} title={`/user/${this.props.user?.username ?? this.props.user?._id}`}>
        {!this.props.user?.image ?
          <Skeleton variant="circular" width={40} height={40} animation={false} sx={{ ":hover": { border: "2px solid lightcoral" } }} /> :
          <Avatar src={this.props.user?.image} sx={{ ...this.props?.sx, ":hover": { border: "2px solid lightcoral" } }} />
        }
      </Link>);
  }
}
