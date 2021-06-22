import { Guid } from "@microsoft/sp-core-library";
import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
class PublishingImage {
    public file : IFilePickerResult;

    public url : string;

    constructor(file? : IFilePickerResult){
        if(file) {
            this.file = file;
            this.url = file.fileAbsoluteUrl;
        }
    }

    public fromJson(jsonData : string) : void{
        let tmp = document.createElement('div');
        tmp.innerHTML = jsonData.trim();
        this.url = tmp.firstElementChild.getAttribute('src');

    }

}

export default PublishingImage;