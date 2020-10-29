import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'lib-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @ViewChild('carousel') container: ElementRef<HTMLDivElement>;

  constructor() { }

  ngOnInit(): void {
  }

}
