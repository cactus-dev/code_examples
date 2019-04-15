import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContentOptions } from '../models/content-options';

@Component({
  templateUrl : './tooltip.component.html',
  styleUrls : ['tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TooltipComponent {
    public contentOptions: ContentOptions;

    constructor() {}
}
