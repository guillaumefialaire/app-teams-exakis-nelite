import * as React from 'react';
import IBaseComponentProps from '../../../interfaces/IBaseComponentProps';
import * as strings from 'TeamsAppsCvWebPartStrings';
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

export interface IFormNavProps extends IBaseComponentProps{
    history : any;
}

class FormNav extends React.Component<IFormNavProps,{}>{

    public links: INavLink[];

    constructor(props){
        super(props);
    }

    public componentWillMount(){
        this.links = [
          {
            name: strings.OverallIntroduction,
            url: "#/MyCV/Edit/Introduction",
            key:"Introduction"
          },
          {
            name: strings.Technos,
            url: "#/MyCV/Edit/Technos",
            key:"Technos"
          },
          {
            name: strings.Languages,
            url: "#/MyCV/Edit/Languages",
            key:"Languages"
          },
          {
            name: strings.Softskills,
            url: "#/MyCV/Edit/Softskills",
            key:"Softskills"
          },
          {
            name: strings.Graduations,
            url: "#/MyCV/Edit/Graduations",
            key:"Graduations"
          },
          {
            name: strings.Certifications,
            url: "#/MyCV/Edit/Certifications",
            key:"Certifications"
          },
          {
            name: strings.Interventions,
            url: "#/MyCV/Edit/Interventions",
            key:"Interventions"
          }
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
        
        return(<div>
         <Nav
              
              ariaLabel="Nav basic example"
              styles={navStyles}
              selectedKey={selectedKey}
              groups={[{
                links : this.links
              }] as INavLinkGroup[]}
            />
            
            </div>)
    }
}

export default withRouter(FormNav)