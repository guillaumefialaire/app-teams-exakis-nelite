import * as React from 'react';
// import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import CustomerService from '../services/CustomersService';
import styles from './TeamsAppsCv.module.scss';
import { Constants } from '../constants';
import { Nav, INavLink, INavStyles, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, IButtonStyles, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TagPicker, IBasePicker, ITag } from 'office-ui-fabric-react/lib/Pickers';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { ICamlQuery } from "@pnp/sp/lists";
import { sp } from '@pnp/sp/presets/all';
import Multilingual from '../models/Multilingual'
import { isEmpty } from '@microsoft/sp-lodash-subset';

const rootClass = mergeStyles({
    maxWidth: 500,
  });

export interface MultilingualListItemPickerProps{
    listId : string;
    fieldRef : string;
    lang : string;
    idFieldRef : string;
    parentCallback : (id? : number) => void;
    notFoundMsg : string;
}

export interface MultilingualListItemPickerState {
  tags : any[]
}

export default class MultilingualListItemPicker extends React.Component<MultilingualListItemPickerProps,MultilingualListItemPickerState>{

  constructor(props : MultilingualListItemPickerProps){
    super(props);
    this.state = {tags:[]}
  }

  private async getTagsNames() {

    let r = [];

    await sp.web.lists.getById(this.props.listId).items.select(...[this.props.fieldRef,this.props.idFieldRef]).get().then((certifs => {
      certifs.forEach(certif => {
       let jsonData = JSON.parse(certif[this.props.fieldRef]);
       let certifStr : string;
       if(this.props.lang === "en-us" && jsonData.EN){
        certifStr = jsonData.EN;
       } else if(this.props.lang === "fr-fr" && jsonData.FR){
         certifStr = jsonData.FR
       } 
        r.push({key : certifStr, name: certifStr, id : certif[this.props.idFieldRef]})
      });

    }))
    this.setState({tags : r}) 
}

public async componentWillMount() {
    if(this.props.listId) this.getTagsNames()
} 

private _getTextFromItem(item: ITag): string {
    return item.name;
  }

  private _onFilterChanged = (filterText: string, tagList: ITag[]): ITag[] => {
    return filterText
      ? this.state.tags
          .filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0)
          .filter(tag => !this._listContainsDocument(tag, tagList))
      : [];
  }

  private _listContainsDocument(tag: ITag, tagList?: ITag[]) {
    if (!tagList || !tagList.length || tagList.length === 0) {
      return false;
    }
    return tagList.filter(compareTag => compareTag.key === tag.key).length > 0;
  }


  private onChange = (items) => {
    (!isEmpty(items)) ? this.props.parentCallback(items[0].id) : this.props.parentCallback()

  }

    public render(): React.ReactElement {
    return(<div>
    <TagPicker
        removeButtonAriaLabel="Remove"
        onResolveSuggestions={this._onFilterChanged}
        getTextFromItem={this._getTextFromItem}
        pickerSuggestionsProps={{
          suggestionsHeaderText: 'Select value',
          noResultsFoundText: this.props.notFoundMsg,
        }}
        
        itemLimit={1}
        onChange={this.onChange}
      /></div>)
  }
}

