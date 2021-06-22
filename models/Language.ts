import { Guid } from "@microsoft/sp-core-library";
import { Constants } from "../constants";
import Term from "./Term";
import BaseModel from "./BaseModel";
import PublishingImage from "./PublishingImage";
import { isEmpty } from "@microsoft/sp-lodash-subset";

class Language extends BaseModel {

    public name : Term

    public level : number

    public profileId : number

    constructor(jsonData?: any) {
        super(jsonData);
    }

    public toJson() {
        let jsonData = {};

        jsonData[Constants.lists.languages.fields.id] = this.id;
        jsonData[Constants.lists.languages.fields.level] = this.level;
        jsonData[Constants.lists.languages.fields.profile] = this.profileId;
        if (!isEmpty(this.name)) {
            jsonData[Constants.lists.languages.fields.name] = this.name.toJson();
        }
        else {
            jsonData[Constants.lists.languages.fields.name] = null;
        }
        return jsonData;
    }

    public fromJson(jsonData: any): void{
        if(jsonData[Constants.lists.languages.fields.id]){
            this.id = jsonData[Constants.lists.languages.fields.id]
        }
        if(jsonData[Constants.lists.languages.fields.profile]){
            this.profileId = jsonData[Constants.lists.languages.fields.profile]
        }
        if(jsonData[Constants.lists.languages.fields.level]){
            this.level = jsonData[Constants.lists.languages.fields.level]
        }
        if((jsonData[Constants.lists.languages.fields.name]) && jsonData[Constants.lists.languages.fields.name]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.languages.fields.name])
            this.name = term
        }

    }
}

export default Language;

