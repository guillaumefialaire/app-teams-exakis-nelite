export default abstract class BaseModel {
    public id: number;
    public title: string;
    
    constructor(jsonData?: any) {
        if (jsonData)
            this.fromJson(jsonData);
    }

    public abstract toJson(): any;
    public abstract fromJson(jsonData: any): void;
}