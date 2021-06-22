import * as React from 'react';  
import {Link, Route, HashRouter } from 'react-router-dom';    
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../../interfaces/IBaseComponentProps';
import CVForm from './Form/MyCVFormComponent';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import styles from '../TeamsAppsCv.module.scss';

export interface IListCvProps extends IBaseComponentProps{

}

export interface IListCvState {
    
}

export default class ListCV extends React.Component<IListCvProps, IListCvState> { 

    constructor(props) {
        super(props);
      }

    public render(): React.ReactElement{  
        return (    
            <div> 
                <Link to="/MyCV/Edit/Introduction">
                <DefaultButton text={strings.EditCV}/>
                </Link>                  
            </div>    
        );    
    }    
}  