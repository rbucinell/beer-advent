import { Avatar } from "@mui/material";
import { Component, ReactNode } from "react";

interface IDayIconProps {
  day?: number,
  variant?: 'circular' | 'rounded' | 'square',
  sx?: any
}

export default class UserAvatar extends Component<IDayIconProps, {}> {
  constructor(props: IDayIconProps) {
    super(props);
  }

  render(): ReactNode {
    return (
      <Avatar variant={this.props.variant ?? 'rounded'} sx={{
        fontSize: 20,
        width: 36,
        height: 36,
        bgcolor: 'white',
        color: 'lightcoral',
        border: '2px solid lightcoral',
        ...this.props?.sx
      }}>

        {this.props.day ?? '?'}

      </Avatar>
    );
  }
}
