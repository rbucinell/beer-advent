import { IUsers } from "@/app/models/user";
import { Avatar, Skeleton } from "@mui/material";
import Link from "next/link";
import { Component, ReactNode } from "react";

interface IUserAvatarProps {
  user: IUsers | undefined,
  sx?: any
}

export default class UserAvatar extends Component<IUserAvatarProps, {}> {

  constructor(props: IUserAvatarProps) {
    super(props);
  }

  render(): ReactNode {
    return (
      <Link href={`/user/${this.props.user?._id}`} >
        {!this.props.user?.imageUrl ?
          <Skeleton variant="circular" width={40} height={40} animation={false} sx={{ ":hover": { border: "2px solid lightcoral" } }} /> :
          <Avatar src={this.props.user?.imageUrl} sx={{ ...this.props?.sx, ":hover": { border: "2px solid lightcoral" } }} />
        }
      </Link>);
  }
}
