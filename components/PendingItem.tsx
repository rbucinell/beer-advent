import React from "react";
import { Avatar, Paper, Stack, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default class PendingItem extends React.Component {
    
    render() {
        return (
            <Item  sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
                <Typography variant="h6" fontStyle={"italic"}>Pending...</Typography>
                <Stack direction={"row"} spacing={2}>
                    <Avatar variant="rounded" sx={{ bgcolor: "lightcoral" }}>?</Avatar>
                    <Avatar variant="rounded" sx={{ bgcolor: "lightcoral" }}>?</Avatar>
                </Stack>
            </Item>
        )
    }
};