import { sp } from "@pnp/sp";
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import { getRandomString } from "@pnp/common";
import BaseService from "./BaseService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import BaseListService from "./BaseListService";
import { Constants } from "../constants";
import Techno from "../models/Techno";
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


export default class TechnoService extends BaseListService<Techno> {
    public getFieldsDefinition() {
        return Constants.lists.technos.fields;
    }
    public initModel(): Techno {
        return new Techno();
    }
    public getListUrl(): string {
        return (this.context.pageContext.web.serverRelativeUrl+Constants.lists.technos.url);
    }

    public async load() : Promise<Techno[]>{
        const technos = await super.load();
        const profileId = await this.getProfileId();
        const technosCurrentUser = technos.filter(techno => techno.profileId == profileId);
        for (let index = 0; index < technosCurrentUser.length; index++) {
        if(technosCurrentUser[index].name){
            let term = new Term();
            await term.fromGuid(technosCurrentUser[index].name.ID).then(() => {
                technosCurrentUser[index].name = term;
            });
        }
    }
        return technosCurrentUser;
    }

    public async loadById(id: number) : Promise<Techno> {

        let techno = await super.loadById(id);

        if(techno.name){
            let term = new Term();
            await term.fromGuid(techno.name.ID).then(() => {
                techno.name = term;
            });
    }
    return techno;
    }

    public async save(model: Techno): Promise<number> {
        let id = await super.save(model);
        return id;
    }

    constructor(context: BaseComponentContext) {
        super(context);
    }


}
