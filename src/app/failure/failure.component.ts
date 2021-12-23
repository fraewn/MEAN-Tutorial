import {Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy, NgModule, Input} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {FailureMessage} from "./failure.model";
import {Role} from "../permission/role";
import {environment} from "../../environments/environment";
import {FailureService} from "./failure.service";
import {NgModel} from "@angular/forms";

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.css']
})
export class FailureComponent implements OnInit, OnDestroy {
  failureService : FailureService;
  failureMessage : FailureMessage;
  private failureServiceSubscription : Subscription;

  constructor(failureService : FailureService) {
    this.failureService = failureService;
    this.failureMessage = {
      id : "test",
      title : "t", type : "t", status : "t", user_id : "t"
    }
  }
  ngOnInit(): void {
    console.log("ngoninit");
    this.failureService.getWebSocketSingleton().getInstance().subscribe( (incomingFailureMessage) => {
      this.failureMessage = incomingFailureMessage;
      console.log("happened");
      console.log(this.failureMessage);
    }, (err) => {
      console.log("no data could be retrieved from observable");
    });
  }

  ngOnDestroy(): void {
    this.failureServiceSubscription.unsubscribe();
  }



  //...
}
