import * as React from 'react';
import { Route, NavLink, Link, IndexRoute, hashHistory } from 'react-router-dom';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import TechnoService from '../../../../services/TechnosService';
import Techno from '../../../../models/Techno';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { TaxonomyPicker, IPickerTerms, UpdateType, UpdateAction} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import Term from '../../../../models/Term';
import {Constants} from '../../../../constants';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import styles from './../../../TeamsAppsCv.module.scss';
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating';
import * as strings from 'TeamsAppsCvWebPartStrings';


export interface TechnoFormProps extends IBaseComponentProps {
    id : number;
    rerenderParentCallback : () => void;
}

export interface TechnoFormState{
    nameTerm: Term;
    level : number
    nameTermInit : IPickerTerms;
}

export default class TechnoForm extends React.Component<TechnoFormProps, TechnoFormState>{
    
    constructor(props : TechnoFormProps,state: TechnoFormState) {
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
            let technoService = new TechnoService(this.props.context);
            let techno = await technoService.loadById(id);
            if(techno.level){
                this.setState({
                    level : techno.level
                });
            }
            if(techno.name){
                this.setState({
                    nameTermInit : [{
                        key : techno.name.ID.toString(),
                        name : techno.name.Label,
                        path : undefined,
                        termSet : undefined
                    }]
                });
                this.setState({
                    nameTerm : techno.name
                });
            }       
        }
    }


    public isValid() : boolean {
        return (this.state.nameTerm != null);
    }

    public async save(){
        let technoService = new TechnoService(this.props.context);
        let techno = new Techno();
        techno.id = this.props.id;
        techno.level = this.state.level;
        techno.name = this.state.nameTerm;
        techno.profileId = await technoService.getProfileId();
        await technoService.save(techno);
        this.props.rerenderParentCallback();     
    }


    public saveButtonNotDisabledJSX() {
        return (
            <Link to="/MyCV/Edit/Technos">
        <PrimaryButton text={strings.Save} onClick={() => this.save()}/>        
    </Link>                
        )
    }

    public saveButtonDisabledJSX() {
        return (
        <PrimaryButton text={strings.Save} disabled={true}/>        
        )
    }

    public render(): React.ReactElement<TechnoFormProps> {
        return (<div>
            <div className={styles.taxoRequired}>
        <TaxonomyPicker allowMultipleSelections={false}
                termsetNameOrID={Constants.termsets.techno.id}
                panelTitle={strings.Techno}
                initialValues={this.state.nameTermInit}
                label={strings.Techno+" :"}
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
    <Link to="/MyCV/Edit/Technos">
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

