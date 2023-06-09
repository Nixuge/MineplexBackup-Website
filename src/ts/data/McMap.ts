import { sanitize } from "@/ts/utils/TextUtils";

export class Download {
    name: string
    url: string

    constructor(name: string, url: string) {
        this.name = name;
        this.url = url;
    }
}

export class McMap {
    public sanitizedMinigame: string;
    public sanitizedMapName: string;
    public sanitizedBuilders: string;

    constructor(public minigame: string, public mapName: string, public builders: string,
        public downloads: Array<Download>, public id: number, public nano: boolean, 
        public commentaries?: string) {
            this.sanitizedMinigame = sanitize(minigame);
            this.sanitizedMapName = sanitize(mapName);
            this.sanitizedBuilders = sanitize(builders);
        }
    
    private getBaseUrl(zip: boolean) {
        let base = "/static/";
        base += (zip) ? "zip/" : "img/";
        if (this.nano){
            base += "nano/";
        }
        base += sanitize(this.minigame) + "/";
        return base;
    }

    public getDownloadUrl(filename: string) {
        return this.getBaseUrl(true) + filename;
    }

    public getPreviewUrl() {
        if (this.minigame == "")
            return "/static/img/unselected.png";
        return `${this.getBaseUrl(false)}${sanitize(this.mapName)}.png`;
        // return `https://hivebackup.github.io/static/previews/Gravity/aquamarine.png`;
        // TODO: once i've (finally) added the previews: fix that
        // TODO: add all of the missing previews
    }
}