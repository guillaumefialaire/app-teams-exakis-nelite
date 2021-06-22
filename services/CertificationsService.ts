import { sp } from "@pnp/sp";
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import { getRandomString } from "@pnp/common";
import BaseService from "./BaseService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import BaseListService from "./BaseListService";
import { Constants } from "../constants";
import Certification from "../models/Certification";
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


export default class CertificationService extends BaseListService<Certification> {
    public getFieldsDefinition() {
        return Constants.lists.certifications.fields;
    }
    public initModel(): Certification {
        return new Certification();
    }
    public getListUrl(): string {
        return (this.context.pageContext.web.serverRelativeUrl+Constants.lists.certifications.url);
    }

    public async loadByProfileId(context: BaseComponentContext) : Promise<Certification[]>{
        
        const profileService = new ProfileService(context);
        
        const profileId = await this.getProfileId();

        const profile = await profileService.loadbyId(profileId);

        const certifIds = profile.certifications;

        let certifications = []

        for (let index = 0; index < certifIds.length; index++) {
            await super.loadById(certifIds[index]).then((certif) =>{
                if(certif.company){
                    let term = new Term();
                    term.fromGuid(certif.company.ID).then(() => {
                        certif.company = term;
                    });
            }
             certifications.push(certif)            
            })
        }

        return certifications;
    }

    public async loadById(id: number) : Promise<Certification> {

        let certification = await super.loadById(id);

        if(certification.company){
            let term = new Term();
            await term.fromGuid(certification.company.ID).then(() => {
                certification.company = term;
            });
    }
   
    return certification;
    }

    public async save(model: Certification): Promise<number> {
        let id = await super.save(model);
        return id;
    }

    public async addToProfile(id : number, context : BaseComponentContext): Promise<number> {
        const profileService = new ProfileService(context);
        const profileId = await super.getProfileId();
        let profile = await profileService.loadbyId(profileId);
        profile.certifications.push(id);
        return await profileService.save(profile);
    }

    public async deleteFromProfile(id : number,context: BaseComponentContext) : Promise<number>{
        const profileService = new ProfileService(context);
        const profileId = await super.getProfileId();
        let profile = await profileService.loadbyId(profileId);
        profile.certifications = profile.certifications.filter(certif => certif !== id);
        return await profileService.save(profile);     
    }

    public async getCertificationsListId() : Promise<string> {
        let certificationsListJson = await (this.web.getList(this.context.pageContext.web.serverRelativeUrl+Constants.lists.certifications.url).select("Id").get())
        let id = certificationsListJson['Id']
        return id
    }

    constructor(context: BaseComponentContext) {
        super(context);
    }



}
