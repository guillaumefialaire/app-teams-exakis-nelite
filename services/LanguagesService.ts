import { sp } from "@pnp/sp";
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import { getRandomString } from "@pnp/common";
import BaseService from "./BaseService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import BaseListService from "./BaseListService";
import { Constants } from "../constants";
import Language from "../models/Language";
import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { taxonomy, ITermStore, ITermSet } from "@pnp/sp-taxonomy";
import { Guid } from "@microsoft/sp-core-library";
import { Web } from "@pnp/sp";
import Term from "../models/Term";
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');


export default class LanguageService extends BaseListService<Language> {
    public getFieldsDefinition() {
        return Constants.lists.languages.fields;
    }
    public initModel(): Language {
        return new Language();
    }
    public getListUrl(): string {
        return (this.context.pageContext.web.serverRelativeUrl+Constants.lists.languages.url);
    }

    public async load() : Promise<Language[]>{
        const languages = await super.load();
        const profileId = await this.getProfileId();
        const languagesCurrentUser = languages.filter(language => language.profileId == profileId);
        for (let index = 0; index < languagesCurrentUser.length; index++) {
        if(languagesCurrentUser[index].name){
            let term = new Term();
            await term.fromGuid(languagesCurrentUser[index].name.ID).then(() => {
                languagesCurrentUser[index].name = term;
            });
        }
    }
        return languagesCurrentUser;
    }

    public async loadById(id: number) : Promise<Language> {

        let language = await super.loadById(id);

        if(language.name){
            let term = new Term();
            await term.fromGuid(language.name.ID).then(() => {
                language.name = term;
            });
    }
    return language;
    }

    public async save(model: Language): Promise<number> {
        let id = await super.save(model);
        return id;
    }


    constructor(context: BaseComponentContext) {
        super(context);
    }


}
