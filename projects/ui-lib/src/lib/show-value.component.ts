import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ShowMediaDialogComponent} from './show-media-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'lib-show-value',
  templateUrl: './show-value.component.html',
  styleUrls: ['./show-value.component.scss']
})
export class ShowValueComponent implements OnInit {

  @Input() row: any;
  @Input() value: string;
  @Input() imgStyle = 'width: 48px; height: 48px;';
  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement>;
  type = '';
  mediaURI: string;
  mediaType: string;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.row && this.row.mediaType && this.row.mediaType.indexOf('/') > 0){
      this.type = this.row.mediaType.substr(0, this.row.mediaType.indexOf('/'));
      this.mediaURI = '/api/v1/assets/' + this.row.mediaId;
      this.mediaType = this.row.mediaType;
      console.log('ShowValueComponent', this.type, this.imgStyle, this.mediaURI, this.mediaType);
    }
  }
  play(): void {
    if (this.type){
      this.dialog.open(ShowMediaDialogComponent, {
        data: {
          mediaURI: this.mediaURI,
          mediaType: this.mediaType
        }
      });
    }
  }

  playVideo(): void {
    if (this.type === 'video') {
      this.videoElement.nativeElement.play().catch(e => {
        console.log(e);
      });
    }
  }

  stopVideo(): void {
    if (this.type === 'video') {
      this.videoElement.nativeElement.pause();
    }
  }

}
