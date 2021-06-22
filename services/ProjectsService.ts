import { sp } from "@pnp/sp";
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import { getRandomString } from "@pnp/common";
import BaseService from "./BaseService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import BaseListService from "./BaseListService";
import { Constants } from "../constants";
import Project from "../models/Project";
import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import { taxonomy, ITermStore, ITermSet, TermStore } from "@pnp/sp-taxonomy";
import { Guid } from "@microsoft/sp-core-library";
import { Web } from "@pnp/sp";
import Term from "../models/Term";
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');


export default class ProjectService extends BaseListService<Project> {
    public getFieldsDefinition() {
        return Constants.lists.projects.fields;
    }
    public initModel(): Project {
        return new Project();
    }
    public getListUrl(): string {
        return (this.context.pageContext.web.serverRelativeUrl+Constants.lists.projects.url);
    }

    public async load() : Promise<Project[]>{

        let projects = await super.load()

        for (let index = 0; index < projects.length; index++) {
            if(projects[index].type){
                let term = new Term();
                await term.fromGuid(projects[index].type.ID).then(() => {
                    projects[index].type = term;
                });
            }         
        }

        for (let index = 0; index < projects.length; index++) {
            if(projects[index].customerID){

                let customerJson = await this.web.getList(this.context.pageContext.web.serverRelativeUrl+Constants.lists.customers.url).items.getById(projects[index].customerID).select(Constants.lists.customers.fields.name).get();
                projects[index].customerName = customerJson[Constants.lists.customers.fields.name];
            }
            
        }

        return projects;
    }

    public async loadById(id: number) : Promise<Project> {

        let project = await super.loadById(id);

        if(project.customerID){

            let customerJson = await this.web.getList(this.context.pageContext.web.serverRelativeUrl+Constants.lists.customers.url).items.getById(project.customerID).select(Constants.lists.customers.fields.name).get();
            project.customerName = customerJson[Constants.lists.customers.fields.name];
        }

        if(project.businessSector){
            let term = new Term();
                await term.fromGuid(project.businessSector.ID).then(() => {
                    project.businessSector = term;
                });
        }

        if(project.type){
            let term = new Term();
                await term.fromGuid(project.type.ID).then(() => {
                    project.type = term;
                });
        }

        if(project.technos){
            let terms : Term[] = []

            for (let index = 0; index < project.technos.length; index++) {
                let term = new Term();
                await term.fromGuid(project.technos[index].ID).then(() =>{
                    terms.push(term)
                })
            }
            
            project.technos = terms;
        }

        return project;
    }

    public async save(model: Project,listUrl? : string): Promise<number> {
        let id = await super.save(model,listUrl);
        
      //saving multiple taxo field  
       const data = {}
       data[Constants.termsets.techno.staticName] = ''

       model.technos.forEach(techno => {
        data[Constants.termsets.techno.staticName] += '-1;#'+techno.Label+'|'+techno.ID+';#'
       })

        await this.getList().items.getById(id).update(data)
        return id;
    }

    public async getProjectListId() : Promise<string> {
        let projectListJson = await (this.web.getList(this.context.pageContext.web.serverRelativeUrl+Constants.lists.projects.url).select("Id").get())
        let id = projectListJson['Id']
        return id
    }

    constructor(context: BaseComponentContext) {
        super(context);
    }


}
