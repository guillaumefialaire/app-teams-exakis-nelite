import * as React from 'react';
import { Route, NavLink, Link, IndexRoute, hashHistory } from 'react-router-dom';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import LanguageService from '../../../../services/LanguagesService';
import Language from '../../../../models/Language';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { TaxonomyPicker, IPickerTerms, UpdateType, UpdateAction} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import Term from '../../../../models/Term';
import {Constants} from '../../../../constants';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import styles from './../../../TeamsAppsCv.module.scss';
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating';
import * as strings from 'TeamsAppsCvWebPartStrings';


export interface LanguageFormProps extends IBaseComponentProps {
    id : number;
    rerenderParentCallback : () => void;
}

export interface LanguageFormState{
    nameTerm: Term;
    level : number
    nameTermInit : IPickerTerms;
}

export default class LanguageForm extends React.Component<LanguageFormProps, LanguageFormState>{
    
    constructor(props : LanguageFormProps,state: LanguageFormState) {
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
            let languageService = new LanguageService(this.props.context);
            let language = await languageService.loadById(id);
            if(language.level){
                this.setState({
                    level : language.level
                });
            }
            if(language.name){
                this.setState({
                    nameTermInit : [{
                        key : language.name.ID.toString(),
                        name : language.name.Label,
                        path : undefined,
                        termSet : undefined
                    }]
                });
                this.setState({
                    nameTerm : language.name
                });
            }       
        }
    }


    public isValid() : boolean {
        return (this.state.nameTerm != null);
    }

    public async save(){
        let languageService = new LanguageService(this.props.context);
        let language = new Language();
        language.id = this.props.id;
        language.level = this.state.level;
        language.name = this.state.nameTerm;
        language.profileId = await languageService.getProfileId();
        await languageService.save(language);
        this.props.rerenderParentCallback();     
    }


    public saveButtonNotDisabledJSX() {
        return (
            <Link to="/MyCV/Edit/Languages">
        <PrimaryButton text={strings.Save} onClick={() => this.save()}/>        
    </Link>                
        )
    }

    public saveButtonDisabledJSX() {
        return (
        <PrimaryButton text={strings.Save} disabled={true}/>        
        )
    }

    public render(): React.ReactElement<LanguageFormProps> {
        return (<div>
            <div className={styles.taxoRequired}>
        <TaxonomyPicker allowMultipleSelections={false}
                termsetNameOrID={Constants.termsets.language.id}
                panelTitle={strings.Language}
                initialValues={this.state.nameTermInit}
                label={strings.Language+" :"}
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
    <Link to="/MyCV/Edit/Languages">
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

