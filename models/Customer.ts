import { Guid } from "@microsoft/sp-core-library";
import { Constants } from "../constants";
import Term from "./Term";
import BaseModel from "./BaseModel";
import PublishingImage from "./PublishingImage";
import { isEmpty } from "@microsoft/sp-lodash-subset";

class Customer extends BaseModel {
    public businessSector: Term;

    public logo: PublishingImage;

    constructor(jsonData?: any) {
        super(jsonData);
    }

    public toJson() {
        let jsonData = {};

        jsonData[Constants.lists.customers.fields.id] = this.id;
        jsonData[Constants.lists.customers.fields.name] = this.title;
        if (!isEmpty(this.businessSector)) jsonData[Constants.lists.customers.fields.businessSector] = this.businessSector.toJson();
        else jsonData[Constants.lists.customers.fields.businessSector] = null;
        return jsonData;
    }
    public fromJson(jsonData: any): void{

        if(jsonData[Constants.lists.customers.fields.id]){
        this.id = jsonData[Constants.lists.customers.fields.id];
        }
        if(jsonData[Constants.lists.customers.fields.name]){
        this.title = jsonData[Constants.lists.customers.fields.name];
        }
        if(jsonData[Constants.termsets.businessSector.staticName]){
            let businessSector = new Term();
            businessSector.fromJson(jsonData[Constants.termsets.businessSector.staticName],jsonData[Constants.lists.customers.fields.businessSector]);
            this.businessSector = businessSector;
        }

        if(jsonData[Constants.lists.customers.publishingFields.logo]){
            let logo = new PublishingImage();
            logo.fromJson(jsonData[Constants.lists.customers.publishingFields.logo]);
            this.logo = logo;
        }

        if((jsonData[Constants.lists.customers.fields.businessSector]) && jsonData[Constants.lists.customers.fields.businessSector]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.customers.fields.businessSector])
            this.businessSector = term
        }
    }
}

export default Customer;

