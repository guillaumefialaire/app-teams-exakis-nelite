//constructeur avec en entrée le context sharepoint de type BaseComponentContext avec attribut protected context
// va stocker le web (sharepoint) 
//let web = new Web(this.context.pageContext.web.absoluteUrl);
import { BaseComponentContext } from "@microsoft/sp-component-base";
import { Web } from "@pnp/sp";


export default class BaseService {
    protected context: BaseComponentContext;
    protected web: Web;

    constructor(context: BaseComponentContext) {
        this.context = context;
        this.web = new Web(this.context.pageContext.web.absoluteUrl);
    }
}