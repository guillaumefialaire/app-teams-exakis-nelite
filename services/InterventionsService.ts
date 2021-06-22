import { sp } from "@pnp/sp";
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import { getRandomString } from "@pnp/common";
import BaseService from "./BaseService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import BaseListService from "./BaseListService";
import { Constants } from "../constants";
import Intervention from "../models/Intervention";
import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import { taxonomy, ITermStore, ITermSet } from "@pnp/sp-taxonomy";
import { Guid } from "@microsoft/sp-core-library";
import { Web } from "@pnp/sp";
import Term from "../models/Term";
import { ISiteUserProps } from "@pnp/sp/site-users";
import ProfileService from './ProfileService'

require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');


export default class InterventionService extends BaseListService<Intervention> {
    public getFieldsDefinition() {
        return Constants.lists.interventions.fields;
    }
    public initModel(): Intervention {
        return new Intervention();
    }
    public getListUrl(): string {
        return (this.context.pageContext.web.serverRelativeUrl+Constants.lists.interventions.url);
    }

    public async loadByProfileId(context: BaseComponentContext) : Promise<Intervention[]>{

        const profileService = new ProfileService(context);
        
        const profileId = await this.getProfileId();

        const profile = await profileService.loadbyId(profileId);

        const interventionsIds = profile.interventions;

        let interventions = []

        for (let index = 0; index < interventionsIds.length; index++) {
            
            await super.loadById(interventionsIds[index]).then(async (inter) =>{       
                await this.web.getList(this.context.pageContext.web.serverRelativeUrl+Constants.lists.projects.url)
                .items.getById(inter.projectId)
                .select(Constants.lists.projects.fields.name).get().then((json) => {
                    inter.projectName = json[Constants.lists.projects.fields.name];
                    interventions.push(inter);
                })      
            })
        }

        return interventions;
    }

    public async loadById(id: number) : Promise<Intervention> {

        let intervention = await super.loadById(id);
        
        if(intervention.projectId){
            let projectJson = await this.web.getList(this.context.pageContext.web.serverRelativeUrl+Constants.lists.projects.url).items.getById(intervention.projectId).select(Constants.lists.projects.fields.name).get();
            intervention.projectName = projectJson[Constants.lists.projects.fields.name];
        }

        if(intervention.roles){
            let terms : Term[] = []

            for (let index = 0; index < intervention.roles.length; index++) {
                let term = new Term();
                await term.fromGuid(intervention.roles[index].ID).then(() =>{
                    terms.push(term)
                })
            }
            
            intervention.roles = terms;
        }

        if(intervention.technos){
            let terms : Term[] = []

            for (let index = 0; index < intervention.technos.length; index++) {
                let term = new Term();
                await term.fromGuid(intervention.technos[index].ID).then(() =>{
                    terms.push(term)
                })
            }
            
            intervention.technos = terms;
        }
        
    return intervention;
    }

    public async save(model: Intervention): Promise<number> {
        let id = await super.save(model);
        let data = {}
        data[Constants.termsets.interventionRoles.staticName] = ''
 
        model.roles.forEach(role => {
         data[Constants.termsets.interventionRoles.staticName] += '-1;#'+role.Label+'|'+role.ID+';#'
        })
 
         await this.getList().items.getById(id).update(data)

        let dataTech = {}
        dataTech[Constants.termsets.techno.staticName] = ''
 
        model.technos.forEach(techno => {
         dataTech[Constants.termsets.techno.staticName] += '-1;#'+techno.Label+'|'+techno.ID+';#'
        })
         
        await this.getList().items.getById(id).update(dataTech)
        
        return id;
    }

    public async addToProfile(id : number, context : BaseComponentContext): Promise<number> {
        //adapter
        const profileService = new ProfileService(context);
        const profileId = await super.getProfileId();
        let profile = await profileService.loadbyId(profileId);
        profile.interventions.push(id);
        return await profileService.save(profile);
    }

    public async deleteFromProfile(id : number,context: BaseComponentContext) : Promise<number>{
        const profileService = new ProfileService(context);
        const profileId = await super.getProfileId();
        let profile = await profileService.loadbyId(profileId);
        profile.interventions = profile.interventions.filter(inter => inter !== id);
        return await profileService.save(profile);     
    }

    constructor(context: BaseComponentContext) {
        super(context);
    }


}
