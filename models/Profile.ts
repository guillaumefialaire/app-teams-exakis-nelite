import { Guid } from "@microsoft/sp-core-library";
import { Constants } from "../constants";
import Term from "./Term";
import BaseModel from "./BaseModel";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import Multilingual from "./Multilingual";

class Profile extends BaseModel{

    public activityStartDate : Date;

    public user : number;

    public jobTitle : Multilingual;

    public introduction : Multilingual;

    public skills : Multilingual;

    public branch : Term;

    public serviceLine : Term;

    public certifications : number[]

    public interventions : number[]

    constructor(jsonData?: any) {
        super(jsonData);
    }

    public toJson() : any {
        let jsonData = {};

        jsonData[Constants.lists.customers.fields.id] = this.id;

        jsonData[Constants.lists.customers.fields.name] = this.title;

        if(this.activityStartDate)
        jsonData[Constants.lists.profiles.fields.date] = this.activityStartDate;

        if(this.user){
            jsonData[Constants.lists.profiles.fields.user] = this.user
        }

        if(this.jobTitle){
            jsonData[Constants.lists.profiles.fields.jobTitle] = this.jobTitle.toString()
        }

        if(this.introduction){
            jsonData[Constants.lists.profiles.fields.introduction] = this.introduction.toString()
        }

        if(this.skills){
            jsonData[Constants.lists.profiles.fields.skills] = this.skills.toString()
        }

        if (!isEmpty(this.branch)) {
            jsonData[Constants.lists.profiles.fields.branch] = this.branch.toJson();
        }
        else {
            jsonData[Constants.lists.profiles.fields.branch] = null;
        }

        if (!isEmpty(this.serviceLine)) {
            jsonData[Constants.lists.profiles.fields.serviceLine] = this.serviceLine.toJson();
        }
        else {
            jsonData[Constants.lists.profiles.fields.serviceLine] = null;
        }

        if(this.certifications !== null && this.certifications !== undefined){
            jsonData[Constants.lists.profiles.fields.certifications] = {
                results : this.certifications
            }
        }

        if(this.interventions !== null && this.interventions !== undefined){
            jsonData[Constants.lists.profiles.fields.interventions] = {
                results : this.interventions
            }
        }

        return jsonData 
    }

    public fromJson(jsonData : any) : void {
        this.id = jsonData[Constants.lists.profiles.fields.id];

        if(jsonData[Constants.lists.profiles.fields.date]) {
            this.activityStartDate = new Date(jsonData[Constants.lists.profiles.fields.date])
        }
        
        if(jsonData[Constants.lists.profiles.fields.jobTitle]){
            let multiling = new Multilingual()
            multiling.fromJson(jsonData[Constants.lists.profiles.fields.jobTitle])
            this.jobTitle = multiling
        }
        if(jsonData[Constants.lists.profiles.fields.introduction]){
            let multiling = new Multilingual()
            multiling.fromJson(jsonData[Constants.lists.profiles.fields.introduction])
            this.introduction = multiling
        }
        if(jsonData[Constants.lists.profiles.fields.skills]){
            let multiling = new Multilingual()
            multiling.fromJson(jsonData[Constants.lists.profiles.fields.skills])
            this.skills = multiling
        }

        if((jsonData[Constants.lists.profiles.fields.branch]) && jsonData[Constants.lists.profiles.fields.branch]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.profiles.fields.branch])
            this.branch = term
        }

        if((jsonData[Constants.lists.profiles.fields.serviceLine]) && jsonData[Constants.lists.profiles.fields.serviceLine]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.profiles.fields.serviceLine])
            this.serviceLine = term
        }

        if(jsonData[Constants.lists.profiles.fields.certifications]) this.certifications = jsonData[Constants.lists.profiles.fields.certifications]

        if(jsonData[Constants.lists.profiles.fields.interventions]) this.interventions = jsonData[Constants.lists.profiles.fields.interventions]
    }
}

export default Profile