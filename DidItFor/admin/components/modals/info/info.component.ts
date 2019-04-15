import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoModalComponent {

  constructor(@Inject(MD_DIALOG_DATA) public strings: string[]) { }
}
