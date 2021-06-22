import * as React from 'react';
import { Route, Link, withRouter, Redirect, useHistory} from 'react-router-dom';
import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import GraduationService from '../../../../services/GraduationsService';
import Graduation from '../../../../models/Graduation';
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
import GraduationForm from './GraduationsFormComponent';
import { Rating } from 'office-ui-fabric-react/lib/Rating';

const searchClass = mergeStyles({
    display: 'block',
    marginBottom: '10px',
  })

  const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

  const addIcon: IIconProps = { iconName: 'Add' };

export interface GraduationsProps extends IBaseComponentProps {
}

export interface GraduationsState {
    items: Graduation[];
    showedItems : Graduation[];
    isOpen : boolean;
}

class Graduations extends React.Component<GraduationsProps, GraduationsState>{

    private _columns: IColumn[];
    public id : number;
    private lang : string;
    

    public renderColumnName(item : Graduation) : JSX.Element {
        if(this.lang === "en-us"){
            return(<span>{ item.name.englishStr }</span>)
        } else{
            return(<span>{ item.name.frenchStr }</span>)
        }
    }
    
    public renderColumnButtons(graduation : Graduation) : JSX.Element {
        let jsxElement : JSX.Element = <span><DefaultButton text={strings.Delete} onClick={() => this.delete(graduation.id)}></DefaultButton>&nbsp;&nbsp;

        <Link to={"/MyCV/Edit/Graduations/Form/"+graduation.id}>
        <DefaultButton text={strings.Edit}></DefaultButton>
        </Link>
        
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
            { key: 'column3', name: "", onRender : this.renderColumnButtons, minWidth: 200, isResizable: true},

        ];
    }

    public componentWillMount() {
        this.load();
    }

    public async load() {
        let graduationService = new GraduationService(this.props.context);
        let items = await graduationService.load();

        this.setState({
            items: items,
            showedItems : items
        });
    }
    
    public async delete(id :number){
        let graduationService = new GraduationService(this.props.context);
        await graduationService.delete(id);
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
        <Link to="/MyCV/Edit/Graduations/Form">
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
 
      <Route path="/MyCV/Edit/Graduations/Form/:id?" render={(props) => (
       <Panel
       headerText={strings.Graduation}
       isOpen={true}
    hasCloseButton={false}
     >
         <GraduationForm id={props.match.params.id} rerenderParentCallback={this.load} context={this.props.context} teamsContext={this.props.teamsContext} />
         </Panel>
         )}/>

            
            </div>
        );
    }
}

export default withRouter(Graduations);