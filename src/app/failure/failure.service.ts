import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {WebSocketSubject} from "rxjs/webSocket";
import {FailureMessage} from "./failure.model";
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class FailureService {
  private failureMessage : FailureMessage;
  private websocketurl : string = environment.websocketurl;
  private WebSocketSubjectSingleton = (function () {
    let instance;
    function createInstance(){
      let instance = new WebSocketSubject<FailureMessage>(environment.websocketurl);
      return instance;
    }
    return {
      getInstance : function(){
        if(!instance){
          instance = createInstance();
        }
        return instance;
      }
    }
  })();
  private currentFailureMessage = new Subject<FailureMessage>();

  constructor() {
    this.getFailureMessage();
  }

  getWebSocketSingleton(){
    return this.WebSocketSubjectSingleton;
  }

  getFailureMessage(){
    // get message from web socket subject
    this.WebSocketSubjectSingleton.getInstance()
      .subscribe(
        (message : FailureMessage) => {
          this.failureMessage = message;
          // write message in current failure message subject
          this.currentFailureMessage.next(this.failureMessage);
          console.log(this.failureMessage);
        },
            (err) => console.error(err)
      );
  }

  getSocketSubject(){
  console.log("a new message socket is created");
  let messageSocket = new WebSocketSubject<FailureMessage>(this.websocketurl);
  return messageSocket;
  }

  sendFailureMessage(failureMessage : FailureMessage){
    console.log("sending failure message with title: " + failureMessage.title);
    this.WebSocketSubjectSingleton.getInstance().next({
      id: failureMessage.id,
      title: failureMessage.title,
      status: failureMessage.status,
      type: failureMessage.type,
      user_id: failureMessage.user_id
    });
  }

  getFailureMessageListener(){
    return this.WebSocketSubjectSingleton.getInstance().asObservable();
  }

  getCurrentFailureMessageListener(){
    return this.currentFailureMessage.asObservable();
  }
}
