import { Guid } from "@microsoft/sp-core-library";
import { Constants } from "../constants";
import Term from "./Term";
import BaseModel from "./BaseModel";
import PublishingImage from "./PublishingImage";
import { isEmpty } from "@microsoft/sp-lodash-subset";

class Softskill extends BaseModel {

    public name : Term

    public level : number

    public profileId : number

    constructor(jsonData?: any) {
        super(jsonData);
    }

    public toJson() {
        let jsonData = {};

        jsonData[Constants.lists.softskills.fields.id] = this.id;
        jsonData[Constants.lists.softskills.fields.level] = this.level;
        jsonData[Constants.lists.softskills.fields.profile] = this.profileId;
        if (!isEmpty(this.name)) {
            jsonData[Constants.lists.softskills.fields.name] = this.name.toJson();
        }
        else {
            jsonData[Constants.lists.softskills.fields.name] = null;
        }
        return jsonData;
    }

    public fromJson(jsonData: any): void{
        if(jsonData[Constants.lists.softskills.fields.id]){
            this.id = jsonData[Constants.lists.softskills.fields.id]
        }
        if(jsonData[Constants.lists.softskills.fields.profile]){
            this.profileId = jsonData[Constants.lists.softskills.fields.profile]
        }
        if(jsonData[Constants.lists.softskills.fields.level]){
            this.level = jsonData[Constants.lists.softskills.fields.level]
        }
        if((jsonData[Constants.lists.softskills.fields.name]) && jsonData[Constants.lists.softskills.fields.name]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.softskills.fields.name])
            this.name = term
        }

    }
}

export default Softskill;

