import * as React from 'react';
import { Route, NavLink, Link, IndexRoute, hashHistory } from 'react-router-dom';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import CertificationService from '../../../../services/CertificationsService';
import Certification from '../../../../models/Certification';
import { TaxonomyPicker, IPickerTerms, UpdateType, UpdateAction} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import Term from '../../../../models/Term';
import {Constants} from '../../../../constants';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import styles from './../../../TeamsAppsCv.module.scss';
import * as strings from 'TeamsAppsCvWebPartStrings';
import Multilingual from './../../../../models/Multilingual';
import MultilingualField from '../../../MultilingualFieldComponent';
import MultilingualListItemPicker from '../../../MultilingualItemPickerComponent'
import ProfileService from '../../../../services/ProfileService';



export interface CertificationFormProps extends IBaseComponentProps {
    rerenderParentCallback : () => void;
}

export interface CertificationFormState{
    companyTerm: Term;
    companyTermInit : IPickerTerms;
    enName : string;
    frName : string;
    enDesc : string;
    frDesc : string;
    certifListId : string;
    certifId : number;
    controlsDisabled : boolean
}

export default class CertificationForm extends React.Component<CertificationFormProps, CertificationFormState>{
    
    constructor(props : CertificationFormProps,state: CertificationFormState) {
        super(props);
        this.state = {companyTerm:null,companyTermInit:null,enName:null,frName:null,frDesc:null,enDesc:null,certifListId:null,certifId:null,controlsDisabled:false};
        this.onCertifChange = this.onCertifChange.bind(this);
    }

    public async onCertifChange(id? : number) {
        if(id) {
        
        this.setState({certifId : id,
        controlsDisabled:true})
        
        let certificationService = new CertificationService(this.props.context);
          let certification = await certificationService.loadById(id);
            if(certification.name){
               if(certification.name.englishStr) this.setState({enName : certification.name.englishStr})
               if(certification.name.frenchStr) this.setState({frName : certification.name.frenchStr}) 
            }
            if(certification.description){
                if(certification.description.englishStr) this.setState({enDesc : certification.description.englishStr})
                if(certification.description.frenchStr) this.setState({frDesc : certification.description.frenchStr}) 
             }
            if(certification.company){
                this.setState({
                    companyTermInit : [{
                        key : certification.company.ID.toString(),
                        name : certification.company.Label,
                        path : undefined,
                        termSet : undefined
                    }]
                });
            }      
        
        } else {
            this.setState({certifId : null,
                controlsDisabled:false,
                enName : null,
                frName : null,
                enDesc : null,
                frDesc : null,
                companyTermInit : null})
        }
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

    public onenDescChange = (event) =>{
        const { value } = event.target;
        this.setState({
            enDesc : value
        })
    }

    public onfrDescChange = (event) =>{
        const { value } = event.target;
        this.setState({
            frDesc : value
        })    
    }

    private onCompanyChange = (terms : IPickerTerms) => {
        if(terms != null && !isEmpty(terms)){
            this.setState({
                companyTerm : new Term({TermGuid : terms[0].key, Label : terms[0].name})
            });
        }
        else {
            this.setState({
                companyTerm : null
            });
        }    
    }

    public async componentDidMount() {
        
            let certificationService = new CertificationService(this.props.context);
            certificationService.getCertificationsListId().then((id) =>{
                this.setState({certifListId : id})
            });
    }


    public isValid() : boolean {
        return (this.state.enName !== null && this.state.frName !== null && this.state.frName !== "" && this.state.enName !== "");
    }

    public async save(){
        let certificationService = new CertificationService(this.props.context);
        if(this.state.certifId){
            let profileId = certificationService.addToProfile(this.state.certifId,this.props.context).then(() => {
                this.props.rerenderParentCallback();   
            });
        } else {
            let certification = new Certification();
            certification.name = new Multilingual(this.state.frName,this.state.enName);
            certification.description = new Multilingual(this.state.frDesc,this.state.enDesc);
            certification.company = this.state.companyTerm;
            let id = await certificationService.save(certification);
            let profileId = await certificationService.addToProfile(id,this.props.context).then(() => {
                this.props.rerenderParentCallback();
            });
        }
        
          
    }


    public saveButtonNotDisabledJSX() {
        return (
            <Link to="/MyCV/Edit/Certifications">
        <PrimaryButton text={strings.Save} onClick={() => this.save()}/>        
    </Link>                
        )
    }

    public saveButtonDisabledJSX() {
        return (
        <PrimaryButton text={strings.Save} disabled={true}/>        
        )
    }


    public render(): React.ReactElement<CertificationFormProps> {
        return (<div>
            {strings.Certification+" :"}
            {this.state && this.state.certifListId &&<MultilingualListItemPicker listId={this.state.certifListId} fieldRef={Constants.lists.certifications.fields.name} lang={this.props.context.pageContext.cultureInfo.currentCultureName.toLowerCase()} idFieldRef={Constants.lists.certifications.fields.id} parentCallback={this.onCertifChange} notFoundMsg={strings.CertifNotFoundMsg}/>}

            <MultilingualField onEnglishChangeParent={this.onenNameChange} onFrenchChangeParent={this.onfrNameChange} frenchValue={this.state.frName} englishValue={this.state.enName} context={this.props.context} teamsContext={this.props.teamsContext} label={strings.Name+" :"} isRequired={true} isDisabled={this.state.controlsDisabled}/>

            <MultilingualField onEnglishChangeParent={this.onenDescChange} onFrenchChangeParent={this.onfrDescChange} frenchValue={this.state.frDesc} englishValue={this.state.enDesc} context={this.props.context} teamsContext={this.props.teamsContext} label={strings.Description+" :"} isRequired={false} isDisabled={this.state.controlsDisabled}/>
            
        <TaxonomyPicker allowMultipleSelections={false}
                termsetNameOrID={Constants.termsets.company.id}
                panelTitle={strings.Company}
                initialValues={this.state.companyTermInit}
                label={strings.Company+" :"}
                context={this.props.context}
                onChange={this.onCompanyChange}
                isTermSetSelectable={false}
                disabled={this.state.controlsDisabled}
                />


<span>
    <Link to="/MyCV/Edit/Certifications">
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

