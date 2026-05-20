import { Directive, ElementRef, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appTruncatedTooltip]',
  standalone: false
})
export class TruncatedTooltipDirective {
  @Input('appTruncatedTooltip') tooltipText: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    const element = this.el.nativeElement;
    // We check the first child because the wrapper itself doesn't truncate, the <p> or <h3> inside does.
    const target = element.firstElementChild || element;
    
    const isTruncated = 
      target.scrollWidth > target.clientWidth || 
      target.scrollHeight > target.clientHeight;

    if (isTruncated && this.tooltipText) {
      this.renderer.setAttribute(element, 'data-tooltip', this.tooltipText);
      this.renderer.addClass(element, 'tooltip-active');
    } else {
      this.renderer.removeAttribute(element, 'data-tooltip');
      this.renderer.removeClass(element, 'tooltip-active');
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer.removeClass(this.el.nativeElement, 'tooltip-active');
  }
}
