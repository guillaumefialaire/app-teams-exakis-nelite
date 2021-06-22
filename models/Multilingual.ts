class Multilingual {
    public englishStr : string;

    public frenchStr : string;

    constructor(fr? : string,en? : string){
        if(fr) this.frenchStr = fr
        if(en) this.englishStr = en
    }

    public fromJson(desc : string){
            let jsonData = JSON.parse(desc)
            if(jsonData.EN){
                this.englishStr = jsonData.EN
            }
            if(jsonData.FR){
                this.frenchStr = jsonData.FR
            }
    }

    
    public toString() : any {
        let jsonData = {};
        jsonData['FR'] = this.frenchStr;
        jsonData['EN'] = this.englishStr

        let jsonStr = JSON.stringify(jsonData)
        return jsonStr

    }
}

export default Multilingual