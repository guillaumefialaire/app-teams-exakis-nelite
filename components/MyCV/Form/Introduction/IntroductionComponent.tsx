import { useState, useEffect, } from 'react';
import * as React from 'react';
import { Route, NavLink } from 'react-router-dom';
import IBaseComponentProps from '../../../../interfaces/IBaseComponentProps';
import Profile from '../../../../models/Profile';
import ProfileService from '../../../../services/ProfileService'
import { Constants } from '../../../../constants';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import * as strings from 'TeamsAppsCvWebPartStrings';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton,  PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import Multilingual from '../../../../models/Multilingual';
import styles from './../../../TeamsAppsCv.module.scss';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { IPickerTerms, TaxonomyPicker } from '@pnp/spfx-controls-react/lib/TaxonomyPicker';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import Term from '../../../../models/Term';


const controlClass = mergeStyleSets({
    date: {
      margin: '0 0 15px 0',
      maxWidth: '300px',
    },
    textfield: {
        margin: '0 0 15px 0',
        maxWidth: '500px',
      },
    langButton:{
        margin :  ' 0 0 0 150px',
    }
  });


function Introduction(props){
    const [date, setDate] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [jobTitleFR, setJobTitleFR] = useState(null);
    const [jobTitleEN, setJobTitleEN] = useState(null);
    const [jobTitleDefault, setJobTitleDefault] = useState(null);
    const [introductionDefault, setIntroductionDefault] = useState(null);
    const [introductionFR, setIntroductionFR] = useState(null);
    const [introductionEN, setIntroductionEN] = useState(null);
    const [skillsDefault, setSkillsDefault] = useState(null);
    const [skillsFR, setSkillsFR] = useState(null);
    const [skillsEN, setSkillsEN] = useState(null);
    const [isLangEN, setIsLangEN] = useState(false);
    const [debouncedProfile, setDebouncedProfile] = useState(null);
    const profileService = new ProfileService(props.context);
    const[branch,setBranch] = useState(null);
    const[branchInit,setBranchInit] = useState(null);
    const[serviceLine,setServiceLine] = useState(null);
    const[serviceLineInit,setServiceLineInit] = useState(null);

    function onJobTitleChange (event) {
        const { value } = event.target;
        if(isLangEN){
            setJobTitleEN(value);
        } else {
            setJobTitleFR(value);
        }
    }

    function onIntroductionChange (event) {
        const { value } = event.target;
        if(isLangEN){
            setIntroductionEN(value);
        } else {
            setIntroductionFR(value);
        }
    }

    function onSkillsChange (event) {
        const { value } = event.target;
        if(isLangEN){
            setSkillsEN(value);
        } else {
            setSkillsFR(value);
        }
    }

    function onBranchChange (terms : IPickerTerms) {
        if(terms !== null && !isEmpty(terms)){
            setBranch(new Term({TermGuid : terms[0].key, Label : terms[0].name}))
        } else {
            setBranch(null)
        }
    }

    function onServiceLineChange (terms : IPickerTerms) {
        if(terms !== null && !isEmpty(terms)){
            setServiceLine(new Term({TermGuid : terms[0].key, Label : terms[0].name}))
        } else {
            setServiceLine(null)
        }
    }
    
    useEffect(() => { 
        if(profileId){
            const profile = new Profile();
            profile.id = profileId
            profile.activityStartDate = date;
            profile.jobTitle = new Multilingual(jobTitleFR,jobTitleEN);
            profile.introduction = new Multilingual(introductionFR,introductionEN);
            profile.skills = new Multilingual(skillsFR,skillsEN);
            profile.branch = branch;
            profile.serviceLine = serviceLine;
            const handler = setTimeout(() => {
                setDebouncedProfile(profile)
            }, 500);
              return () => {
                clearTimeout(handler);
              };
        } 
        },[jobTitleFR,jobTitleEN,date,introductionFR,introductionEN,skillsEN,skillsFR,branch,serviceLine]
);

    useEffect(() => {
        if(debouncedProfile){
        profileService.save(debouncedProfile);
    }
    },
    [debouncedProfile]);



    useEffect(() => {
        const profile =  new Profile();
        profileService.getProfileId().then((profileId) => {
            if(profileId === null){
                profileService.getCurrentUserId().then((currentUserId) =>{
                    profile.user = currentUserId;
                    profileService.save(profile).then((profileId) => {
                        setProfileId(profileId)
                    })
                })
                
            } else {
                profileService.loadbyId(profileId).then((profile) => {
                    if(profile.activityStartDate) setDate(profile.activityStartDate)
                    
                    if(profile.branch){
                        setBranch(profile.branch);
                        setBranchInit([{
                            key : profile.branch.ID.toString(),
                            name : profile.branch.Label,
                            path : undefined,
                            termSet : undefined 
                        }])
                    }

                    if(profile.serviceLine){
                        setServiceLine(profile.serviceLine);
                        setServiceLineInit([{
                            key : profile.serviceLine.ID.toString(),
                            name : profile.serviceLine.Label,
                            path : undefined,
                            termSet : undefined 
                        }])
                    }

                    if(profile.jobTitle){
                        if(profile.jobTitle.englishStr) {
                            setJobTitleEN(profile.jobTitle.englishStr);
                        }
                        if(profile.jobTitle.frenchStr) {
                            setJobTitleFR(profile.jobTitle.frenchStr); 
                            setJobTitleDefault(profile.jobTitle.frenchStr);
                        }
                    }
                    if(profile.introduction){
                        if(profile.introduction.englishStr) {
                            setIntroductionEN(profile.introduction.englishStr);
                        }
                        if(profile.introduction.frenchStr) {
                            setIntroductionFR(profile.introduction.frenchStr); 
                            setIntroductionDefault(profile.introduction.frenchStr);
                        }
                    }
                    if(profile.skills){
                        if(profile.skills.englishStr) {
                            setSkillsEN(profile.skills.englishStr);
                        }
                        if(profile.skills.frenchStr) {
                            setSkillsFR(profile.skills.frenchStr); 
                            setSkillsDefault(profile.skills.frenchStr);
                        }
                    }
                    setProfileId(profileId); 
                })
                
            }
        })
    },[])

    return(
        <div>
                <div className={controlClass.langButton}>
                {isLangEN && <DefaultButton text="FR" onClick={() => {
                    setIsLangEN(false);
                    setJobTitleDefault(jobTitleFR);
                    setIntroductionDefault(introductionFR);
                    setSkillsDefault(skillsFR);
}}/>}
      {!isLangEN && <PrimaryButton text="FR" onClick={() => {
          setIsLangEN(false);
          setJobTitleDefault(jobTitleFR);
          setIntroductionDefault(introductionFR);
          setSkillsDefault(skillsFR);
}}/>}
      {!isLangEN && <DefaultButton text="EN" onClick={() => {
          setIsLangEN(true);
          setJobTitleDefault(jobTitleEN);
          setIntroductionDefault(introductionEN);
          setSkillsDefault(skillsEN);
}}/>}
      {isLangEN && <PrimaryButton text="EN" onClick={() => {
          setIsLangEN(true);
          setJobTitleDefault(jobTitleEN);
          setIntroductionDefault(introductionEN);
          setSkillsDefault(skillsEN);
        }}/>}
                </div>
                <div className={controlClass.date}><DatePicker label={strings.ActivityStartDate+" :"}
                isRequired
                value={date}
                placeholder="Select a date..."
                onSelectDate={(date) => {
                    setDate(date);
            }} 
                />  
                </div>
                
              <div className={controlClass.textfield}>
                <TextField label={strings.JobTitle+" :"} defaultValue={jobTitleDefault} onChange={onJobTitleChange} required/>
              </div>
              
              <div className={styles.taxoRequired}>
                <TaxonomyPicker allowMultipleSelections={false}
                termsetNameOrID={Constants.termsets.branch.id}
                panelTitle={strings.Branch}
                initialValues={branchInit}
                label={strings.Branch+" :"}
                context={props.context}
                onChange={onBranchChange}
                isTermSetSelectable={false}/>
              </div>

              <div className={styles.taxoRequired}>
                <TaxonomyPicker allowMultipleSelections={false}
                termsetNameOrID={Constants.termsets.serviceLine.id}
                panelTitle={strings.ServiceLine}
                initialValues={serviceLineInit}
                label={strings.ServiceLine+" :"}
                context={props.context}
                onChange={onServiceLineChange}
                isTermSetSelectable={false}/>
              </div>
              
              
              <div className={controlClass.textfield}>
                <TextField label={strings.Introduction+" :"} defaultValue={introductionDefault} onChange={onIntroductionChange} multiline rows={3}/>
              </div>
              <div className={controlClass.textfield}>
                <TextField label={strings.Skills+" :"} defaultValue={skillsDefault} onChange={onSkillsChange} multiline rows={3}/>
              </div>
            </div>
    )
}

export default Introduction