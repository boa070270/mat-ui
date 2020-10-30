import {Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ComponentType} from '@angular/cdk/overlay';
import {DataSource} from '@angular/cdk/collections';
import {UIDataSource} from './ui-types';
import {Subscription} from 'rxjs';

@Component({
  selector: 'lib-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent<T> implements OnInit, OnDestroy {
  @ViewChild('carousel') container: ElementRef<HTMLDivElement>;
  @Input() itemTemplate: ComponentType<T> | TemplateRef<T>;
  @Input() datasource: UIDataSource<T>;
  @Input() showNumberItems: number;
  @Input() heightCarousel: number;
  @Input() widthItem: number;
  items: T[] = [];
  allData: T[] = [];
  subscription: Subscription;
  intervalID;
  position = 0;
  cycles = 0;

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]){
            console.log(Breakpoints.XSmall);
          } else if (result.breakpoints[Breakpoints.Small]){
            console.log(Breakpoints.Small);
          } else if (result.breakpoints[Breakpoints.Medium]){
            console.log(Breakpoints.Medium);
          } else if (result.breakpoints[Breakpoints.Large]){
            console.log(Breakpoints.Large);
          } else if (result.breakpoints[Breakpoints.XLarge]){
            console.log(Breakpoints.XLarge);
          }
        }
      });
  }
  nextPortion(): void {
    this.items.shift();
    if (this.position >= this.allData.length) {
      this.position = 0;
      this.cycles++;
    }
    this.items.push(this.allData[this.position++]);
  }
  ngOnInit(): void {
    this.subscription = this.datasource.select().subscribe(value => {
      if (this.showNumberItems > value.length) {
        this.showNumberItems = value.length;
      }
      this.position = this.showNumberItems;
      this.allData = value;
      this.items = this.allData.slice(0, this.showNumberItems);
    });
    this.intervalID = setInterval(() => {
        this.nextPortion();
        if (this.cycles > 5) {
          this.datasource.refresh();
        }
    }, 5000);
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }
  }

}
