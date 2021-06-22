import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TeamsAppsCvWebPartStrings';
import {TeamsAppsCv, ITeamsAppsCvProps} from './components/TeamsAppsCv';
import * as microsoftTeams from "@microsoft/teams-js";
import { sp } from "@pnp/sp/presets/all";

export interface ITeamsAppsCvWebPartProps {
  description: string;
}

export default class TeamsAppsCvWebPart extends BaseClientSideWebPart <ITeamsAppsCvWebPartProps> {

  private teamsContext: microsoftTeams.Context;

  public render(): void {
    const element: React.ReactElement<ITeamsAppsCvProps> = React.createElement(
      TeamsAppsCv,
      {
        context : this.context,
        teamsContext : this.teamsContext
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<any> {
    return super.onInit().then(_ => {
     
      sp.setup({
        spfxContext: this.context
      });
 
      let retVal: Promise<any> = Promise.resolve();
      if (this.context.microsoftTeams) {
        retVal = new Promise((resolve, reject) => {
          this.context.microsoftTeams.getContext(context => {
            this.teamsContext = context;
            resolve();
          });
        });
      }
      return retVal;
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
