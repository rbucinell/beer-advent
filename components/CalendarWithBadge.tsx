import { CalendarToday } from '@mui/icons-material';
import { Badge, IconButton } from '@mui/material';
import React, { Component } from 'react';

interface ICalendarWithBadgeProps {
    num: number;
}

export default class CalendarWithBadge extends Component<ICalendarWithBadgeProps> {
    constructor( props: ICalendarWithBadgeProps ){
        super(props);
    }

    render(): React.ReactNode {
        const year = this.props.num;
        return (
            <IconButton style={{position: 'relative'}} color="primary">
                <Badge 
                    badgeContent={`'${year % 100}`} 
                    color="default" 
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    sx={{
                        color: 'black',
                        backgroundColor: 'transparent'
                    }}
                >
                    <CalendarToday 
                    color='primary'
                    style={{
                        position: 'absolute',
                        transform: 'translate(-50%,-60%)'
                    }}/>
                </Badge>
            </IconButton>
        );
    }   
}