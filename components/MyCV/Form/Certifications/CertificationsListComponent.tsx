import * as React from 'react';
import { Route, Link, withRouter, Redirect, useHistory} from 'react-router-dom';
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import CertificationService from '../../../../services/CertificationsService';
import Certification from '../../../../models/Certification';
import styles from '../../../TeamsAppsCv.module.scss';
import { Constants } from '../../../../constants';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { ITextFieldStyles, TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import CertificationForm from './CertificationsFormComponent';
import { Rating } from 'office-ui-fabric-react/lib/Rating';

const searchClass = mergeStyles({
    display: 'block',
    marginBottom: '10px',
  })

  const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

  const addIcon: IIconProps = { iconName: 'Add' };

export interface CertificationsProps extends IBaseComponentProps {
}

export interface CertificationsState {
    items: Certification[];
    showedItems : Certification[];
    isOpen : boolean;
}

class Certifications extends React.Component<CertificationsProps, CertificationsState>{

    private _columns: IColumn[];
    private lang : string;
    

    public renderColumnName(item : Certification) : JSX.Element {
        if(this.lang === "en-us"){
            return(<span>{ item.name.englishStr }</span>)
        } else{
            return(<span>{ item.name.frenchStr }</span>)
        }
    }
    
    public renderColumnButtons(certification : Certification) : JSX.Element {
        let jsxElement : JSX.Element = <span><DefaultButton text={strings.Delete} onClick={() => this.delete(certification.id)}></DefaultButton>
        
        </span>

        return(jsxElement)
    }

    

    constructor(props) {
        super(props);

        this.lang = this.props.context.pageContext.cultureInfo.currentCultureName.toLowerCase();
        this.renderColumnName = this.renderColumnName.bind(this);
        this.load = this.load.bind(this);
        this.renderColumnButtons = this.renderColumnButtons.bind(this);
        
        this.setState({
            items: [],
            isOpen: false
        });

        

        this._columns = [
            { key: 'column1', name: strings.Name, onRender : this.renderColumnName, minWidth: 300, isResizable: true,isCollapsible:true},
            { key: 'column2', name: strings.Company, onRender : this.renderColumnCompany, minWidth: 100, isResizable: true },
            { key: 'column3', name: "", onRender : this.renderColumnButtons, minWidth: 200, isResizable: true},

        ];
    }

    public renderColumnCompany(item : Certification) : JSX.Element {
        if(item.company){
            return(<span>{ item.company.Label}</span>)
        }
    }

    public componentWillMount() {
        this.load();
    }

    public async load() {
        let certificationService = new CertificationService(this.props.context);
        let items = await certificationService.loadByProfileId(this.props.context);

        this.setState({
            items: items,
            showedItems : items
        });
    }
    
    public async delete(id :number){
        let certificationService = new CertificationService(this.props.context);
        let profileId = await certificationService.deleteFromProfile(id,this.props.context);
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
          showedItems: text ? this.state.items.filter(i => (this.lang === "en-us") ? i.name.englishStr.toLowerCase().indexOf(text.toLowerCase()) > -1 : i.name.frenchStr.toLowerCase().indexOf(text.toLowerCase()) > -1) : this.state.items,
        });
      };

    public render(): React.ReactElement {
        return (
            <div>
                <Fabric>
                <TextField
          className={searchClass}
          label={strings.FilterByName+" :"}
          onChange={this._onFilter}
          styles={textFieldStyles}
        />
        <Link to="/MyCV/Edit/Certifications/Form">
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
 
      <Route path="/MyCV/Edit/Certifications/Form" render={(props) => (
       <Panel
       headerText={strings.Certification}
       isOpen={true}
    hasCloseButton={false}
     >
         <CertificationForm rerenderParentCallback={this.load} context={this.props.context} teamsContext={this.props.teamsContext} />
         </Panel>
         )}/>

            
            </div>
        );
    }
}

export default withRouter(Certifications);