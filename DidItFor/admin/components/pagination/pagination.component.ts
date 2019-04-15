import {
  Component, OnChanges, SimpleChanges, Input, Output, EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() public recordName: string;
  @Input() public totalCount: number;
  @Input() public resultsCount: number;
  @Input() public limitPerPage: number;
  @Input() public currentPage: number;
  @Output() public currentPageChange: EventEmitter<number> = new EventEmitter();

  public totalPages: number;
  public pages: Array<number>;

  public ngOnChanges(changes: SimpleChanges) {
    this.totalPages = Math.ceil(this.totalCount / this.limitPerPage);
    this.generatePages();
  }

  public resultsNumbersTitle(): string {
    const baseN = (this.currentPage - 1) * this.limitPerPage;
    return `${baseN + 1}-${baseN + this.resultsCount}`;
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.currentPageChange.emit(this.currentPage);
    }
  }

  public nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  public lastPage(): void {
    this.goToPage(this.totalPages);
  }

  public generatePages() {
    const minPage = 1;
    const maxPage = this.totalPages;
    const curPage = this.currentPage;
    const pageSideCount = 2;
    const pageTotalCount = pageSideCount * 2;
    let startPage, endPage;

    const constrainPage = (page: number): number => {
      if (page < minPage) {
        return minPage;
      } else if (page > maxPage) {
        return maxPage;
      } else {
        return page;
      }
    }

    // Start from right side because it has less buffer
    if (curPage - minPage > maxPage - curPage) {
      endPage = constrainPage(curPage + pageSideCount);
      startPage = constrainPage(endPage - pageTotalCount);
    } else {
      startPage = constrainPage(curPage - pageSideCount);
      endPage = constrainPage(startPage + pageTotalCount);
    }
    this.pages = Array.from({length: endPage - startPage + 1}, (_, index) => {
      return startPage + index;
    })
  }

  public showDotsAfterPages(): boolean {
    return this.pages[this.pages.length - 1] !== this.totalPages;
  }
}
