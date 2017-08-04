import { Directive, Input, Inject, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

import { mergeConfigWithDefaults, DEFAULTS } from './statics/scroll-to-helpers';
import { ScrollToConfigOptions, ScrollToOffsetMap } from './models/scroll-to-options.model';
import { ScrollToAnimationEasing } from './models/scroll-to-easing.model';
import { ScrollToTarget } from './models/scroll-to-target.model';
import { ScrollToEvent } from './models/scroll-to-event.model';
import { ScrollToService } from './scroll-to.service';

@Directive({
	selector: '[ngx-scroll-to]'
})
export class ScrollToDirective implements AfterViewInit {

	@Input('ngx-scroll-to')
	public ngxScrollTo: ScrollToTarget = DEFAULTS.target;

	@Input('ngx-scroll-to-event')
	public ngxScrollToEvent: ScrollToEvent = DEFAULTS.event;

	@Input('ngx-scroll-to-duration')
	public ngxScrollToDuration: number = DEFAULTS.duration;

	@Input('ngx-scroll-to-easing')
	public ngxScrollToEasing: ScrollToAnimationEasing = DEFAULTS.easing;

	@Input('ngx-scroll-to-offset')
	public ngxScrollToOffset: number = DEFAULTS.offset;

	@Input('ngx-scroll-to-offset-map')
	public ngxScrollToOffsetMap: ScrollToOffsetMap = DEFAULTS.offsetMap;

	private _config: ScrollToConfigOptions;
	private _window_width: number;

	constructor(
		private _elementRef: ElementRef,
		private _scrollToService: ScrollToService,
		private _renderer2: Renderer2) {

	}

	/**
	 * Angular Lifecycle Hook - After View Init
	 *
	 * @todo test if event might be listened for with HostListener instead of renderer2 (for cleaner code)
	 * @todo implement setTimeout as a decorator, maybe move to service
	 * @todo emit events for 'start' and 'end', use 'subscribe' in listener method
	 * @returns void
	 */
	public ngAfterViewInit(): void {

		this._config = {
			target: this.ngxScrollTo,
			duration: this.ngxScrollToDuration,
			easing: this.ngxScrollToEasing,
			offset: this.ngxScrollToOffset,
			offsetMap: this.ngxScrollToOffsetMap
		};

		// Listen for the trigger...
		this._renderer2.listen(this._elementRef.nativeElement, this.ngxScrollToEvent,
			(event: Event) => {
				setTimeout((__HACK__: any) => this._scrollToService.scrollTo(event, this._config));
			});
	}
}
