import * as React from 'react';
import { Route, Link, withRouter, Redirect, useHistory} from 'react-router-dom';
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import SoftskillService from '../../../../services/SoftskillsService';
import Softskill from '../../../../models/Softskill';
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
import SoftskillForm from './SoftskillsFormComponent';
import { Rating } from 'office-ui-fabric-react/lib/Rating';



const searchClass = mergeStyles({
    display: 'block',
    marginBottom: '10px',
  })

  const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

  const addIcon: IIconProps = { iconName: 'Add' };

export interface SoftskillsProps extends IBaseComponentProps {
}

export interface SoftskillsState {
    items: Softskill[];
    showedItems : Softskill[];
    isOpen : boolean;
}

class Softskills extends React.Component<SoftskillsProps, SoftskillsState>{


    private _columns: IColumn[];
    public id : number
    

    public renderColumnName(item : Softskill) : JSX.Element {
        if(item.name){
            return(<span>{ item.name.Label }</span>)
        }
    }

    public renderColumnLevel(item : Softskill) : JSX.Element {
        if(item.level){
            return(<span><Rating
                min={1}
                max={10}
                rating={item.level}
                readOnly
              /></span>)
        }
    }
    
    public renderColumnButtons(softskill : Softskill) : JSX.Element {
        let jsxElement : JSX.Element = <span><DefaultButton text={strings.Delete} onClick={() => this.delete(softskill.id)}></DefaultButton>&nbsp;&nbsp;

        <Link to={"/MyCV/Edit/Softskills/Form/"+softskill.id}>
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
            { key: 'column1', name: strings.Name, onRender : this.renderColumnName, minWidth: 100, isResizable: true },
            { key: 'column2', name: strings.Level, onRender : this.renderColumnLevel, minWidth: 200, isResizable: true },
            { key: 'column3', name: "", onRender : this.renderColumnButtons, minWidth: 200, isResizable: true},

        ];
    }

    public componentWillMount() {
        this.load();
    }

    public async load() {
        let softskillService = new SoftskillService(this.props.context);
        let items = await softskillService.load();

        this.setState({
            items: items,
            showedItems : items
        });
    }
    
    public async delete(id :number){
        let softskillService = new SoftskillService(this.props.context);
        await softskillService.delete(id);
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
          showedItems: text ? this.state.items.filter(i => i.name.Label.toLowerCase().indexOf(text.toLowerCase()) > -1) : this.state.items,
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
        <Link to="/MyCV/Edit/Softskills/Form">
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
 
      <Route path="/MyCV/Edit/Softskills/Form/:id?" render={(props) => (
       <Panel
       headerText={strings.Softskill}
       isOpen={true}
    hasCloseButton={false}
     >
         <SoftskillForm id={props.match.params.id} rerenderParentCallback={this.load} context={this.props.context} teamsContext={this.props.teamsContext} />
         </Panel>
         )}/>

            
            </div>
        );
    }
}

export default withRouter(Softskills);