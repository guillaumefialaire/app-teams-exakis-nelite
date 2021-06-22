import * as React from 'react';
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import CustomerService from '../services/CustomersService';
import styles from './TeamsAppsCv.module.scss';
import { Constants } from '../constants';
import { Nav, INavLink, INavStyles, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import {withRouter} from 'react-router-dom'; 


const navStyles: Partial<INavStyles> = {
    root: {
      width: 208,
      height: 350,
      boxSizing: 'border-box',
      border: '1px solid #eee',
      overflowY: 'auto',
    },
  };
  

export interface NavProps extends IBaseComponentProps {
  history : any;
}

export interface NavState {
}

class Navigation extends React.Component<NavProps, NavState>{

    public links: INavLink[];

    constructor(props) {
        super(props);
    }

    public componentWillMount(){
      this.links = [
        {
          name: strings.MyCV,
          url: "#/MyCV",
          key:"MyCV"
        },
        {
          name: "CV",
          url: "#/CV",
          key:"CV"
        },
        {
          name: strings.Customers,
          url: "#/Customers",
          key:"Customers"
        },
        {
          name: strings.Projects,
          url: "#/Projects",
          key:"Projects"
        },
      ];

    }
 
    public render(): React.ReactElement {
      let selectedKeys : INavLink[];
      
      if(this.links){
        const { history } = this.props;

        selectedKeys = this.links.filter(link => {
          if(("#"+history.location.pathname).toLowerCase().startsWith(link.url.toLowerCase()) ){
              return link.url.toLowerCase()
          }
        });
      }
      const selectedKey = (selectedKeys && selectedKeys.length) ? selectedKeys[0].key : null;
          return (   
        <div className={styles.test3}>          
        <Nav
              
              ariaLabel="Nav basic example"
              styles={navStyles}
              selectedKey={selectedKey}
              groups={[{
                links : this.links
              }] as INavLinkGroup[]}
            />
        </div> 
          );
    }     
}

export default withRouter(Navigation);