import { sp } from "@pnp/sp";
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import { getRandomString } from "@pnp/common";
import BaseService from "./BaseService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import BaseListService from "./BaseListService";
import { Constants } from "../constants";
import Graduation from "../models/Graduation";
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


export default class GraduationService extends BaseListService<Graduation> {
    public getFieldsDefinition() {
        return Constants.lists.graduations.fields;
    }
    public initModel(): Graduation {
        return new Graduation();
    }
    public getListUrl(): string {
        return (this.context.pageContext.web.serverRelativeUrl+Constants.lists.graduations.url);
    }

    public async load() : Promise<Graduation[]>{
        const graduations = await super.load();
        const profileId = await this.getProfileId();
        const graduationsCurrentUser = graduations.filter(graduation => graduation.profileId == profileId);
        return graduationsCurrentUser;
    }

    public async loadById(id: number) : Promise<Graduation> {

        let graduation = await super.loadById(id);

        if(graduation.diploma){
            let term = new Term();
            await term.fromGuid(graduation.diploma.ID).then(() => {
                graduation.diploma = term;
            });
    }
    if(graduation.school){
        let term = new Term();
        await term.fromGuid(graduation.school.ID).then(() => {
            graduation.school = term;
        });
}
    return graduation;
    }

    public async save(model: Graduation): Promise<number> {
        let id = await super.save(model);
        return id;
    }

    constructor(context: BaseComponentContext) {
        super(context);
    }


}
