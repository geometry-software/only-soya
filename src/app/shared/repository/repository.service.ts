import { Injectable } from '@angular/core'
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore'
import { map } from 'rxjs/operators'
import { Observable, from } from 'rxjs'
import { getCountFromServer, collection, query, where } from 'firebase/firestore'
import { appendId, responseTransform } from './repository.utils'
import { OrderRequest } from './repository.model'

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  constructor(private angularFirestore: AngularFirestore) {}

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @returns Observable with all documents from collection
   */
  getAllDocuments = <T>(collection: string): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection)
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param id id of the document
   * @returns Observable with a single document by id
   */
  getDocumentById = <T>(collection: string, id: string): Observable<T> =>
    this.angularFirestore.collection(collection).doc<T>(id).valueChanges().pipe(responseTransform())

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param status filter a query by entity status
   * @returns Observable with an amount of documents matches a query
   */
  getCollectionSize = <S>(collectionName: string, status: S): Observable<number> =>
    from(
      getCountFromServer(query(collection(this.angularFirestore.firestore, collectionName), where('status', '==', status)))
    ).pipe(map((value) => value.data().count))

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param order sorted by the specified field, and in descending or ascending order
   * @param size limit a size of documents to return
   * @param status filter a query by entity status
   * @returns Observable with list of documents that matches a query
   */
  getFirstPage = <T, S>(collection: string, order: OrderRequest, size: number, status: S): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query.orderBy(order.key, order.value).where('status', '==', status).limit(size))
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param order sorted by the specified field, and in descending or ascending order
   * @param size limit a size of documents to return
   * @param status filter a query by entity status
   * @param value value of the property which query will be ordered by. Item that holds a property is the last element in the previously requested list
   * @returns Observable with list of documents that matches a query
   */
  getNextPage = <T, S, V>(collection: string, order: OrderRequest, size: number, status: S, value: V): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) =>
        query.orderBy(order.key, order.value).where('status', '==', status).startAfter(value).limit(size)
      )
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param order sorted by the specified field, and in descending or ascending order
   * @param size limit a size of documents to return
   * @param status filter a query by entity status
   * @param value value of the property which object is the last element in the previously requested list.
   * @returns Observable with list of documents that matches a query
   */
  getPreviousPage = <T, S, V>(collection: string, order: OrderRequest, size: number, status: S, value: V): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) =>
        query.orderBy(order.key, order.value).where('status', '==', status).endBefore(value).limitToLast(size)
      )
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param order sorted by the specified field, and in descending or ascending order
   * @param property name of the property is used to compare
   * @param value value of the property to compare
   * @returns Observable with list of documents that matches a query
   */
  getAllDocumentsByStrictQuery = <T>(collection: string, order: OrderRequest, property: string, value: string): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query.orderBy(order.key, order.value).where(property, '==', value))
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param property name of the property is used to compare
   * @param value value of the property to compare
   * @returns Observable with list of documents that matches a query
   */
  getAllDocumentsByIncludesQuery = <T>(collection: string, property: string, value: string): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) =>
        query
          .orderBy(property)
          .startAt(value)
          .endAt(value + '~')
      )
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Creates a record in a Firestore collection
   * @param collection name of the collection
   * @param item object that will be added
   * @returns A `DocumentReference` refers to a document location
   */
  createDocument = <T>(collection: string, item: T): Observable<DocumentReference> =>
    from(this.angularFirestore.collection(collection).add(item)).pipe(responseTransform())

  /**
   * Creates a record in a Firestore collection
   * @param collection name of the collection
   * @param item object that will be added
   * @param item custom id
   * @returns A `DocumentReference` refers to a document location
   */
  createDocumentWithId = <T>(collection: string, item: T, id: string): Observable<void> =>
    from(this.angularFirestore.collection(collection).doc(id).set(item)).pipe(responseTransform())

  /**
   * Update a docuemnt in a Firestore collection
   * @param collection name of the collection
   * @param item whole object or selected properies which will update an existing document
   * @param id id of the requested document
   * @returns :void
   */
  updateDocument = <T>(collection: string, item: T, id: string): Observable<void> =>
    from(this.angularFirestore.collection(collection).doc(id).update(item)).pipe(responseTransform())

  /**
   * Update a docuemnt in a Firestore collection
   * @param collection name of the collection
   * @param item whole object or selected properies which will update an existing document
   * @param id id of the requested document
   * @returns :void
   */
  deleteDocument = (collection: string, id: string): Observable<void> =>
    from(this.angularFirestore.collection(collection).doc(id).delete()).pipe(responseTransform())
}
