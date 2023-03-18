import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs/index';
import { SearchFilterService } from 'app/services/shared';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input() length: number;
  @Input() pageIndex: number;
  @Input() pageSize: number;
  goTo: number;
  pageNumbers: number[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @Input() disabled = false;
  @Input() hidePageSize = false;
  @Input() pageSizeOptions: number[];
  @Input() showFirstLastButtons = false;
  @Output() page = new EventEmitter<PageEvent>();
  @Input('pageIndex') set pageIndexChanged(pageIndex: number) {
      this.pageIndex = pageIndex;
      this.updateGoto();
  }
  @Input('length') set lengthChanged(length: number) {
      this.length = length;
      this.updateGoto();
  }
  @Input('pageSize') set pageSizeChanged(pageSize: number) {
      this.pageSize = pageSize;
      this.updateGoto();
  }

  subscription: Subscription;

  constructor(public searchFilterService: SearchFilterService) { }

  ngOnInit() {
    this.updateGoto();
  }

  onPaginateChange(event) {
    this.searchFilterService.pageIndex = event.pageIndex;
    this.searchFilterService.pageSize = event.pageSize;
    this.length = event.length;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateGoto();
    this.emitPageEvent(event);
  }

  updateGoto() {
    this.goTo = (this.pageIndex || 0) + 1;
    this.pageNumbers = [];
    const pageCount = Math.ceil(this.length / this.pageSize);
    for (let i = 1; i <= pageCount; i++) {
      this.pageNumbers.push(i);
    }
  }

  goToChange() {
    this.paginator.pageIndex = this.goTo - 1;
    this.searchFilterService.pageIndex = this.paginator.pageIndex;
    this.searchFilterService.pageSize = this.paginator.pageSize;
    this.emitPageEvent({
      length: this.paginator.length,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    });
  }

  emitPageEvent(pageEvent: PageEvent) {
    this.page.next(pageEvent);
  }
}
