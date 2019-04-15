import { Component, AfterViewInit, Inject, Renderer2 } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { DialogService } from 'app/utils/services/shared/dialog/dialog.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [DialogService]
})
export class AdminComponent implements AfterViewInit {
  private _spinner = this._document.getElementsByClassName('loading')[0];
  private _isLoaded = false;

  constructor(private _router: Router,
              @Inject(DOCUMENT) private _document: Document,
              private _renderer: Renderer2,
              private _dialogService: DialogService) {
    _router.events.subscribe((event: any) => {
      this.navigationInterceptor(event);
    });
    this._renderer.addClass(this._document.body, 'on-load');
  }

  ngAfterViewInit() {
    setTimeout(
      () => {
        this.turnOffSpinner();
        this._isLoaded = true;
      }, 100);
  }

  public navigationInterceptor(event: any): void {
    if (event instanceof NavigationStart && this._isLoaded) {
      this.turnOffSpinner();
    }
  }

  public turnOffSpinner() {
    this._renderer.removeClass(this._document.body, 'on-load');
    this._renderer.setStyle(this._spinner, 'opacity', 0);
    this._renderer.setStyle(this._spinner, 'z-index', -1);
  }
}
