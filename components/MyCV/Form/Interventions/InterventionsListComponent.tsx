import * as React from 'react';
import { Route, Link, withRouter, Redirect, useHistory} from 'react-router-dom';
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import InterventionService from '../../../../services/InterventionsService';
import Intervention from '../../../../models/Intervention';
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
import InterventionForm from './InterventionsFormComponent';
import { Rating } from 'office-ui-fabric-react/lib/Rating';
import ProjectForm from './ProjectFormComponent'

const searchClass = mergeStyles({
    display: 'block',
    marginBottom: '10px',
  })

  const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

  const addIcon: IIconProps = { iconName: 'Add' };

export interface InterventionsProps extends IBaseComponentProps {
}

export interface InterventionsState {
    items: Intervention[];
    showedItems : Intervention[];
    isOpen : boolean;
    interId : number;
}

class Interventions extends React.Component<InterventionsProps, InterventionsState>{

    private _columns: IColumn[];
    public id : number;

    public renderColumnProjectName(item : Intervention) : JSX.Element {    
        return(<span>{ item.projectName }</span>)
    }

    public renderColumnStartDate(item : Intervention) : JSX.Element {
    return(<span>{item.startDate.toDateString()}</span>)
    }
    
    public renderColumnButtons(intervention : Intervention) : JSX.Element {
        let jsxElement : JSX.Element = <span><DefaultButton text={strings.Delete} onClick={() => this.delete(intervention.id)}></DefaultButton>&nbsp;&nbsp;

        <Link to={"/MyCV/Edit/Interventions/Form/"+intervention.id}>
        <DefaultButton text={strings.Edit} onClick={() => this.setState({interId : intervention.id})
}></DefaultButton>
        </Link>
        
        </span>

        return(jsxElement)
    }

    

    constructor(props) {
        super(props);
        this.state = {interId:null,isOpen:false,items:null,showedItems:null}

        this.renderColumnButtons = this.renderColumnButtons.bind(this);
        this.renderColumnProjectName = this.renderColumnProjectName.bind(this);
        this.load = this.load.bind(this);
        
        this.setState({
            items: [],
            isOpen: false
        });

        

        this._columns = [
            { key: 'column1', name: strings.Project, onRender : this.renderColumnProjectName, minWidth: 100, isResizable: true,isCollapsible:true},
            { key: 'column2', name: strings.StartingDate, onRender : this.renderColumnStartDate, minWidth: 100, isResizable: true},
            { key: 'column3', name: "", onRender : this.renderColumnButtons, minWidth: 200, isResizable: true},

        ];
    }

    public componentWillMount() {
        this.load();
    }

    public async load() {
        let interventionService = new InterventionService(this.props.context);
        let items = await interventionService.loadByProfileId(this.props.context);

        this.setState({
            items: items,
            showedItems : items
        });
    }
    
    public async delete(id :number){
        let interventionService = new InterventionService(this.props.context);
        await interventionService.delete(id);
        await interventionService.deleteFromProfile(id,this.props.context);
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
            showedItems: text ? this.state.items.filter(i => i.projectName.toLowerCase().indexOf(text.toLowerCase()) > -1) : this.state.items,
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
        <Link to="/MyCV/Edit/Interventions/Form">
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
 
      <Route path="/MyCV/Edit/Interventions/Form/:id?" render={(props) => (
       <Panel
       headerText={strings.Intervention}
       isOpen={true}
    hasCloseButton={false}
     >
         <InterventionForm id={props.match.params.id} rerenderParentCallback={this.load} context={this.props.context} teamsContext={this.props.teamsContext} />
         </Panel>
         )}/>
         <Route path="/MyCV/Edit/Interventions/ProjectForm" render={() => (
       <Panel
       headerText={strings.Project}
       isOpen={true}
    hasCloseButton={false}
     >
         <ProjectForm interId={this.state.interId} context={this.props.context} teamsContext={this.props.teamsContext}/>
         </Panel>
         )}/>

            
            </div>
        );
    }
}

export default withRouter(Interventions);