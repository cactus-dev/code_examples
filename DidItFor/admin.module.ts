import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { MyDatePickerModule } from 'mydatepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AdminComponent } from 'app/admin';

// Pages
import {
  ChallengesAdminComponent,
  FinanceAdminComponent,
  PaymentsAdminComponent,
  PayoutsAdminComponent,
  ReportsAdminComponent,
  RefundsAdminComponent,
  FinanceAdminSettingsComponent,
  ReportPageAdminComponent
} from 'app/admin/pages';

// Components
import {
  HeaderAdminComponent,
  PaginationComponent,
  QuickbooksIntegrationComponent,
  SidenavAdminComponent,
  ChallengesTableComponent,
  PaymentsTableComponent,
  RefundsTableComponent,
  PayoutsTableComponent,
  BillComComponent,

  // Modals
  ConfirmationModalComponent,
  InfoModalComponent,
  InfoAboutPaymentModalComponent,
  NewPayoutsModalComponent,
  ShowCharityPayoutsModalComponent,
  ShowPayoutsModalComponent,
  ShowBatchRefundComponent,
  BillComLoginComponent,
  ConfirmationCodeBillComComponent
} from 'app/admin/components';

// Services
import {
  AdminAuthService,
  AdminHelperService,
  AdminPayoutsService,
  QuickbooksIntegrationService,
  AdminPaymentsService,
  AdminRefundsService,
  AdminChallengesService,
  BillComService
} from 'app/admin/services';

import { AuthenticationService } from 'app/utils/services/auth/authentication.service';
import { DialogService } from 'app/utils/services/shared/dialog/dialog.service';

const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthenticationService, AdminAuthService],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'finance'
      },
      {
        path: 'finance',
        component: FinanceAdminComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'payments'
          },
          {
            path: 'payouts',
            component: PayoutsAdminComponent
          },
          {
            path: 'payments',
            component: PaymentsAdminComponent
          },
          {
            path: 'challenges',
            component: ChallengesAdminComponent
          },
          {
            path: 'refunds',
            component: RefundsAdminComponent
          },
          {
            path: 'reports',
            component: ReportsAdminComponent
          },
          {
            path: 'settings',
            component: FinanceAdminSettingsComponent,
          }
        ]
      },
      {
        path: 'reports',
        component: ReportPageAdminComponent,
      },
      {
        path: '**',
        redirectTo: 'index',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_ROUTES),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    AdminComponent,
    FinanceAdminComponent,
    ReportPageAdminComponent,
    HeaderAdminComponent,
    SidenavAdminComponent,
    PayoutsAdminComponent,
    PaymentsAdminComponent,
    RefundsAdminComponent,
    FinanceAdminSettingsComponent,
    ChallengesAdminComponent,
    PaginationComponent,
    QuickbooksIntegrationComponent,
    ShowPayoutsModalComponent,
    NewPayoutsModalComponent,
    ConfirmationModalComponent,
    ShowCharityPayoutsModalComponent,
    InfoAboutPaymentModalComponent,
    InfoModalComponent,
    ReportsAdminComponent,
    ChallengesTableComponent,
    PaymentsTableComponent,
    RefundsTableComponent,
    PayoutsTableComponent,
    ShowBatchRefundComponent,
    BillComComponent,
    BillComLoginComponent,
    ConfirmationCodeBillComComponent
  ],
  entryComponents: [
    AdminComponent,
    FinanceAdminComponent,
    ShowPayoutsModalComponent,
    ShowCharityPayoutsModalComponent,
    NewPayoutsModalComponent,
    ConfirmationModalComponent,
    InfoAboutPaymentModalComponent,
    InfoModalComponent,
    ShowBatchRefundComponent,
    BillComLoginComponent,
    ConfirmationCodeBillComComponent
  ],
  providers: [
    AdminAuthService,
    AdminHelperService,
    AdminPayoutsService,
    QuickbooksIntegrationService,
    AdminPaymentsService,
    AdminRefundsService,
    DialogService,
    AdminChallengesService,
    BillComService
  ]
})
export class AdminModule { }
