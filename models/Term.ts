import { Guid } from "@microsoft/sp-core-library";
import { taxonomy, ITermStore, ITermSet, ITerm, ILabel } from "@pnp/sp-taxonomy";
import { Constants } from "../constants";
class Term {
    public ID : Guid;
    public Label : string;

    constructor(jsonData?){
        if(jsonData){
            if(jsonData.TermGuid){
                this.ID = Guid.parse(jsonData.TermGuid);
            }
        }
    }


    public toJson(){
        let jsonData = {};
        jsonData['__metadata'] = { type: 'SP.Taxonomy.TaxonomyFieldValue' };
        jsonData['Label'] = this.Label;
        jsonData['TermGuid'] = this.ID.toString();
        jsonData['WssId'] = -1;

        return jsonData;
    }

    public fromJson(jsonData : string, bsName : string) : void{
        let index = jsonData.indexOf("|");
        this.ID = Guid.parse(jsonData.substring(index+1,jsonData.length));
        this.Label = bsName;
    }

    public async fromGuid(guid: Guid): Promise<void> {
        
        this.ID = guid
        await taxonomy.termStores.get().then((r) =>{
            return r[0].getTermById(guid.toString()).labels.get();
        })
        .then((l) => {
            this.Label = l[0].Value
        })
    }

}

export default Term;