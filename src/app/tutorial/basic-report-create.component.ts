import {Component} from '@angular/core';

// our component is a class and we "give" it to angular to use it with export
// the annotation is called decorator. As parameter it takes some configuration in from of a js object
@Component({
  // define a selector. It should begin with app- to avoid collisions with normal html elements
  selector: 'app-basic-report-create',
  // file where we find the html code of the component
  templateUrl: './basic-report-create.component.html',
  styleUrls: ['basic-report-create.component.css']
})
export class BasicReportCreateComponent {
  newReport = 'No Content';
  //method that can be called on an event
  onAddReport(reportInput: HTMLTextAreaElement){
    // with console.dir we can log all properties of the HTMLTextAreaElement
    // there we can see that we get the text in the textarea via value
    console.log(reportInput.value);
    this.newReport = reportInput.value;
  }
}
