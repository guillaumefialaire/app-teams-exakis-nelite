import * as React from 'react';  
import {Link, Route, HashRouter } from 'react-router-dom';    
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../../interfaces/IBaseComponentProps';
import MyCVForm from './Form/MyCVFormComponent';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import MyCVList from './MyCVListComponent';
import {withRouter} from 'react-router-dom'; 
import styles from '../TeamsAppsCv.module.scss';

export interface ICVProps extends IBaseComponentProps{

}

export interface ICVState {
    
}

class CV extends React.Component<ICVProps, ICVState> { 
    public componentDidMount() { 

    }

    public render(): React.ReactElement {  
        return (    
            <div>
                <Route exact path="/MyCV" render={() => <MyCVList context={this.props.context} teamsContext={this.props.teamsContext}/>}/>
                <Route path="/MyCV/Edit" render={() => (<MyCVForm context={this.props.context} teamsContext={this.props.teamsContext}/>)}></Route>               
            </div>    
        );    
    }    
}  

export default withRouter(CV)