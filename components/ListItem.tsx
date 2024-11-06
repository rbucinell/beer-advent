import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { Component, ReactNode } from 'react';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  type Props = {
    children: ReactNode
  }

  export default class ListItem extends Component<Props> {

    key: any;

    constructor(props: any, key: any) {
        super(props);
        this.key = key;
    }

    render() {
        return (
            <Item key={this.key.toString()} 
                sx={{ 
                    display: "flex", 
                    flexDirection:'row', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {this.props.children}
            </Item>
        );
    }
};