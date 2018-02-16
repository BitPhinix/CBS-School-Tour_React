import {log} from "util";
import {stringify} from "querystring";

class Untis
{
    private static _id: string = String(Math.floor(Math.random() * 100000000));
    private static _authenticator: UntisAuthenticationParams;

    private static _server: string = "https://arche.webuntis.com";
    private static _school: string = "CBS-Mannheim";

    private static _loggedIn: boolean = false;

    public static Login(user: string = "", password: string = "", client: string = "") {

        this._authenticator = new UntisAuthenticationParams(user, password, client)

        this.Request(UntisMethod.Authenticate, this._authenticator, function (response: UntisResponse){
            Untis._loggedIn = true
        });
    }

    private static Logout(){
        this.Request(UntisMethod.Logout, null, function (){ Untis._loggedIn = false})
    }

    private static async Request(method: UntisMethod, params: object, callback: Function){
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", this._server + "/WebUntis/jsonrpc.do?school=" + this._school, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(new UntisRequest(this._id, method, params)));

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                var response = JSON.parse(this.responseText) as UntisResult;
                if(Untis.CheckResponse(response, method))
                    callback(response);
            }
        };
    }
    private static CheckResponse(response: object, responseOf: UntisMethod){
        if("error" in response){
            var error = response as UntisError;
            console.error("%cAttempted request: " + responseOf + "\nError: " + error.error.message + "\nResponse: ", 'color: red', response);
            return false;
        }else if(response == null){
            console.error("%cResponse is null!", 'color: red');
            return false;
        }
        return true;
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
class UntisResult extends UntisMessage{

}
//#endregion

export default Untis;