import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef,
  Inject,
  ComponentRef,
  ComponentFactory,
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { TooltipComponent } from './tooltip/tooltip.component';
import { ContentOptions } from './models/content-options';

@Directive({
  selector: '[tooltip]'
})
export class ToolTipDirective {
  @Input() text = '';
  public isShow = false;
  public contentCmpRef: ComponentRef<TooltipComponent>;

  @HostListener('mouseover', ['$event'])
  public onMouseOver: Function = this._onShowTooltip;

  @HostListener('mouseleave')
  public onWindowScroll: Function = this._hideTooltip;

  constructor(public el: ElementRef,
              private _cfr: ComponentFactoryResolver,
              private _vcr: ViewContainerRef,
              @Inject(DOCUMENT) private _document: any) {}

  private _onShowTooltip(): void {
    if (!this.isShow) {
      this.isShow = true;
      this._initTooltip();
    }
  }

  private _hideTooltip(): void {
    if (this.contentCmpRef) {
      this.contentCmpRef.destroy();
      this.isShow = false;
    }
  }

  private _initTooltip(): void {
    const parent = this.el.nativeElement.parentNode;
    const { x, y, height, width } = parent.getBoundingClientRect();
    const options = new ContentOptions(x, y, width, this.text);
    this._buildTooltip(options);
  }

  private _buildTooltip(options: ContentOptions): void {
    let componentFactory: ComponentFactory<TooltipComponent>;
    componentFactory = this._cfr.resolveComponentFactory(TooltipComponent);
    this.contentCmpRef = this._vcr.createComponent(componentFactory);
    this._document.querySelector('body').appendChild(this.contentCmpRef.location.nativeElement);

    this.contentCmpRef.instance.contentOptions = options;
  }
}
