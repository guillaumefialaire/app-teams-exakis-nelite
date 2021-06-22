import { Guid } from "@microsoft/sp-core-library";
import { Constants } from "../constants";
import Term from "./Term";
import BaseModel from "./BaseModel";
import PublishingImage from "./PublishingImage";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import Multilingual from "./Multilingual";

class Graduation extends BaseModel {

    public name : Multilingual

    public diploma : Term

    public school : Term

    public profileId : number

    public date : Date

    constructor(jsonData?: any) {
        super(jsonData);
    }

    public toJson() {
        let jsonData = {};

        jsonData[Constants.lists.graduations.fields.id] = this.id;
        
        jsonData[Constants.lists.graduations.fields.profile] = this.profileId;

        if(this.date) jsonData[Constants.lists.graduations.fields.graduationDate] = this.date

        if (!isEmpty(this.diploma)) {
            jsonData[Constants.lists.graduations.fields.diploma] = this.diploma.toJson();
        }
        else {
            jsonData[Constants.lists.graduations.fields.diploma] = null;
        }

        if (!isEmpty(this.school)) {
            jsonData[Constants.lists.graduations.fields.school] = this.school.toJson();
        }
        else {
            jsonData[Constants.lists.graduations.fields.school] = null;
        }

        if(this.name){
            jsonData[Constants.lists.graduations.fields.name] = this.name.toString()
        }

        return jsonData;
    }

    public fromJson(jsonData: any): void{
        if(jsonData[Constants.lists.graduations.fields.id]){
            this.id = jsonData[Constants.lists.graduations.fields.id]
        }

        if(jsonData[Constants.lists.graduations.fields.graduationDate]) this.date = new Date(jsonData[Constants.lists.graduations.fields.graduationDate])
        
        if(jsonData[Constants.lists.graduations.fields.profile]){
            this.profileId = jsonData[Constants.lists.graduations.fields.profile]
        }

        if((jsonData[Constants.lists.graduations.fields.diploma]) && jsonData[Constants.lists.graduations.fields.diploma]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.graduations.fields.diploma])
            this.diploma = term
        }

        if((jsonData[Constants.lists.graduations.fields.school]) && jsonData[Constants.lists.graduations.fields.school]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.graduations.fields.school])
            this.school = term
        }

        if(jsonData[Constants.lists.graduations.fields.name]){
            let multiling = new Multilingual()
            multiling.fromJson(jsonData[Constants.lists.graduations.fields.name])
            this.name = multiling
        }

    }
}

export default Graduation;

