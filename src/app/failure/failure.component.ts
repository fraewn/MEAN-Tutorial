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



  ngAfterViewInit(): void {
    console.log("failure view was initialized")
  }

  //...
}
