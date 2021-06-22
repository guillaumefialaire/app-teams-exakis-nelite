import { sp } from "@pnp/sp";
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import { getRandomString } from "@pnp/common";
import BaseService from "./BaseService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import BaseListService from "./BaseListService";
import { Constants } from "../constants";
import Softskill from "../models/Softskill";
import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import { taxonomy, ITermStore, ITermSet } from "@pnp/sp-taxonomy";
import { Guid } from "@microsoft/sp-core-library";
import { Web } from "@pnp/sp";
import Term from "../models/Term";
import { ISiteUserProps } from "@pnp/sp/site-users";
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');


export default class SoftskillService extends BaseListService<Softskill> {
    public getFieldsDefinition() {
        return Constants.lists.softskills.fields;
    }
    public initModel(): Softskill {
        return new Softskill();
    }
    public getListUrl(): string {
        return (this.context.pageContext.web.serverRelativeUrl+Constants.lists.softskills.url);
    }

    public async load() : Promise<Softskill[]>{
        const softskills = await super.load();
        const profileId = await this.getProfileId();
        const softskillsCurrentUser = softskills.filter(softskill => softskill.profileId == profileId);
        for (let index = 0; index < softskillsCurrentUser.length; index++) {
        if(softskillsCurrentUser[index].name){
            let term = new Term();
            await term.fromGuid(softskillsCurrentUser[index].name.ID).then(() => {
                softskillsCurrentUser[index].name = term;
            });
        }
    }
        return softskillsCurrentUser;
    }

    public async loadById(id: number) : Promise<Softskill> {

        let softskill = await super.loadById(id);

        if(softskill.name){
            let term = new Term();
            await term.fromGuid(softskill.name.ID).then(() => {
                softskill.name = term;
            });
    }
    return softskill;
    }

    public async save(model: Softskill): Promise<number> {
        let id = await super.save(model);
        return id;
    }

    constructor(context: BaseComponentContext) {
        super(context);
    }


}
