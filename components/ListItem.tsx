import { Component, ReactNode } from 'react';
import Item from "@/components/Item";

  type Props = {
    sx?: any
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
                    ...this.props.sx
                }}
            >
                {this.props.children}
            </Item>
        );
    }
};