import { Injectable, inject } from '@angular/core'
import { GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Observable, from } from 'rxjs'
import { AuthConstants } from '../utils/auth.constants'
import { RepositoryService } from 'src/app/shared/repository/repository.service'
import { OrderRequest } from 'src/app/shared/repository/repository.model'

@Injectable({
  providedIn: 'root',
})
export class AuthEntityService {
  readonly collection = AuthConstants.collectionName
  readonly repositoryService: RepositoryService = inject(RepositoryService)
  readonly angularFireAuth: AngularFireAuth = inject(AngularFireAuth)

  loginWithGoogle(): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.signInWithPopup(new GoogleAuthProvider()))
  }

  loginWithFacebook(): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.signInWithPopup(new FacebookAuthProvider()))
  }

  loginWithApple(): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.signInWithPopup(new OAuthProvider('apple.com')))
  }

  loginAnonymously(): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.signInAnonymously())
  }

  signInWithPhoneNumber(phone, capcha): Promise<firebase.auth.ConfirmationResult> {
    return this.angularFireAuth.signInWithPhoneNumber(phone, capcha)
  }

  createUserWithEmailAndPassword(email: string, password: string): Observable<firebase.auth.UserCredential | void> {
    return from(
      this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((user) => user.user.sendEmailVerification())
    )
  }

  logout(): Observable<void> {
    return from(this.angularFireAuth.signOut())
  }

  getAll<T>(): Observable<T[]> {
    return this.repositoryService.getAllDocuments<T>(this.collection)
  }

  getById<T>(id: string): Observable<T> {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus<S>(status: S): Observable<number> {
    return this.repositoryService.getCollectionSize<S>(this.collection, status)
  }

  getFirstPage<T, S>(order: OrderRequest, size: number, status: S): Observable<T[]> {
    return this.repositoryService.getFirstPage<T, S>(this.collection, order, size, status)
  }

  getNextPage<T, S, V>(order: OrderRequest, size: number, status: S, value: V): Observable<T[]> {
    return this.repositoryService.getNextPage<T, S, V>(this.collection, order, size, status, value)
  }

  getPreviousPage<T, S, V>(order: OrderRequest, size: number, status: S, value: V): Observable<T[]> {
    return this.repositoryService.getPreviousPage<T, S, V>(this.collection, order, size, status, value)
  }

  getAllByQuery<T>(property: string, value: string): Observable<T[]> {
    return this.repositoryService.getAllDocumentsByIncludesQuery<T>(this.collection, property, value)
  }

  create<T>(item: T, id: string): Observable<void> {
    return this.repositoryService.createDocumentWithId<T>(this.collection, item, id)
  }

  update<T>(item: T, id: string): Observable<void> {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

  delete(id: string): Observable<void> {
    return this.repositoryService.deleteDocument(this.collection, id)
  }

  updateStatus<T>(status: T, id: string): Observable<void> {
    return this.repositoryService.updateDocument(this.collection, { status: status }, id)
  }
}
