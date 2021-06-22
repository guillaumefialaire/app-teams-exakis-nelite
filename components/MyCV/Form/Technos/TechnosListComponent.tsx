import * as React from 'react';
import { Route, Link, withRouter, Redirect, useHistory} from 'react-router-dom';
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import TechnoService from '../../../../services/TechnosService';
import Techno from '../../../../models/Techno';
import styles from './../../../TeamsAppsCv.module.scss';
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
import TechnoForm from './TechnosFormComponent';
import { Rating } from 'office-ui-fabric-react/lib/Rating';



const searchClass = mergeStyles({
    display: 'block',
    marginBottom: '10px',
  })

  const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

  const addIcon: IIconProps = { iconName: 'Add' };

export interface TechnosProps extends IBaseComponentProps {
}

export interface TechnosState {
    items: Techno[];
    showedItems : Techno[];
    isOpen : boolean;
}

class Technos extends React.Component<TechnosProps, TechnosState>{


    private _columns: IColumn[];
    public id : number
    

    public renderColumnName(item : Techno) : JSX.Element {
        if(item.name){
            return(<span>{ item.name.Label }</span>)
        }
    }

    public renderColumnLevel(item : Techno) : JSX.Element {
        if(item.level){
            return(<span><Rating
                min={1}
                max={10}
                rating={item.level}
                readOnly
              /></span>)
        }
    }
    
    public renderColumnButtons(techno : Techno) : JSX.Element {
        let jsxElement : JSX.Element = <span><DefaultButton text={strings.Delete} onClick={() => this.delete(techno.id)}></DefaultButton>&nbsp;&nbsp;

        <Link to={"/MyCV/Edit/Technos/Form/"+techno.id}>
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
        let technoService = new TechnoService(this.props.context);
        let items = await technoService.load();

        this.setState({
            items: items,
            showedItems : items
        });
    }
    
    public async delete(id :number){
        let technoService = new TechnoService(this.props.context);
        await technoService.delete(id);
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
        <Link to="/MyCV/Edit/Technos/Form">
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
 
      <Route path="/MyCV/Edit/Technos/Form/:id?" render={(props) => (
       <Panel
       headerText={strings.Techno}
       isOpen={true}
    hasCloseButton={false}
     >
         <TechnoForm id={props.match.params.id} rerenderParentCallback={this.load} context={this.props.context} teamsContext={this.props.teamsContext} />
         </Panel>
         )}/>

            
            </div>
        );
    }
}

export default withRouter(Technos);