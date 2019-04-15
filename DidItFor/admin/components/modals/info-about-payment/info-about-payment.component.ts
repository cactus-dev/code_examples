import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { IPayment } from 'app/admin/models';

@Component({
  selector: 'app-info-about-payment',
  templateUrl: './info-about-payment.component.html',
  styleUrls: ['./info-about-payment.component.scss']
})
export class InfoAboutPaymentModalComponent {

  constructor(@Inject(MD_DIALOG_DATA) public infoChallenge: IPayment) { }

}
