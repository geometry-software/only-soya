import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { PaginationRequest, PaginationResponse } from '../../model/pagination.model'
import { RepositoryRequestQuery, SizeRequest } from '../../repository/repository.model'

@Component({
  selector: 'app-pagination',
  templateUrl: './app-pagination.component.html',
  styleUrls: ['./app-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPaginationComponent implements OnInit {
  @Input()
  paginationControl: FormControl<PaginationRequest<any>>
  @Input()
  sizeControl: FormControl<SizeRequest>
  @Input()
  paginationPayload: PaginationResponse<any>
  @Input()
  downloadState: boolean
  size: number

  ngOnInit(): void {
    this.size = this.sizeControl.value.size
  }

  changeSize(size) {
    this.sizeControl.setValue({
      size: size,
    })
  }

  changePage(query: RepositoryRequestQuery) {
    let item
    switch (query) {
      case 'first':
        item = null
        break
      case 'next':
        item = this.paginationPayload.item.last
        break
    }
    this.paginationControl.setValue({
      query: query,
      item: item,
    })
  }
}
