import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import { getRandomString } from "@pnp/common";
import BaseService from "./BaseService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import BaseListService from "./BaseListService";
import { Constants } from "../constants";
import Profile from "../models/Profile";
import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import { taxonomy, ITermStore, ITermSet, TermStore } from "@pnp/sp-taxonomy";
import { Guid } from "@microsoft/sp-core-library";
import { Web } from "@pnp/sp";
import Term from "../models/Term";
import { ISiteUserProps } from "@pnp/sp/site-users";
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');


export default class ProfileService extends BaseListService<Profile> {
    public getFieldsDefinition() {
        return Constants.lists.profiles.fields;
    }
    public initModel(): Profile {
        return new Profile();
    }
    public getListUrl(): string {
        return (this.context.pageContext.web.serverRelativeUrl+Constants.lists.profiles.url);
    }

    public async loadbyId(id:number) : Promise<Profile>{
        let profile = await super.loadById(id);
        if(profile.branch){
            let term = new Term();
            await term.fromGuid(profile.branch.ID).then(() => {
                profile.branch = term;
            });
        }
        if(profile.serviceLine){
            let term = new Term();
            await term.fromGuid(profile.serviceLine.ID).then(() => {
                profile.serviceLine = term;
            });
        }
        return profile;
    }

    public async save(model: Profile): Promise<number> {
        let profileId : number = await super.save(model);        
        return profileId;
    }


    constructor(context: BaseComponentContext) {
        super(context);
    }
}
