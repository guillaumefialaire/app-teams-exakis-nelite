import * as React from 'react';
import { Route, Link, withRouter, Redirect, useHistory} from 'react-router-dom';
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../../interfaces/IBaseComponentProps';
import CustomerService from '../../services/CustomersService';
import Customer from '../../models/Customer';
import CustomerForm from '../Customers/CustomerFormComponent';
import styles from './../TeamsAppsCv.module.scss';
import { Constants } from '../../constants';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { ITextFieldStyles, TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { Panel } from 'office-ui-fabric-react/lib/Panel';



const searchClass = mergeStyles({
    display: 'block',
    marginBottom: '10px',
  })

  const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

  const addIcon: IIconProps = { iconName: 'Add' };

  
  

export interface CustomersProps extends IBaseComponentProps {
}

export interface CustomersState {
    items: Customer[];
    showedItems : Customer[];
    isOpen : boolean;
}

class Customers extends React.Component<CustomersProps, CustomersState>{


    private _columns: IColumn[];
    public id : number
    

    public renderColumnBusinessSector(item : Customer) : JSX.Element {
        if(item.businessSector){
            return(<span>{ item.businessSector.Label }</span>)
        }
    }
    
    public renderColumnButtons(customer : Customer) : JSX.Element {
        let jsxElement : JSX.Element = <span><DefaultButton text={strings.Delete} onClick={() => this.delete(customer.id)}></DefaultButton>&nbsp;&nbsp;

        <Link to={"/Customers/Form/"+customer.id}>
        <DefaultButton text={strings.Edit}></DefaultButton>
        </Link>
        
        </span>

        return(jsxElement)
    }

    

    constructor(props) {
        super(props);

        this.load = this.load.bind(this);
        this.renderColumnButtons = this.renderColumnButtons.bind(this);
        
        this.setState({
            items: [],
            isOpen: false
        });

        

        this._columns = [
            { key: 'column1', name: strings.Name, fieldName: 'title', minWidth: 100, isResizable: true },
            { key: 'column2', name: strings.BusinessSector, onRender : this.renderColumnBusinessSector, minWidth: 100, isResizable: true },
            { key: 'column3', name: "", onRender : this.renderColumnButtons, minWidth: 200, isResizable: true},

        ];
    }

    public componentWillMount() {
        this.load();
    }

    public async load() {
        let customerService = new CustomerService(this.props.context);
        let items = await customerService.load();

        this.setState({
            items: items,
            showedItems : items
        });
    }
    
    public async delete(id :number){
        let customerService = new CustomerService(this.props.context);
        await customerService.delete(id);
        this.load(); 
    }

    public getItems(){
        if(this.state && !isEmpty(this.state.showedItems)){
            return this.state.showedItems;
        } else {
            return []
        }
    }
    
    private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
        this.setState({
          showedItems: text ? this.state.items.filter(i => i.title.toLowerCase().indexOf(text.toLowerCase()) > -1) : this.state.items,
        });
      };

    public render(): React.ReactElement {
        return (
            <div className={styles.test}>
                <Fabric>
                <TextField
          className={searchClass}
          label={strings.FilterByName+" :"}
          onChange={this._onFilter}
          styles={textFieldStyles}
        />
        <Link to="/Customers/Form">
        <DefaultButton text={strings.Add} iconProps={addIcon}/>
        </Link>
          <DetailsList
            items={this.getItems()}
            columns={this._columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            compact={true}
          />
      </Fabric>
 
      <Route path="/Customers/Form/:id?" render={(props) => (
       <Panel
       headerText={strings.Customer}
       isOpen={true}
    hasCloseButton={false}
     >
         <CustomerForm id={props.match.params.id} rerenderParentCallback={this.load} context={this.props.context} teamsContext={this.props.teamsContext} />
         </Panel>
         )}/>

            
            </div>
        );
    }
}

export default withRouter(Customers);