import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {WebSocketSubject} from "rxjs/webSocket";
import {FailureMessage} from "./failure.model";

@Injectable({providedIn: 'root'})
export class FailureService {


  private websocketurl : string = environment.websocketurl;
  private socket;


  constructor() {
    this.socket = new WebSocketSubject<{ failureMessage: FailureMessage }>(this.websocketurl);

    this.socket
      .subscribe(
        ( message) => console.log(message),
        (err) => console.error(err),
        () => console.warn('Completed!')
      );
  }

  sendFailureMessage(failureMessage : FailureMessage){
    console.log("sending failure message with title: " + failureMessage.title);
    this.socket.next({
      id: failureMessage.id,
      title: failureMessage.title,
      status: failureMessage.status,
      type: failureMessage.type,
      user_id: failureMessage.user_id
    });
  }
}
