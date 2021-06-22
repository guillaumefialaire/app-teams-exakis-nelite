import { Guid } from "@microsoft/sp-core-library";
import { Constants } from "../constants";
import Term from "./Term";
import BaseModel from "./BaseModel";
import PublishingImage from "./PublishingImage";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import Multilingual from "./Multilingual";

class Intervention extends BaseModel {

    public projectId : number;

    public projectName : string;

    public startDate : Date;

    public duration : number;

    public roles : Term[];

    public technos : Term[];

    public mission : Multilingual;

    public include : boolean;
    

    constructor(jsonData?: any) {
        super(jsonData);
    }

    public toJson() {
        let jsonData = {};

        jsonData[Constants.lists.interventions.fields.id] = this.id;

        if(this.projectId) {
            jsonData[Constants.lists.interventions.fields.project] = this.projectId;
        }

        if(this.include !== null && this.include !== undefined){
            jsonData[Constants.lists.interventions.fields.includeInCV] = this.include
        }

        if(this.startDate) {
            jsonData[Constants.lists.interventions.fields.startDate] = this.startDate;
        }

        if(this.duration) {
            jsonData[Constants.lists.interventions.fields.duration] = this.duration;
        }

        if(this.mission) {
            jsonData[Constants.lists.interventions.fields.mission] = this.mission.toString()        }

        return jsonData;
    }

    public fromJson(jsonData: any): void{
        if(jsonData[Constants.lists.interventions.fields.id]){
            this.id = jsonData[Constants.lists.interventions.fields.id]
        }

        if(jsonData[Constants.lists.interventions.fields.mission]){
            let multiling = new Multilingual()
            multiling.fromJson(jsonData[Constants.lists.interventions.fields.mission])
            this.mission = multiling
        }

        if(jsonData[Constants.lists.interventions.fields.includeInCV] !== null && jsonData[Constants.lists.interventions.fields.includeInCV] !== undefined){
            this.include = jsonData[Constants.lists.interventions.fields.includeInCV]
        }

        if(jsonData[Constants.lists.interventions.fields.startDate]) this.startDate = new Date(jsonData[Constants.lists.interventions.fields.startDate])
    
        if(jsonData[Constants.lists.interventions.fields.project]) this.projectId = jsonData[Constants.lists.interventions.fields.project]

        if(jsonData[Constants.lists.interventions.fields.duration]) {
            this.duration = jsonData[Constants.lists.interventions.fields.duration];           
        }

        if(jsonData[Constants.lists.interventions.fields.roles]){
            let terms : Term[] = []
            jsonData[Constants.lists.interventions.fields.roles].forEach(role => {
                let term = new Term(role)
                terms.push(term)
            });
            this.roles = terms;
        }

        if(jsonData[Constants.lists.interventions.fields.technos]){
            let terms : Term[] = []
            jsonData[Constants.lists.interventions.fields.technos].forEach(techno => {
                let term = new Term(techno)
                terms.push(term)
            });
            this.technos = terms;
        }
    }
}

export default Intervention;

