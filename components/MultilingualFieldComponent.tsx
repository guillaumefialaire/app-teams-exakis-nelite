import * as React from 'react';
// import * as strings from 'TeamsAppsCvWebPartStrings';
import IBaseComponentProps from '../interfaces/IBaseComponentProps';
import CustomerService from '../services/CustomersService';
import styles from './TeamsAppsCv.module.scss';
import { Constants } from '../constants';
import { Nav, INavLink, INavStyles, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, IButtonStyles, PrimaryButton } from 'office-ui-fabric-react/lib/Button';

export interface MultilingualFieldProps extends IBaseComponentProps {
  onEnglishChangeParent : (event : any) => void;
  onFrenchChangeParent : (event : any) => void;
  label : string;
  englishValue : string;
  frenchValue : string;
  isRequired: boolean;
  isDisabled : boolean

}

export interface MultilingualFieldState {
  languageIsEnglish : boolean;
}

export default class MultilangualField extends React.Component<MultilingualFieldProps, MultilingualFieldState>{

  constructor(props : MultilingualFieldProps){
    super(props); 
  }

  public componentDidMount() {
    this.setState({
      languageIsEnglish : false
  })
}

  private englishField() : JSX.Element {
    return (<TextField onChange={this.props.onEnglishChangeParent}  defaultValue={this.props.englishValue} multiline rows={3} disabled={this.props.isDisabled}/>)
  }

  private frenchField() : JSX.Element {
    return (<TextField onChange={this.props.onFrenchChangeParent}  defaultValue={this.props.frenchValue} multiline rows={3} disabled={this.props.isDisabled}/>)
  }
 

    public render(): React.ReactElement {
    return(<span>
     
      {this.props.label}{this.props.isRequired && <span className={styles.redFont}>*</span>}&nbsp;
      {this.state && this.state.languageIsEnglish && <DefaultButton text="FR" onClick={() => {this.setState({languageIsEnglish : false})}}/>}
      {this.state && !this.state.languageIsEnglish && <PrimaryButton text="FR" onClick={() => {this.setState({languageIsEnglish : false})}}/>}
      {this.state && !this.state.languageIsEnglish && <DefaultButton text="EN" onClick={() => {this.setState({languageIsEnglish : true})}}/>}
      {this.state && this.state.languageIsEnglish && <PrimaryButton text="EN" onClick={() => {this.setState({languageIsEnglish : true})}}/>}     
      {this.state && this.state.languageIsEnglish && this.englishField()}
    {this.state && !this.state.languageIsEnglish && this.frenchField()}
    </span>)
  }
}

