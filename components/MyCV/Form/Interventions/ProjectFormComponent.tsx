import * as React from 'react';
import { Route, NavLink, Link, IndexRoute, hashHistory } from 'react-router-dom';
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import ProjectService from '../../../../services/ProjectsService';
import Project from '../../../../models/Project';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import { TaxonomyPicker, IPickerTerms, UpdateType, UpdateAction} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import {ITerm} from "@pnp/spfx-controls-react/lib/services/ISPTermStorePickerService";
import SPTermStorePickerService from "@pnp/spfx-controls-react/lib/services/SPTermStorePickerService";
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import Term from '../../../../models/Term';
import {Constants} from '../../../../constants';
import PublishingImage from '../../../../models/PublishingImage';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import FileViewer from 'react-file-viewer';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { ListItemPicker } from '@pnp/spfx-controls-react/lib/ListItemPicker';
import { getLastTabbable } from 'office-ui-fabric-react/lib/Utilities';
import MultilingualField from '../../../MultilingualFieldComponent';
import Multilingual from '../../../../models/Multilingual';
import styles from './../../../TeamsAppsCv.module.scss';
import CustomerService from '../../../../services/CustomersService';

export interface ProjectFormProps extends IBaseComponentProps {
    interId : number;
}

export interface ProjectFormState{
    name : string;
    businessSector: Term;
    projectType : Term;
    technos : Term[];
    fieldRequiredError : string;
    businessSectorInit : IPickerTerms;
    projectTypeInit : IPickerTerms;
    technosInit : IPickerTerms;
    customerListId : string;
    customerId : number;
    customerName : string;
    defaultCustomer : any[];
    itemPickerDisabled : boolean;
    outsideCustomerName : string;
    outsideCustomerHidden : boolean;
    enDesc : string;
    frDesc : string;
    labelCustomerClass:string;
}

export default class ProjectForm extends React.Component<ProjectFormProps, ProjectFormState>{
    
    private idUrl : string;

    constructor(props : ProjectFormProps,state: ProjectFormState) {

        super(props);
        this.state = {name:null,businessSector:null,fieldRequiredError:null,businessSectorInit:null,customerListId:null,customerId:null,customerName:null,defaultCustomer:null,itemPickerDisabled:null,outsideCustomerName:null,outsideCustomerHidden:null,projectType:null,projectTypeInit:null,frDesc:null,enDesc:null,technos:null,technosInit:null,labelCustomerClass:null};
        if(this.props.interId !== null){
            this.idUrl = "/"+this.props.interId.toString()
        } else {
            this.idUrl = ""
        }

        this.onSelectedItem = this.onSelectedItem.bind(this);
    
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

    private onBusinessSectorChange = (terms : IPickerTerms) => {
        if(terms != null && !isEmpty(terms)){
            this.setState({
                businessSector : new Term({TermGuid : terms[0].key, Label : terms[0].name})
            });
        }
        else {
            this.setState({
                businessSector : null
            });
        }
        
    }

    private onProjectTypeChange = (terms : IPickerTerms) => {
        if(terms != null && !isEmpty(terms)){
            this.setState({
                projectType : new Term({TermGuid : terms[0].key, Label : terms[0].name})
            });
        }
        else {
            this.setState({
                projectType : null
            });
        }
        
    }

    private onTechnosChange = (terms : IPickerTerms) => {
        if(terms != null && !isEmpty(terms)){
            let Terms : Term[] = []
            terms.forEach(term => {
                Terms.push(new Term({TermGuid : term.key, Label : term.name}))
            });
            this.setState({
               technos : Terms
            });
        }
        else {
            this.setState({
                technos : null
            });
        }
        
    }
    

    public async componentDidMount() {
        let customerService = new CustomerService(this.props.context);
        let customerListId = await customerService.getCustomerListId();
        this.setState({customerListId : customerListId});
            this.setState({
                itemPickerDisabled : false,
                defaultCustomer : [],
                outsideCustomerHidden : false,
            })
    }

    private onTitleChange = (event) =>{
        const { value } = event.target;
        this.setState({
            name : value
        });
        if (value==""){
            this.setState({fieldRequiredError : strings.FieldRequired});
        } else {
            this.setState({fieldRequiredError : undefined});
        }
    }

    public isValid() : boolean {
        return (this.state.name != null && this.state.name != "" && !isEmpty(this.state.technos) && ((this.state.outsideCustomerName!==null && !isEmpty(this.state.businessSector)) || (this.state.customerId !== null)) );
    }

    public async save(){
        let projectService = new ProjectService(this.props.context);
        let project = new Project();
        project.title = this.state.name;
        if(!isEmpty(this.state.businessSector)) project.businessSector = this.state.businessSector;
        if(!isEmpty(this.state.projectType)) project.type = this.state.projectType;
        if(!isEmpty(this.state.technos)) project.technos = this.state.technos
        if(this.state.customerId) project.customerID = this.state.customerId;
        if(this.state.outsideCustomerName) project.outsideCustomerName = this.state.outsideCustomerName
        if(this.state.frDesc || this.state.enDesc)  project.description = new Multilingual(this.state.frDesc,this.state.enDesc)
        let id = await projectService.save(project,this.props.context.pageContext.web.serverRelativeUrl+Constants.lists.projects.url);
    }

    private onSelectedItem(items: { key: string; name: string }[]) {
            if(isEmpty(items)){
                this.setState({customerId : null,
                outsideCustomerHidden : false})
            } else{
                this.setState({customerId : +items[0].key,
                outsideCustomerHidden : true});


        }
      }

      public requiredSymbolJSX() : JSX.Element {
        return(<span className={styles.redFont}>*</span>)
      }

      public listItemPickerJSX() : JSX.Element {
      return (<div><span className={this.state.labelCustomerClass}>{strings.Customer} : {!this.state.itemPickerDisabled && this.requiredSymbolJSX()}</span><ListItemPicker 
      noResultsFoundText={strings.CustomerNotFoundMsg} 
      disabled={this.state.itemPickerDisabled} 
      listId={this.state.customerListId} 
      columnInternalName={Constants.lists.customers.fields.name} 
      context={this.props.context} 
      itemLimit={1} 
      keyColumnInternalName={Constants.lists.customers.fields.id} 
      onSelectedItem={this.onSelectedItem} 
      defaultSelectedItems={this.state.defaultCustomer}/></div>)
        }

        public bsJSX() : JSX.Element {
            return (<div className={styles.taxoRequired}>
            <TaxonomyPicker allowMultipleSelections={false}
                    termsetNameOrID={Constants.termsets.businessSector.id}
                    panelTitle={strings.BusinessSector}
                    initialValues={this.state.businessSectorInit}
                    label={strings.BusinessSector+" :"}
                    context={this.props.context}
                    onChange={this.onBusinessSectorChange}
                    isTermSetSelectable={false}
                    />
    </div>)
        }

    public onOutsideCustomerChange = (event) => {
        const { value } = event.target;
        this.setState({
            outsideCustomerName : value
        });
        if (value==""){
            this.setState({itemPickerDisabled : false,
            outsideCustomerName : null,
            labelCustomerClass : ""
        });
        } else {
            this.setState({itemPickerDisabled : true,
                labelCustomerClass : styles.textDisabled});
        }
    }
      
    public outsideCustomerTextfieldJSX() : JSX.Element {
        return <TextField label={strings.OutsideCustomer+" :"} onChange={this.onOutsideCustomerChange} value={this.state.outsideCustomerName}/>
        
    }

    public saveButtonNotDisabledJSX() {
        return (
            <Link to={"/MyCV/Edit/Interventions/Form"+this.idUrl}>
        <PrimaryButton text={strings.Save} onClick={() => this.save()}/>        
    </Link>                
        )
    }

    public saveButtonDisabledJSX() {
        return (
        <PrimaryButton text={strings.Save} disabled={true}/>        
        )
    }

    public render(): React.ReactElement<ProjectFormProps> {
        return (<div>
          {this.state.defaultCustomer && this.listItemPickerJSX()}
          
          {!this.state.outsideCustomerHidden && this.outsideCustomerTextfieldJSX()}

          {!this.state.customerId && this.state.outsideCustomerName && this.bsJSX()}
          
          <TextField required label= {strings.Name+" :"} value={this.state.name} onChange={this.onTitleChange} errorMessage={this.state.fieldRequiredError}/>


<MultilingualField onEnglishChangeParent={this.onenDescChange} onFrenchChangeParent={this.onfrDescChange} frenchValue={this.state.frDesc} englishValue={this.state.enDesc} context={this.props.context} teamsContext={this.props.teamsContext} label={strings.Description+" :"} isRequired={false} isDisabled={false}/>

<TaxonomyPicker allowMultipleSelections={false}
                termsetNameOrID={Constants.termsets.projectType.id}
                panelTitle={strings.ProjectType}
                initialValues={this.state.projectTypeInit}
                label={strings.ProjectType+" :"}
                context={this.props.context}
                onChange={this.onProjectTypeChange}
                isTermSetSelectable={false}
                />

<div className={styles.taxoRequired}>
<TaxonomyPicker allowMultipleSelections={true}
                termsetNameOrID={Constants.termsets.techno.id}
                panelTitle={strings.Technos}
                initialValues={this.state.technosInit}
                label={strings.Technos+" :"}
                context={this.props.context}
                onChange={this.onTechnosChange}
                isTermSetSelectable={false}
                />
</div>
               

<span>
    <Link to={"/MyCV/Edit/Interventions/Form"+this.idUrl}>
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

