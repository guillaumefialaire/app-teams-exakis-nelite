import * as React from 'react';  
import * as strings from 'TeamsAppsCvWebPartStrings';
import Introduction from './Introduction/IntroductionComponent';
import CertificationsList from './Certifications/CertificationsListComponent';
import Interventions from './Interventions/InterventionsListComponent';
import IBaseComponentProps from '../../../interfaces/IBaseComponentProps';
import FormNav from './MyCVNavComponent';
import {withRouter, Route} from 'react-router-dom';
import TechnosList from './Technos/TechnosListComponent';
import LanguagesList from './Languages/LanguagesListComponent';
import SoftskillsList from './Softskills/SoftskillsListComponent';
import GraduationsList from './Graduations/GraduationsListComponent';
import InterventionsList from './Interventions/InterventionsListComponent';


export interface IMyCVFormProps extends IBaseComponentProps {
}

class MyCVForm extends React.Component<IMyCVFormProps,{}> {  
    
    constructor(props) {
        super(props);
      }


    public render(): React.ReactElement {    
        return (    
            <div>
                    <FormNav context={this.props.context} teamsContext={this.props.teamsContext}></FormNav> 

                <Route path="/MyCV/Edit/Introduction" render={()=>(<Introduction context={this.props.context} teamsContext={this.props.teamsContext}/>)}></Route>

                <Route path="/MyCV/Edit/Technos" render={()=>(<TechnosList context={this.props.context} teamsContext={this.props.teamsContext}/>)}></Route>
                <Route path="/MyCV/Edit/Languages" render={()=>(<LanguagesList context={this.props.context} teamsContext={this.props.teamsContext}/>)}></Route>

                <Route path="/MyCV/Edit/Softskills" render={()=>(<SoftskillsList context={this.props.context} teamsContext={this.props.teamsContext}/>)}></Route>

                <Route path="/MyCV/Edit/Graduations" render={()=>(<GraduationsList context={this.props.context} teamsContext={this.props.teamsContext}/>)}></Route>
               
                <Route path="/MyCV/Edit/Certifications" render={()=>(<CertificationsList context={this.props.context} teamsContext={this.props.teamsContext}/>)}></Route>

                <Route path="/MyCV/Edit/Interventions" render={()=>(<InterventionsList context={this.props.context} teamsContext={this.props.teamsContext}/>)}></Route>  
            </div>    
        );    
    }    
}  

export default withRouter(MyCVForm)