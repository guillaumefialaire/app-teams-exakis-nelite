import * as React from 'react';  
import styles from '../TeamsAppsCv.module.scss';
const MyDetails = () => {  
    return <div>My Details With Paramter<br></br><b>{name}</b></div>;  
   };    
export default class CV extends React.Component {    
    public render(): React.ReactElement {    
        return (    
            <div className={styles.test}>       
                liste CV
            </div>    
        );    
    }    
}  