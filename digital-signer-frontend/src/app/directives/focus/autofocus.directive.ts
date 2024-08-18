import { Directive, AfterViewInit, ElementRef } from '@angular/core';

/**
 * Directiva que permite configurar el focus para el input que lo requiera
 */
@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}
