class Untis
{
    private static id: string = String(Math.floor(Math.random() * 100000000));
    private static authenticator: UntisAuthenticationResult = null;

    private static server: string;
    private static school: string;

    public static login(user: string = "", password: string = "", client: string = "ANDROID", server: string = "https://arche.webuntis.com", school: string = "CBS-Mannheim") {
        this.server = server;
        this.school = school;

        const authenticator = new UntisAuthenticationParams(user, password, client);

        this.request(UntisMethod.Authenticate, authenticator, function (response: UntisResponse){
            Untis.authenticator = response.result as UntisAuthenticationResult;
        });
    }

    private static logout(){
        this.request(UntisMethod.Logout, null, function (){
            Untis.authenticator = null;
            Untis.id = String(Math.floor(Math.random() * 100000000));
        });
    }

    private static async request(method: UntisMethod, params: object, callback: Function){
        if(!this.IsLoggedIn() && method == UntisMethod.Authenticate || this.IsLoggedIn && method != UntisMethod.Authenticate){
            const xHttp = new XMLHttpRequest();

            xHttp.open("POST", this.server + "/WebUntis/jsonrpc.do?school=" + this.school, true);
            xHttp.send(JSON.stringify(new UntisRequest(this.id, method, params)));
            xHttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    const response = JSON.parse(this.responseText) as UntisResult;
                    if(Untis.CheckResponse(response, method))
                        callback(response);
                }
            };
        }else if(this.IsLoggedIn() && method == UntisMethod.Authenticate){
            this.logout();
            //make it with callback!!!!!!!!!
            setTimeout(function() {
                this.request(method, params, callback);
            }, 1000);
        }
    }
    private static CheckResponse(response: object, responseOf: UntisMethod){
        if("error" in response){
            const error = response as UntisError;
            console.warn("%cAttempted request: " + responseOf + "\nError: " + error.error.message + "\nResponse: ", '', response);
            return false;
        }else if(response == null){
            console.warn("%cResponse was null!");
            return false;
        }
        return true;
    }

    public static IsLoggedIn(){
        return this.authenticator == null? false : true;
    }
}

enum UntisMethod{
    Authenticate = "authenticate",
    Logout = "logout",
}

class UntisMessage{
    constructor(id: string){
        this.id = id;
    }
    public id: string;
    public jsonrpc: string = "2.0";
}

class UntisError extends UntisMessage{
    error: {
        message: string;
        code: number;
    }
}

class UntisRequest extends UntisMessage{
    constructor(id: string, method: UntisMethod, params: object){
        super(id);
        this.method = method;
        this.params = params;
    }
    public method: UntisMethod;
    public params: object;
}
//#region Params
class UntisAuthenticationParams{
    constructor(user: string, password: string, client: string){
        this.user = user;
        this.password = password;
        this.client = client;
    }
    public user: string;
    public password: string;
    public client: string;
}
//#endregion

class UntisResponse extends UntisMessage{
    result: UntisResult;
}
//#region Results
class UntisResult{

}
class UntisAuthenticationResult extends UntisResult{
    sessionId: string;
    personType: number;
    personId: number
}

//#endregion

export default Untis;