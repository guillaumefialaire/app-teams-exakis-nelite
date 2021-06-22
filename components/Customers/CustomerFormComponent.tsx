import * as React from 'react';
import { Route, NavLink, Link, IndexRoute, hashHistory } from 'react-router-dom';
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../../interfaces/IBaseComponentProps';
import CustomerService from '../../services/CustomersService';
import Customer from '../../models/Customer';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import { TaxonomyPicker, IPickerTerms, UpdateType, UpdateAction} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import {ITerm} from "@pnp/spfx-controls-react/lib/services/ISPTermStorePickerService";
import SPTermStorePickerService from "@pnp/spfx-controls-react/lib/services/SPTermStorePickerService";
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import Term from '../../models/Term';
import {Constants} from '../../constants';
import PublishingImage from '../../models/PublishingImage';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { BusinessSector } from 'TeamsAppsCvWebPartStrings';
import FileViewer from 'react-file-viewer';
import Customers from './CustomersComponent';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';

export interface CustomerFormProps extends IBaseComponentProps {
    id : number;
    rerenderParentCallback : () => void;
}

export interface CustomerFormState{
    name : string;
    businessSector: Term;
    logo : PublishingImage;
    fieldRequiredError : string;
    businessSectorInit : IPickerTerms;
}

export default class CustomerForm extends React.Component<CustomerFormProps, CustomerFormState>{
    
    constructor(props : CustomerFormProps,state: CustomerFormState) {

        super(props);
        this.state = {name:null,businessSector:null,logo:null,fieldRequiredError:null,businessSectorInit:null};
    
    }

    private onTaxPickerChange = (terms : IPickerTerms) => {
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
    
    private onFilePickerChange = (logo : IFilePickerResult) => {
        this.setState({
            logo : new PublishingImage(logo)
        });

        
    }

    public logoJSX() {
        if(this.state.logo) {
            return (<img src={this.setLogoSrc()} width="100" height="100"></img>
            )
        }
    }

    public async componentDidMount() {
        
        let id = this.props.id;
        if (id !== undefined && id !== null) {
            let customerService = new CustomerService(this.props.context);
            let customer = await customerService.loadById(id);
            this.setState({
                name : customer.title
            });
            if(customer.logo){
                this.setState({
                    logo : customer.logo
                });
            }
            if(customer.businessSector){
                this.setState({
                    businessSectorInit : [{
                        key : customer.businessSector.ID.toString(),
                        name : customer.businessSector.Label,
                        path : undefined,
                        termSet : undefined
                    }]
                });
                this.setState({
                    businessSector : customer.businessSector
                });
            }       
        }
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
        return (this.state.name != null && this.state.name != "");
    }

    public async save(){
        let customerService = new CustomerService(this.props.context);
        let customer = new Customer();
        customer.id = this.props.id;
        customer.title = this.state.name;
        if(!isEmpty(this.state.businessSector)) customer.businessSector = this.state.businessSector;
        customer.logo = this.state.logo;
        let id = await customerService.save(customer);
        this.props.rerenderParentCallback();     
    }

    public setLogoSrc(){
        if(this.state.logo){
            return this.state.logo.url;
        }
        else {
            return "";
        }
    }

    public saveButtonNotDisabledJSX() {
        return (
            <Link to="/Customers">
        <PrimaryButton text={strings.Save} onClick={() => this.save()}/>        
    </Link>                
        )
    }

    public saveButtonDisabledJSX() {
        return (
        <PrimaryButton text={strings.Save} disabled={true}/>        
        )
    }

    public render(): React.ReactElement<CustomerFormProps> {
        return (<div>
        <TextField required label= {strings.Name+" :"} value={this.state.name} onChange={this.onTitleChange} errorMessage={this.state.fieldRequiredError}/>
        <TaxonomyPicker allowMultipleSelections={false}
                termsetNameOrID={Constants.termsets.businessSector.id}
                panelTitle={strings.BusinessSector}
                initialValues={this.state.businessSectorInit}
                label={strings.BusinessSector+" :"}
                context={this.props.context}
                onChange={this.onTaxPickerChange}
                isTermSetSelectable={false}
                />
        <FilePicker
        label="Logo :"
        buttonLabel={strings.SelectFile}
        accepts= {[".gif", ".jpg", ".jpeg", ".bmp", ".dib", ".tif", ".tiff", ".ico", ".png", ".jxr", ".svg"]}
  onSave={this.onFilePickerChange}
  onChanged={this.onFilePickerChange}
  context={this.props.context}
  hideRecentTab={true}
  hideOneDriveTab={true}
  hideLinkUploadTab={true}
  hideLocalUploadTab={false}
  hideSiteFilesTab={false}
  hideOrganisationalAssetTab={true}
  storeLastActiveTab={false}
  hideWebSearchTab={true}
  buttonIcon="FileImage"/>

<div>{this.logoJSX()}</div>
&nbsp;
<span>
    <Link to="/Customers">
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

