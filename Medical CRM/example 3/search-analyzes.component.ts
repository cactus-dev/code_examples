import { Component, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs/Observable';

import { Analysis } from 'app/models';
import { AnalysisService } from 'app/services/analysis.service';

@Component({
    selector: 'app-search-analyzes',
    templateUrl: './search-analyzes.component.html',
    styleUrls: ['./search-analyzes.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchAnalyzesComponent {
    @Output() onSelectAnalysis = new EventEmitter<Analysis>();

    @ViewChild("input")
    private input: ElementRef;

    public model: any;
    public searching: boolean;

    constructor(private _analysisService: AnalysisService) { }

    public selectItem(event: NgbTypeaheadSelectItemEvent): void {
      event.preventDefault();
      this.onSelectAnalysis.emit(event.item);
      this.deleteText();
    }

    public search(text$: Observable<string>): Observable<Analysis[]> {
      return text$
        .debounceTime(500)
        .distinctUntilChanged()
        .do(() => this.searching = true)
        .switchMap(text => {
          return text && this._analysisService.getAnalyzesNameByParams({ q: text, tag: undefined }) ||
                 Observable.of([]);
        })
        .filter(() => this.model)
        .do(() => this.searching = false);
    }

    public deleteText(): void {
      this.model = '';
      this.input.nativeElement.value = '';
      this.searching = false;
    }

    public formatter(result: Analysis): string {
      return result.name;
    }
}
