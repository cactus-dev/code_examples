import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appParallaxElement]'
})
export class ParallaxElementDirective implements OnInit {
  public heightWindow = 0;
  public brightness = 1;

  @HostListener('window:scroll', [])
  public onWindowScroll: Function = this._windowScrollHandler;

  constructor(public el: ElementRef) {}

  ngOnInit() {
    this.heightWindow = this.el.nativeElement.clientHeight;
  }

  private _windowScrollHandler(): void {
    const differenceHeight = this.heightWindow - window.innerHeight
    if (window.pageYOffset > differenceHeight) {
      this.brightness =
        1 - (window.pageYOffset - differenceHeight) / (this.heightWindow - differenceHeight);
      this.el.nativeElement.style.filter =
        `brightness(${this.brightness.toFixed(3)})`;
    } else {
      this.el.nativeElement.style.filter = `brightness(1)`;
    }
  }
}
