import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl implements OnDestroy {
  unsubscribe: Subject<void> = new Subject<void>();
  OF_LABEL: string = 'of';

  constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange.subscribe(() => {
        this.getAndInitTranslations();
    });

    this.getAndInitTranslations();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getAndInitTranslations() {
    this.translate.get([
      'pagination.firstPage',
      'pagination.lastPage',
      'pagination.itensPerPage',
      'pagination.nextPage',
      'pagination.previousPage',
      'pagination.ofLabel'
    ]).subscribe((translation: { [x: string]: string; }) => {
      this.firstPageLabel = translation['pagination.firstPage'];
      this.lastPageLabel = translation['pagination.lastPage'];
      this.itemsPerPageLabel = translation['pagination.itensPerPage'];
      this.nextPageLabel = translation['pagination.nextPage'];
      this.previousPageLabel = translation['pagination.previousPage'];
      this.OF_LABEL = translation['pagination.ofLabel'];
      this.changes.next();
    });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.OF_LABEL} ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =startIndex < length? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} ${this.OF_LABEL} ${length}`;
  };
}
