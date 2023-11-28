import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthActions as ItemActions } from '../../store/auth.actions'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { MatTableDataSource } from '@angular/material/table'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  userData
  userId
  role

  datasource = new MatTableDataSource()
  displayedColumns = ['date', 'price']

  form: FormGroup

  isLoaded: boolean
  versionBuildDate: string = '29 de Septembre 2023'

  constructor(private afAuthState: AngularFireAuth, private store$: Store, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initForm()
    this.getUserData()
  }

  getUserData() {
    this.afAuthState.authState.subscribe((res) => {
      if (res) {
        this.userData = res
        this.cdr.markForCheck()
      }
    })
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change',
      }),
      address: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change',
      }),
      phone: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change',
      }),
    })
  }

  updateClientData(form) {
    // this.daoClient.updateDocument(this.userId, form.value).then(() => {
    //   this.isLoaded = true
    //   setTimeout(() => {
    //     this.isLoaded = false
    //   }, 2000)
    // })
  }

  logout() {
    this.store$.dispatch(ItemActions.logOut())
  }
}
