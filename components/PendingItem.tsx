import React from "react";
import { Stack, Typography } from '@mui/material';
import DayIcon from "./DayIcon";
import Item from "@/components/Item";

export default class PendingItem extends React.Component {

  render() {
    return (
      <Item sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
        <Typography variant="h6" fontStyle={"italic"}>Pending...</Typography>
        <Stack direction={"row"} spacing={2}>
          {/* <DayIcon />
                    <DayIcon /> */}
        </Stack>
      </Item>
    )
  }
};
