import { Injectable, inject } from '@angular/core'
import { Observable, forkJoin, from, map } from 'rxjs'
import { RepositoryService } from 'src/app/shared/repository/repository.service'
import { OrderRequest, RepositoryResponseEntity } from 'src/app/shared/repository/repository.model'
import { PlateConstants } from '../utils/plate.constants'
import { getCountFromServer, collection, query, where } from 'firebase/firestore'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { PlateCategory, PlateType } from '../utils/plate.model'
import { appendId, responseTransform } from 'src/app/shared/repository/repository.utils'
import { CustomerMenuTotalResponse } from '../../vegi/utils/customer.model'

@Injectable()
export class PlateEntityService {
  readonly collection = PlateConstants.collectionName
  readonly collectionLog = PlateConstants.collectionName + '_log'
  readonly repositoryService: RepositoryService = inject(RepositoryService)
  readonly angularFirestore: AngularFirestore = inject(AngularFirestore)

  getById<T>(id: string): Observable<T> {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getJoinedListLabelAmount = (): Observable<CustomerMenuTotalResponse> =>
    forkJoin([
      this.getListLabelAllAmount(),
      this.getListLabelAmount('starter'),
      this.getListLabelAmount('salad'),
      this.getListLabelAmount('soup'),
      this.getListLabelAmount('main'),
      this.getListLabelAmount('drink'),
      this.getListLabelAmount('dessert'),
      this.getListLabelAmount('extra'),
    ]).pipe(
      map(([all, starter, salad, soup, main, drink, dessert, extra]) => ({
        all,
        starter,
        salad,
        soup,
        main,
        drink,
        dessert,
        extra,
      }))
    )

  getListLabelAllAmount(): Observable<number> {
    return from(getCountFromServer(query(collection(this.angularFirestore.firestore, this.collection)))).pipe(
      map((value) => value.data().count)
    )
  }

  getListLabelAmount(category: PlateCategory): Observable<number> {
    return from(
      getCountFromServer(query(collection(this.angularFirestore.firestore, this.collection), where('category', '==', category)))
    ).pipe(map((value) => value.data().count))
  }

  getAll = <T, S>(order: OrderRequest, size: number, status: S, types: Array<PlateType>): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(this.collection, (query) =>
        query
          .orderBy(order.key, order.value)
          .where('status', '==', status)
          .where('types', 'array-contains-any', types)
          .limit(size)
      )
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  getFirstPage = <T, S>(
    order: OrderRequest,
    size: number,
    status: S,
    category: PlateCategory,
    types: Array<PlateType>
  ): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(this.collection, (query) =>
        query
          .orderBy(order.key, order.value)
          .where('status', '==', status)
          .where('category', '==', category)
          .where('types', 'array-contains-any', types)
          .limit(size)
      )
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  getNextPage<T, S, V>(order: OrderRequest, size: number, status: S, value: V): Observable<T[]> {
    return this.repositoryService.getNextPage<T, S, V>(this.collection, order, size, status, value)
  }

  getPreviousPage<T, S, V>(order: OrderRequest, size: number, status: S, value: V): Observable<T[]> {
    return this.repositoryService.getPreviousPage<T, S, V>(this.collection, order, size, status, value)
  }

  getAllByQuery<T>(property: string, value: string): Observable<T[]> {
    return this.repositoryService.getAllDocumentsByIncludesQuery<T>(this.collection, property, value)
  }

  create<T>(item: T): Observable<RepositoryResponseEntity> {
    const document = {
      ...item,
      status: 'active',
      timestamp: new Date(),
    }
    return this.repositoryService.createDocument<T>(this.collection, document)
  }

  update<T>(item: T, id: string): Observable<void> {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

  delete(id: string): Observable<void> {
    return this.repositoryService.deleteDocument(this.collection, id)
  }

  updateStatus<T>(id: string, status: T): Observable<void> {
    return this.repositoryService.updateDocument(this.collection, { status: status }, id)
  }
}
