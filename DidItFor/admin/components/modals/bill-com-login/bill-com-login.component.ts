import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { BillComService } from 'app/admin/services';
import { InfoModalComponent } from 'app/admin/components/modals/info/info.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ConfirmationCodeBillComComponent
} from 'app/admin/components/modals/bill-com-confirm-code/bill-com-confirm-code.component';

@Component({
  selector: 'app-bill-com-login',
  templateUrl: './bill-com-login.component.html',
  styleUrls: ['./bill-com-login.component.scss']
})
export class BillComLoginComponent implements OnInit {
  public isLoad = false;
  public userForm: FormGroup;

  constructor(private dialog: MdDialog,
              private _dialogRef: MdDialogRef<BillComLoginComponent>,
              private billComService: BillComService) {
  }

  ngOnInit() {
    this.createForm();
  }

  public createForm(): void {
    this.userForm = new FormGroup({
      login: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      backup_phone: new FormControl(false)
    })
  }

  public onSubmit(): void {
    this.isLoad = true;
    this.billComService
      .openSession(this.userForm.value)
      .subscribe(
        response => {
          this.openConfirmationCode();
        },
        error => {
          const json = error.json();
          this.openInfo([json.message]);
          this.isLoad = false;
        })
  }

  public openConfirmationCode() {
    this.dialog
      .open(ConfirmationCodeBillComComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this._dialogRef.close(true);
        } else {
          this._dialogRef.close(false);
        }
      })
  }

  public openInfo(content: any): void {
    this.dialog
      .open(InfoModalComponent, { data: content });
  }

}
