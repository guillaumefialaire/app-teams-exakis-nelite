import * as React from 'react';
import styles from './TeamsAppsCv.module.scss';
import { Route, Link, Switch, HashRouter, Redirect, BrowserRouter } from 'react-router-dom'; 
import CV from './CV/CVComponent'; 
import Customers from './Customers/CustomersComponent';
import Projects from './Projects/ProjectsComponent';
import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'TeamsAppsCvWebPartStrings';
import MyCV from './MyCV/MyCVComponent';
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import Navigation from './NavComponent';
import CVForm from './MyCV/Form/MyCVFormComponent';


export interface ITeamsAppsCvProps extends IBaseComponentProps{
}

export class TeamsAppsCv extends React.Component<ITeamsAppsCvProps, {}> {

  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<ITeamsAppsCvProps> {
    return (   
      <div>
        <HashRouter hashType="slash">
          <Navigation context={this.props.context} teamsContext={this.props.teamsContext}></Navigation> 
          <Switch>
          <Redirect exact from='/' to='/MyCV'/>
          <Route path="/CV" component={CV} />    
    <Route path="/Customers" render={() => (<Customers context={this.props.context} teamsContext={this.props.teamsContext} />)} />
          <Route path="/Projects" render={() => (<Projects context={this.props.context} teamsContext={this.props.teamsContext} />)} />
    <Route path="/MyCV" component={() => (<MyCV context={this.props.context} teamsContext={this.props.teamsContext} />)} />
        </Switch>
        </HashRouter>   
      </div>    
    );
  }
}


