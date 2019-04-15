import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Analysis, Consultation, UserMedicalInfo, FilterListAnalysis } from 'app/models';
import { AnalyzesResult, ConcatAnalyzesResult } from 'app/models/analyzes-result';
import { AnalysisService } from 'app/services/analysis.service';
import { UserInfoR } from 'app/classes/user-info-r';
import { AnalysisParams } from 'app/models/analysis-params';
import { WindowNames } from '../../window';

import { CONFIG_CKEDITOR } from './config-ckeditor';

@Component({
  selector: 'app-show-recomendation-modal.component',
  templateUrl: './show-recomendation-modal.component.html',
  styleUrls: ['./show-recomendation-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowRecomendationModalComponent implements OnInit {
  public emitChangeOpenedWindows: (name: WindowNames, value: boolean, canShowMinimize: boolean) => void;

  public choosenAnalyzes: Analysis[] = [];
  public info = '';
  public user: UserInfoR;
  public params = new AnalysisParams();

  public openConsultation: Consultation;
  public userMedicalInfo: UserMedicalInfo;

  public analysesInit = {
    message: ''
  };

  public filter = new FilterListAnalysis();
  public ckeConfig = CONFIG_CKEDITOR;

  constructor(
    private activeModal: NgbActiveModal,
    private _analysisService: AnalysisService,
  ) {
  }

  ngOnInit() {
    this.filter = {
      patient: this.user.id,
      hasPreview: true,
      complete: true,
    };
    this._getChoosenAnalyzes();
  }

  private _getChoosenAnalyzes(): void {
    this._analysisService.getChoosenAnalyzesByPatient(this.filter).subscribe(result => {
      this._refreshAnalysesData(result);
    });
  }

  private _refreshAnalysesData(result: any): void {
    const medicalInfo = {
      patientInfo: {...result.patientInfo},
      lastAnketa: {...result.consultation.lastAnketa},
      lastAnketaType: result.consultation.lastAnketaType
    };

    this.info = result.recommendations || '';
    this.userMedicalInfo = new UserMedicalInfo(medicalInfo);

    this._initAnalyzesWithResult(result.analyzes, result.analyzesResults, result.concatAnalyses);
  }

  private _initAnalyzesWithResult(analyzes: Analysis[], analyzesResults: AnalyzesResult[], concatAnalyses: any) {
    this.choosenAnalyzes = [];
    if (analyzes && analyzes.length) {
      if (analyzesResults && analyzesResults.length) {
        analyzes.forEach(analysis => {
          analysis['analyzesResults'] = analyzesResults.filter(res => res.catalogId === analysis.catalogId && analysis.hasResult)
            .map(item => new AnalyzesResult(item));
          analysis['concatAnalyses'] = concatAnalyses.filter(res => res.catalogId === analysis.catalogId && analysis.hasResult)
            .map(item => new ConcatAnalyzesResult(item));
          this.choosenAnalyzes.push(analysis);
        });
      } else {
        this.choosenAnalyzes = analyzes;
      }
    }
  }

  public minimizeModal(): void {
    this.emitChangeOpenedWindows('showRecomendation', true, true);
  }

  public closeModal(): void {
    this.emitChangeOpenedWindows('showRecomendation', false, false);
    this.activeModal.close();
  }
}
