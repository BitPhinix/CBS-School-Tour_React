import App from "../app";

export class UntisCookie{
    constructor(initialize?: string){
        if(initialize){
            const parsed = JSON.parse(initialize);
            this.sessionID = parsed.sessionID;
            this.username = parsed.username;
        }
    }
    public sessionID: string;
    public username: string;
}

export class CbsCookie {
    constructor(initialize?: string) {
        if(initialize)
            this.visited = JSON.parse(initialize).visited;
    }

    public visited: boolean;
}