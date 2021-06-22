import BaseService from "./BaseService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import BaseModel from "../models/BaseModel";
import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { sp, List } from "@pnp/sp";
import { Constants } from "../constants";
import { ISiteUserProps } from "@pnp/sp/site-users";
import { isEmpty } from "@microsoft/sp-lodash-subset";

require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');

export interface IQuerySettings {
    orderBy?: string;
}

export default abstract class BaseListService<T extends BaseModel> extends BaseService {

    constructor(context: BaseComponentContext) {
        super(context);
    }

    public getList(): List {
        return this.web.getList(this.getListUrl());
    }

    public abstract getListUrl(): string;
    public abstract initModel(): T;
    public abstract getFieldsDefinition(): any;

    public getListByUrl(url: string): Promise<SP.List> {

        var ctx = new SP.ClientContext(this.context.pageContext.web.absoluteUrl);
        var web = ctx.get_web();
        var lists = web.get_lists();
        ctx.load(lists, 'Include(RootFolder.ServerRelativeUrl)');

        return new Promise<SP.List>((resolve, reject) => {
            ctx.executeQueryAsync(
                () => {
                    for (var i = 0; i < lists.get_count(); i++) {
                        let list = lists.getItemAtIndex(i);
                        let listUrl = list.get_rootFolder().get_serverRelativeUrl();

                        if (listUrl === url)
                            resolve(list);
                    }

                    reject({
                        message: "List with url '" + url + "' not found"
                    });
                },
                (sender, args) => {
                    reject({
                        message: args.get_message(),
                        stackTrace: args.get_stackTrace()
                    });
                }
            );

        });

    }

    public getFieldsNames(): string[] {
        return Object.keys(this.getFieldsDefinition()).map(key => this.getFieldsDefinition()[key]);
    }

    public async delete(id: number): Promise<void> { 

            await this.getList().items.getById(id).delete();
    }


    public async save(model: T,listUrl? : string): Promise<number> {
        let result ;
        if (model.id) {
            result = await this.getList().items.getById(model.id).update(model.toJson());
            return model.id;
        } else {
            if(listUrl){
                result = await this.web.getList(listUrl).items.add(model.toJson());
            } else {
                result = await this.getList().items.add(model.toJson());
            }
        }
        return result.data["ID"];
    }

    public async loadById(id: number, fieldValuesAsHtml?: boolean): Promise<T> {
        let query = this.getList().items.getById(id);
        let listItem;
        if(fieldValuesAsHtml === true)
        {
            listItem = await query.fieldValuesAsHTML.get();
        } else {
            listItem = await query.get();
        }
        let model = this.initModel();
        model.fromJson(listItem);
        return model;
    }


    public async load(querySettings?: IQuerySettings): Promise<Array<T>> {
        let items: T[] = [];

        let query = this.getList().items.select(...this.getFieldsNames());

        if (querySettings && querySettings.orderBy)
            query.orderBy(querySettings.orderBy);

        else
            query.orderBy("Title");


        let listItems = await query.get();
        listItems.forEach(listItem => {
            let model = this.initModel();
            model.fromJson(listItem);
            items.push(model);
        });

        return (items);
    }

    public async getCurrentUserId() : Promise<number> {
        let userProps : ISiteUserProps = await sp.web.currentUser.get();
        return userProps.Id
    }

    public async getProfileId() : Promise<number>{
        let userId = await this.getCurrentUserId();
        let profiles = await this.web.getList(this.context.pageContext.web.serverRelativeUrl+Constants.lists.profiles.url).items.get();
        let profile = profiles.filter(profile => profile[Constants.lists.profiles.fields.user] === userId);
        let id = isEmpty(profile) ? null : profile[0][Constants.lists.profiles.fields.id];
        return id;
    }

}
