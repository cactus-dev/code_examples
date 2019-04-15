import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { NewPayoutsModalComponent } from 'app/admin/components';
import { DialogService } from 'app/utils/services/shared/dialog/dialog.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationModalComponent {

  constructor(public _dialogRef: MdDialogRef<ConfirmationModalComponent>,
              @Inject(MD_DIALOG_DATA) public strings: string[]) { }

  public confirmationTrue(): void {
    this._dialogRef.close(true);
  }
}
