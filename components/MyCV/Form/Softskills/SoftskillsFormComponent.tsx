import * as React from 'react';
import { Route, NavLink, Link, IndexRoute, hashHistory } from 'react-router-dom';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import SoftskillService from '../../../../services/SoftskillsService';
import Softskill from '../../../../models/Softskill';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { TaxonomyPicker, IPickerTerms, UpdateType, UpdateAction} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import Term from '../../../../models/Term';
import {Constants} from '../../../../constants';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import styles from './../../../TeamsAppsCv.module.scss';
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating';
import * as strings from 'TeamsAppsCvWebPartStrings';


export interface SoftskillFormProps extends IBaseComponentProps {
    id : number;
    rerenderParentCallback : () => void;
}

export interface SoftskillFormState{
    nameTerm: Term;
    level : number
    nameTermInit : IPickerTerms;
}

export default class SoftskillForm extends React.Component<SoftskillFormProps, SoftskillFormState>{
    
    constructor(props : SoftskillFormProps,state: SoftskillFormState) {
        super(props);
        this.state = {nameTerm:null,level:5,nameTermInit:null};
    
    }

    private onTaxPickerChange = (terms : IPickerTerms) => {
        if(terms != null && !isEmpty(terms)){
            this.setState({
                nameTerm : new Term({TermGuid : terms[0].key, Label : terms[0].name})
            });
        }
        else {
            this.setState({
                nameTerm : null
            });
        }
        
    }

    private onLevelChange = (ev: React.FocusEvent<HTMLElement>, rating: number): void => {
        this.setState({level : rating})
      };
    
    public async componentDidMount() {
        
        let id = this.props.id;
        if (id !== undefined && id !== null) {
            let softskillService = new SoftskillService(this.props.context);
            let softskill = await softskillService.loadById(id);
            if(softskill.level){
                this.setState({
                    level : softskill.level
                });
            }
            if(softskill.name){
                this.setState({
                    nameTermInit : [{
                        key : softskill.name.ID.toString(),
                        name : softskill.name.Label,
                        path : undefined,
                        termSet : undefined
                    }]
                });
                this.setState({
                    nameTerm : softskill.name
                });
            }       
        }
    }


    public isValid() : boolean {
        return (this.state.nameTerm != null);
    }

    public async save(){
        let softskillService = new SoftskillService(this.props.context);
        let softskill = new Softskill();
        softskill.id = this.props.id;
        softskill.level = this.state.level;
        softskill.name = this.state.nameTerm;
        softskill.profileId = await softskillService.getProfileId();
        await softskillService.save(softskill);
        this.props.rerenderParentCallback();     
    }


    public saveButtonNotDisabledJSX() {
        return (
            <Link to="/MyCV/Edit/Softskills">
        <PrimaryButton text={strings.Save} onClick={() => this.save()}/>        
    </Link>                
        )
    }

    public saveButtonDisabledJSX() {
        return (
        <PrimaryButton text={strings.Save} disabled={true}/>        
        )
    }

    public render(): React.ReactElement<SoftskillFormProps> {
        return (<div>
            <div className={styles.taxoRequired}>
        <TaxonomyPicker allowMultipleSelections={false}
                termsetNameOrID={Constants.termsets.softskill.id}
                panelTitle={strings.Softskill}
                initialValues={this.state.nameTermInit}
                label={strings.Softskill+" :"}
                context={this.props.context}
                onChange={this.onTaxPickerChange}
                isTermSetSelectable={false}
                />
                </div>
                {strings.Level+" :"}<span className={styles.redFont}>*</span>
                <Rating
        min={1}
        max={10}
        rating={this.state.level}
        onChange={this.onLevelChange}
      />
                
<span>
    <Link to="/MyCV/Edit/Softskills">
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

