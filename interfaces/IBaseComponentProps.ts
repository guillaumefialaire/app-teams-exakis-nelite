import * as microsoftTeams from "@microsoft/teams-js";
import { BaseComponentContext } from "@microsoft/sp-component-base";
 
export default interface IBaseComponentProps {
  context: BaseComponentContext;
  teamsContext: microsoftTeams.Context;
}