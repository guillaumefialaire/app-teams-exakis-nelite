import { sp } from "@pnp/sp";
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import { getRandomString } from "@pnp/common";
import BaseService from "./BaseService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import BaseListService from "./BaseListService";
import { Constants } from "../constants";
import Customer from "../models/Customer";
import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import { taxonomy, ITermStore, ITermSet } from "@pnp/sp-taxonomy";
import { Guid } from "@microsoft/sp-core-library";
import { Web } from "@pnp/sp";
import Term from "../models/Term";
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');


export default class CustomerService extends BaseListService<Customer> {
    public getFieldsDefinition() {
        return Constants.lists.customers.fields;
    }
    public initModel(): Customer {
        return new Customer();
    }
    public getListUrl(): string {
        return (this.context.pageContext.web.serverRelativeUrl+Constants.lists.customers.url);
    }

    public async load() : Promise<Customer[]>{

        let customers = await super.load()
        for (let index = 0; index < customers.length; index++) {
            if(customers[index].businessSector){
                let term = new Term();
                await term.fromGuid(customers[index].businessSector.ID).then(() => {
                    customers[index].businessSector = term;
                });
            }
            
            
        }
        return customers;
    }

    public async loadById(id: number) : Promise<Customer> {

        let customer = await super.loadById(id, true);

        return customer;
    }

    //add logo file to sharepoint
    public async saveLogoIntoSharepoint(file : IFilePickerResult) : Promise<void>{
        let res = null;
        let web = new Web(this.context.pageContext.web.absoluteUrl);
        await file.downloadFileContent()
      .then(async r => {
        await web.getFolderByServerRelativeUrl(this.context.pageContext.web.serverRelativeUrl+Constants.documents.logos).files.add(file.fileName, r, true).then(() => {
            res = this.context.pageContext.web.serverRelativeUrl+Constants.documents.logos+file.fileName;
            });
        });
    }

//note : we are saving logo using jsom because we can't add publishing images using pnp/sp
    public async save(model: Customer): Promise<number> {
        let id = await super.save(model);
        if (model.logo != null && model.logo != undefined){
            if (isEmpty(model.logo.url)){
                model.logo.url = this.context.pageContext.web.serverRelativeUrl+Constants.documents.logos+model.logo.file.fileName;
                await this.saveLogoIntoSharepoint(model.logo.file);
            }
            let oList = await this.getListByUrl(this.context.pageContext.web.serverRelativeUrl+Constants.lists.customers.url);
            let oListItem = oList.getItemById(id);
            oListItem.set_item(Constants.lists.customers.publishingFields.logo,  "<img src='"+model.logo.url+"'>");
            oListItem.update();
            var ctx = oList.get_context();
            ctx.executeQueryAsync(() => {
            console.log("updated logo");
            },() => {
            console.log("error updating/adding logo");
            });
        }
        
        return id;
    }

    public async getCustomerListId() : Promise<string> {
        let customerListJson = await (this.web.getList(this.context.pageContext.web.serverRelativeUrl+Constants.lists.customers.url).select("Id").get())
        let id = customerListJson['Id']
        return id
    }

    constructor(context: BaseComponentContext) {
        super(context);
    }


}
