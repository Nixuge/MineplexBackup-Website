import { Download, ServerMap } from "@/ts/server/ServerMap";

export class HiveMap extends ServerMap {

    constructor(minigame: string, mapName: string,
        downloads: Download[], id: number, public authors?: string, 
        public creationYear?: string, commentaries?: string) {
            super(minigame, mapName, downloads, id, commentaries)
        }

    getBaseUrl(file: boolean): string {        
        let base = "/static/hive/";
        base += (file) ? "zip/" : "img/";
        base += this.sanitizedMinigame + "/";
        return base;
    }
}