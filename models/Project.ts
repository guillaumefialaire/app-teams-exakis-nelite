import { Guid } from "@microsoft/sp-core-library";
import { Constants } from "../constants";
import Term from "./Term";
import BaseModel from "./BaseModel";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import Multilingual from "./Multilingual"

class Project extends BaseModel {
    public businessSector: Term;

    public type : Term;

    public customerID : number;

    public customerName : string;

    public outsideCustomerName : string ;

    public description : Multilingual;

    public technos : Term[];

    constructor(jsonData?: any) {
        super(jsonData);
    }

    public toJson() {
        let jsonData = {};

        jsonData[Constants.lists.projects.fields.id] = this.id;
        
        jsonData[Constants.lists.projects.fields.name] = this.title;

        if (!isEmpty(this.businessSector)) jsonData[Constants.lists.projects.fields.businessSector] = this.businessSector.toJson();
        else jsonData[Constants.lists.projects.fields.businessSector] = null;

        if (!isEmpty(this.type)) jsonData[Constants.lists.projects.fields.projectType] = this.type.toJson();
        else jsonData[Constants.lists.projects.fields.projectType] = null;

        if(this.customerID) {
            jsonData[Constants.lists.projects.fields.customer] = this.customerID;
            jsonData[Constants.lists.projects.fields.outsideCustomer] = null;
        }

        if(!this.customerID && this.outsideCustomerName) {
            jsonData[Constants.lists.projects.fields.outsideCustomer] = this.outsideCustomerName;
            jsonData[Constants.lists.projects.fields.customer] = null;
        }

        if(this.description){
            jsonData[Constants.lists.projects.fields.description] = this.description.toString();
        }

        return jsonData;
    }

    public fromJson(jsonData: any): void{

        this.id = jsonData[Constants.lists.projects.fields.id];

        this.title = jsonData[Constants.lists.projects.fields.name];

        if(jsonData[Constants.lists.projects.fields.description]){
            let multiling = new Multilingual()
            multiling.fromJson(jsonData[Constants.lists.projects.fields.description])
            this.description = multiling
        }

        if((jsonData[Constants.lists.projects.fields.businessSector]) && jsonData[Constants.lists.projects.fields.businessSector]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.projects.fields.businessSector])
            this.businessSector = term;
        }


        if((jsonData[Constants.lists.projects.fields.projectType]) && jsonData[Constants.lists.projects.fields.projectType]['TermGuid']){
            let term = new Term(jsonData[Constants.lists.projects.fields.projectType])
            this.type = term
        }

        if(jsonData[Constants.lists.projects.fields.technos]){
            let terms : Term[] = []
            jsonData[Constants.lists.projects.fields.technos].forEach(techno => {
                let term = new Term(techno)
                terms.push(term)
            });
            this.technos = terms;
        }

        if(jsonData[Constants.lists.projects.fields.outsideCustomer] && jsonData[Constants.lists.projects.fields.outsideCustomer]  !== null) 
        this.outsideCustomerName = jsonData[Constants.lists.projects.fields.outsideCustomer]   

        if(jsonData[Constants.lists.projects.fields.customer] && jsonData[Constants.lists.projects.fields.customer] !== null)
        this.customerID = jsonData[Constants.lists.projects.fields.customer] 
    }
}

export default Project;

