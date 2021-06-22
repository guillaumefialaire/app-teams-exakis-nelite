import * as React from 'react';
import { Route, NavLink, Link, IndexRoute, hashHistory } from 'react-router-dom';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import GraduationService from '../../../../services/GraduationsService';
import Graduation from '../../../../models/Graduation';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { TaxonomyPicker, IPickerTerms, UpdateType, UpdateAction} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import Term from '../../../../models/Term';
import {Constants} from '../../../../constants';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import styles from './../../../TeamsAppsCv.module.scss';
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating';
import * as strings from 'TeamsAppsCvWebPartStrings';
import Multilingual from './../../../../models/Multilingual';
import MultilingualField from '../../../MultilingualFieldComponent';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';

export interface GraduationFormProps extends IBaseComponentProps {
    id : number;
    rerenderParentCallback : () => void;
}

export interface GraduationFormState{
    diplomaTerm: Term;
    diplomaTermInit : IPickerTerms;
    schoolTerm: Term;
    schoolTermInit : IPickerTerms;
    enName : string;
    frName : string;
    graduationDate : Date;
}

export default class GraduationForm extends React.Component<GraduationFormProps, GraduationFormState>{
    
    constructor(props : GraduationFormProps,state: GraduationFormState) {
        super(props);
        this.state = {diplomaTerm:null,diplomaTermInit:null,enName:null,frName:null,schoolTerm:null,schoolTermInit:null,graduationDate:null};
    
    }

    public onenNameChange = (event) =>{
        const { value } = event.target;
        this.setState({
            enName : value
        })
    }

    public onfrNameChange = (event) =>{
        const { value } = event.target;
        this.setState({
            frName : value
        })    
    }

    public onGraduationDateChange = (date) => {
        this.setState({graduationDate: date})
    }

    private onDiplomaChange = (terms : IPickerTerms) => {
        if(terms != null && !isEmpty(terms)){
            this.setState({
                diplomaTerm : new Term({TermGuid : terms[0].key, Label : terms[0].name})
            });
        }
        else {
            this.setState({
                diplomaTerm : null
            });
        }    
    }
    
    private onSchoolChange = (terms : IPickerTerms) => {
        if(terms != null && !isEmpty(terms)){
            this.setState({
                schoolTerm : new Term({TermGuid : terms[0].key, Label : terms[0].name})
            });
        }
        else {
            this.setState({
                schoolTerm : null
            });
        }    
    }

    public async componentDidMount() {
        
        let id = this.props.id;
        if (id !== undefined && id !== null) {
            let graduationService = new GraduationService(this.props.context);
            let graduation = await graduationService.loadById(id);
            if(graduation.name){
               if(graduation.name.englishStr) this.setState({enName : graduation.name.englishStr})
               if(graduation.name.frenchStr) this.setState({frName : graduation.name.frenchStr}) 
            }
            if(graduation.date) this.setState({graduationDate : graduation.date})
            if(graduation.diploma){
                this.setState({
                    diplomaTermInit : [{
                        key : graduation.diploma.ID.toString(),
                        name : graduation.diploma.Label,
                        path : undefined,
                        termSet : undefined
                    }]
                });
                this.setState({
                    diplomaTerm : graduation.diploma
                });
            }
            if(graduation.school){
                this.setState({
                    schoolTermInit : [{
                        key : graduation.school.ID.toString(),
                        name : graduation.school.Label,
                        path : undefined,
                        termSet : undefined
                    }]
                });
                this.setState({
                    schoolTerm : graduation.school
                });
            }       
        }
    }


    public isValid() : boolean {
        return (this.state.enName !== null && this.state.frName !== null && this.state.frName !== "" && this.state.enName !== "");
    }

    public async save(){
        let graduationService = new GraduationService(this.props.context);
        let graduation = new Graduation();
        graduation.id = this.props.id;
        graduation.profileId = await graduationService.getProfileId();
        graduation.name = new Multilingual(this.state.frName,this.state.enName);
        graduation.diploma = this.state.diplomaTerm;
        graduation.school = this.state.schoolTerm;
        graduation.date = this.state.graduationDate;

        await graduationService.save(graduation);
        this.props.rerenderParentCallback();     
    }


    public saveButtonNotDisabledJSX() {
        return (
            <Link to="/MyCV/Edit/Graduations">
        <PrimaryButton text={strings.Save} onClick={() => this.save()}/>        
    </Link>                
        )
    }

    public saveButtonDisabledJSX() {
        return (
        <PrimaryButton text={strings.Save} disabled={true}/>        
        )
    }

    public render(): React.ReactElement<GraduationFormProps> {
        return (<div>
            <div>
            <MultilingualField onEnglishChangeParent={this.onenNameChange} onFrenchChangeParent={this.onfrNameChange} frenchValue={this.state.frName} englishValue={this.state.enName} context={this.props.context} teamsContext={this.props.teamsContext} label={strings.Name+" :"} isRequired={true} isDisabled={false}/>
            </div>
            
        <TaxonomyPicker allowMultipleSelections={false}
                termsetNameOrID={Constants.termsets.diploma.id}
                panelTitle={strings.Diploma}
                initialValues={this.state.diplomaTermInit}
                label={strings.Diploma+" :"}
                context={this.props.context}
                onChange={this.onDiplomaChange}
                isTermSetSelectable={false}
                />

<TaxonomyPicker allowMultipleSelections={false}
                termsetNameOrID={Constants.termsets.school.id}
                panelTitle={strings.School}
                initialValues={this.state.schoolTermInit}
                label={strings.School+" :"}
                context={this.props.context}
                onChange={this.onSchoolChange}
                isTermSetSelectable={false}
                />

            <DatePicker label={strings.GraduationDate+" :"}
            value={this.state && this.state.graduationDate}
            placeholder="Select a date..."
            onSelectDate={this.onGraduationDateChange}
            />

<span>
    <Link to="/MyCV/Edit/Graduations">
            <DefaultButton text={strings.Cancel}/>

    </Link>
    &nbsp;
    &nbsp;
    {this.isValid() && this.saveButtonNotDisabledJSX()}
    {!this.isValid() && this.saveButtonDisabledJSX()}        
</span>
        </div>);
    }
}

