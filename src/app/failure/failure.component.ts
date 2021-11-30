import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {FailureMessage} from "./failure.model";
import {Role} from "../permission/role";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.css']
})
export class FailureComponent implements AfterViewInit {

  //...
  private websocketurl : string = environment.websocketurl;
  private socket;


  constructor() {
   this.socket = new WebSocketSubject<{failureMessage : FailureMessage}>(this.websocketurl);
    //this.socket = WebSocketSubject.create('ws://localhost:8999');

    this.socket
      .subscribe(
        (message) => console.log(message),
        (err) => console.error(err),
        () => console.warn('Completed!')
      );

    this.socket.next({
      id: 'te',
      title: 'te',
      status: 'te',
      type: 'te',
      user_id: 'te'
    });
  }

  ngAfterViewInit(): void {
    console.log("failure view was initialized")
  }

  //...
}
