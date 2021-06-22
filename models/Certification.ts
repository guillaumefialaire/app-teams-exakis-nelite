import { Guid } from "@microsoft/sp-core-library";
import { Constants } from "../constants";
import Term from "./Term";
import BaseModel from "./BaseModel";
import PublishingImage from "./PublishingImage";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import Multilingual from "./Multilingual";

class Certification extends BaseModel {

    public name : Multilingual

    public description : Multilingual

    public company : Term


    constructor(jsonData?: any) {
        super(jsonData);
    }

    public toJson() {
        let jsonData = {};

        jsonData[Constants.lists.certifications.fields.id] = this.id;

        if (!isEmpty(this.company)) {
            jsonData[Constants.lists.certifications.fields.company] = this.company.toJson();
        }
        else {
            jsonData[Constants.lists.certifications.fields.company] = null;
        }

        if(this.name){
            jsonData[Constants.lists.certifications.fields.name] = this.name.toString()
        }

        if(this.description){
            jsonData[Constants.lists.certifications.fields.description] = this.description.toString()
        }
        
        return jsonData;
    }

    public fromJson(jsonData: any): void{
        if(jsonData[Constants.lists.certifications.fields.id]){
            this.id = jsonData[Constants.lists.certifications.fields.id]
        }

        if((jsonData[Constants.lists.certifications.fields.company]) && jsonData[Constants.lists.certifications.fields.company]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.certifications.fields.company])
            this.company = term
        }

        if(jsonData[Constants.lists.certifications.fields.name]){
            let multiling = new Multilingual()
            multiling.fromJson(jsonData[Constants.lists.certifications.fields.name])
            this.name = multiling
        }

        if(jsonData[Constants.lists.certifications.fields.description]){
            let multiling = new Multilingual()
            multiling.fromJson(jsonData[Constants.lists.certifications.fields.description])
            this.description = multiling
        }

    }
}

export default Certification;

