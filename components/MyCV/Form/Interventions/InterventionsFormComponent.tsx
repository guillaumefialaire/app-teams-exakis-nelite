import * as React from 'react';
import { Route, NavLink, Link, IndexRoute, hashHistory, withRouter } from 'react-router-dom';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import InterventionService from '../../../../services/InterventionsService';
import Intervention from '../../../../models/Intervention';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { TaxonomyPicker, IPickerTerms, UpdateType, UpdateAction} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import Term from '../../../../models/Term';
import {Constants} from '../../../../constants';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import styles from './../../../TeamsAppsCv.module.scss';
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating';
import * as strings from 'TeamsAppsCvWebPartStrings';
import Multilingual from './../../../../models/Multilingual';
import MultilingualField from '../../../MultilingualFieldComponent';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { ListItemPicker } from '@pnp/spfx-controls-react/lib/ListItemPicker';
import ProjectService from '../../../../services/ProjectsService';
import { IconButton, Panel } from 'office-ui-fabric-react';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

export interface InterventionFormProps extends IBaseComponentProps {
    id : number;
    rerenderParentCallback : () => void;
}

export interface InterventionFormState{
    projectListId : string;
    projectId: number;
    startDate : Date;
    defaultProject : any[];
    duration : number;
    roles : Term[];
    rolesInit : IPickerTerms;
    technos : Term[];
    technosInit : IPickerTerms;
    enMission : string;
    frMission : string;
    include : boolean;
}

export default class InterventionForm extends React.Component<InterventionFormProps, InterventionFormState>{
    
    constructor(props : InterventionFormProps,state: InterventionFormState) {
        super(props);
        this.state = {projectListId:null,projectId:null,startDate:null,defaultProject:null,duration : null,roles:null,rolesInit:null,enMission:null,frMission:null,technos:null,technosInit:null,include:null};
        this.onSelectedItem = this.onSelectedItem.bind(this);
        this.onDurationValidate = this.onDurationValidate.bind(this);
        this.onDurationIncrement = this.onDurationIncrement.bind(this);
        this.onDurationDecrement = this.onDurationDecrement.bind(this);
    }

    public onIncludeChange = (ev: React.MouseEvent<HTMLElement>, checked: boolean) => {
        this.setState({
            include : checked
        })
    }

    public onEnMissionChange = (event) =>{
        const { value } = event.target;
        this.setState({
            enMission : value
        })
    }

    public onFrMissionChange = (event) =>{
        const { value } = event.target;
        this.setState({
            frMission : value
        })    
    }

    public onRolesChange = (terms : IPickerTerms) => {
        if(terms != null && !isEmpty(terms)){
            let Terms : Term[] = []
            terms.forEach(term => {
                Terms.push(new Term({TermGuid : term.key, Label : term.name}))
            });
            this.setState({
               roles : Terms
            });
        }
        else {
            this.setState({
                roles : null
            });
        }
        
    }

    public onTechnosChange = (terms : IPickerTerms) => {
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
        
        let id = this.props.id;
        let projectService = new ProjectService(this.props.context);
        let projectListID = await projectService.getProjectListId();
        this.setState({projectListId : projectListID});
        if (id !== undefined && id !== null) {
            
            let interventionService = new InterventionService(this.props.context);
            let intervention = await interventionService.loadById(id);

            if(intervention.projectId){
                this.setState({
                    projectId : intervention.projectId,
                    defaultProject : [{key : intervention.projectId,
                        name : intervention.projectName}],
                    })
            }

            if(intervention.include !== null && intervention.include !== undefined){
                this.setState({
                    include : intervention.include
                })
            } else {
                this.setState({
                    include : true
                })
            }

            if(intervention.mission){
                if(intervention.mission.englishStr)
                this.setState({enMission : (intervention.mission.englishStr) })
                if(intervention.mission.frenchStr)
                this.setState({frMission : (intervention.mission.frenchStr) })
            }

            if(intervention.startDate){
                this.setState({
                    startDate : intervention.startDate,
                })
            }
            
            if(intervention.duration){
                this.setState({
                    duration : intervention.duration,
                })
            }

            if(intervention.roles){
                let terms : IPickerTerms = []
                intervention.roles.forEach(term => {
                    terms.push({
                        key : term.ID.toString(),
                        name : term.Label,
                        path : undefined,
                        termSet : undefined
                    })
                })
                this.setState({
                    rolesInit : terms
                })
                this.setState({
                    roles : intervention.roles
                })
            }
            
            if(intervention.technos){
                let terms : IPickerTerms = []
                intervention.technos.forEach(term => {
                    terms.push({
                        key : term.ID.toString(),
                        name : term.Label,
                        path : undefined,
                        termSet : undefined
                    })
                })
                this.setState({
                    technosInit : terms
                })
                this.setState({
                    technos : intervention.technos
                })
            } 

        } else {
            this.setState({
                defaultProject : [],
            })
        }
    }


    public isValid() : boolean {
        return (this.state.projectId !== null && this.state.startDate !== null && this.state.duration !== null && !isEmpty(this.state.roles) && !isEmpty(this.state.technos));
    }

    public async save(){
        let interventionService = new InterventionService(this.props.context);
        let intervention = new Intervention();
        intervention.projectId = this.state.projectId;
        intervention.startDate = this.state.startDate;
        intervention.duration = this.state.duration;
        intervention.roles = this.state.roles;
        intervention.technos = this.state.technos;
        intervention.include = this.state.include;
        intervention.mission = new Multilingual(this.state.frMission,this.state.enMission)
        if(this.props.id){
        intervention.id = this.props.id;
        await interventionService.save(intervention).then(() => {
            this.props.rerenderParentCallback(); 
        });
        } else {
            let interId = await interventionService.save(intervention);
            interventionService.addToProfile(interId,this.props.context).then(() => {
                this.props.rerenderParentCallback(); 
            })
        } 
    }


    public saveButtonNotDisabledJSX() {
        return (
            <Link to="/MyCV/Edit/Interventions">
        <PrimaryButton text={strings.Save} onClick={() => this.save()}/>        
    </Link>                
        )
    }

    public saveButtonDisabledJSX() {
        return (
        <PrimaryButton text={strings.Save} disabled={true}/>        
        )
    }

    private onSelectedItem(items: { key: string; name: string }[]) {
        if(isEmpty(items)){
            this.setState({projectId : null})
        } else{
            this.setState({projectId : +items[0].key});


    }
  }

  private ListItemPickerRender() : JSX.Element {
      return (<ListItemPicker
        noResultsFoundText={strings.ProjectNotFoundMsg}
        listId={this.state.projectListId}
        columnInternalName={Constants.lists.projects.fields.name}
        keyColumnInternalName={Constants.lists.projects.fields.id}
        context={this.props.context}
        itemLimit={1}
        onSelectedItem={this.onSelectedItem}
        defaultSelectedItems={this.state.defaultProject}/>)
  }

  private onDurationValidate(duration : string) {
    this.setState({duration : parseInt(duration)})
    return(duration);
  }

  private onDurationIncrement(duration : string) {
    this.setState({duration : parseInt(duration)+1})
    return(String(+duration+1));
  }

  private onDurationDecrement(duration : string) {
    this.setState({duration : parseInt(duration)-1})
    return(String(+duration-1));
  }

    public render(): React.ReactElement<InterventionFormProps> {
        return (
<div>

    <div>
        <span>{strings.Project+" :"}</span>
        <span className={styles.redFont}>*</span>
    </div>

    <div className={styles.clearfix}>      
        <div className={styles.itemPickerFloating}>
            {this.state.defaultProject && this.ListItemPickerRender()}
        </div>

        <div className={styles.buttonFloating}>
        <Link to="/MyCV/Edit/Interventions/ProjectForm">
        <IconButton iconProps={{ iconName: 'Add' }} title={strings.AddProject} ariaLabel={strings.AddProject}/>
        </Link>
        </div>
    </div>

    <div>
        <DatePicker 
        label={strings.StartingDate+" :"}
        isRequired
        value={this.state.startDate}
        onSelectDate={(date) => {
            this.setState({startDate : date})
        }}
        />
    </div>

    <div>
        <SpinButton
        className={styles.taxoRequired}
        value={this.state && this.state.duration && this.state.duration.toString()}
        label={strings.Duration+" : (in months)"}
        min={1}
        step={1}
        onValidate={this.onDurationValidate}
        onDecrement={this.onDurationDecrement}
        onIncrement={this.onDurationIncrement}
        />
    </div>

    <div className={styles.taxoRequired}>
    <TaxonomyPicker allowMultipleSelections={true}
                    termsetNameOrID={Constants.termsets.interventionRoles.id}
                    panelTitle={strings.Roles}
                    initialValues={this.state.rolesInit}
                    label={strings.Roles+" :"}
                    context={this.props.context}
                    onChange={this.onRolesChange}
                    isTermSetSelectable={false}
                    />
    </div>

    <div>
    <MultilingualField onEnglishChangeParent={this.onEnMissionChange} onFrenchChangeParent={this.onFrMissionChange} frenchValue={this.state.frMission} englishValue={this.state.enMission} context={this.props.context} teamsContext={this.props.teamsContext} label={strings.Mission+" :"} isRequired={false} isDisabled={false}/>
    </div>

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

    <div>
    <Toggle label={strings.IncludeInCv+" :"} checked={this.state.include} onText={strings.Yes} offText={strings.No} onChange={this.onIncludeChange} />
    </div>

    <div>
    <span>
        <Link to="/MyCV/Edit/Interventions">
                <DefaultButton text={strings.Cancel}/>

        </Link>
        &nbsp;
        &nbsp;
        {this.isValid() && this.saveButtonNotDisabledJSX()}
        {!this.isValid() && this.saveButtonDisabledJSX()}        
    </span>
    </div>
</div>);
    }
}