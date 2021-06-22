import { Guid } from "@microsoft/sp-core-library";
import { Constants } from "../constants";
import Term from "./Term";
import BaseModel from "./BaseModel";
import PublishingImage from "./PublishingImage";
import { isEmpty } from "@microsoft/sp-lodash-subset";

class Techno extends BaseModel {

    public name : Term

    public level : number

    public profileId : number

    constructor(jsonData?: any) {
        super(jsonData);
    }

    public toJson() {
        let jsonData = {};

        jsonData[Constants.lists.technos.fields.id] = this.id;
        jsonData[Constants.lists.technos.fields.level] = this.level;
        jsonData[Constants.lists.technos.fields.profile] = this.profileId;
        if (!isEmpty(this.name)) {
            jsonData[Constants.lists.technos.fields.name] = this.name.toJson();
        }
        else {
            jsonData[Constants.lists.technos.fields.name] = null;
        }
        return jsonData;
    }

    public fromJson(jsonData: any): void{
        if(jsonData[Constants.lists.technos.fields.id]){
            this.id = jsonData[Constants.lists.technos.fields.id]
        }
        if(jsonData[Constants.lists.technos.fields.profile]){
            this.profileId = jsonData[Constants.lists.technos.fields.profile]
        }
        if(jsonData[Constants.lists.technos.fields.level]){
            this.level = jsonData[Constants.lists.technos.fields.level]
        }
        if((jsonData[Constants.lists.technos.fields.name]) && jsonData[Constants.lists.technos.fields.name]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.technos.fields.name])
            this.name = term
        }

    }
}

export default Techno;

