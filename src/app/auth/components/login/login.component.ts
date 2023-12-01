import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { AuthActions as ItemActions } from '../../store/auth.actions'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { tap } from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router'
import { AuthProvider } from '../../utils/auth.model'
import { Store } from '@ngrx/store'
import { AuthEntityService } from '../../services/auth.service'
import { getErrorMessage } from 'src/app/shared/utils/get-error-message'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import firebase from 'firebase/compat/app'
import { markInvalidFields } from 'src/app/shared/utils/mark-invalid-fields'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  // Auth config
  hasFirebasAuth: boolean
  hasInAppAuth: boolean
  authUser: any
  appUser: any

  // Auth By Email
  form: FormGroup

  // Auth By Phone
  phone = new FormControl(null)
  code = new FormControl(null)
  confirmationCodeBySMS: any

  readonly getErrorMessage = getErrorMessage

  constructor(
    private store$: Store,
    private angularFireAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private authEntityService: AuthEntityService
  ) {}

  ngOnInit(): void {
    this.initFirebaseAuth()
    this.initForm()
  }

  initForm() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    })
  }

  initFirebaseAuth() {
    this.angularFireAuth.authState
      .pipe(
        tap((value: any) => {
          this.hasFirebasAuth = true
        })
      )
      .subscribe()
  }

  login(provider: AuthProvider) {
    switch (provider) {
      case 'google':
        this.store$.dispatch(ItemActions.loginWithGoogle())
        break
      case 'facebook':
        this.store$.dispatch(ItemActions.loginWithFacebook())
        break
      case 'apple':
        this.store$.dispatch(ItemActions.loginWithApple())
        break
      case 'apple':
        this.store$.dispatch(ItemActions.loginAnonymously())
        break
    }
  }

  signUpWithEmail(form) {
    if (form.valid) {
      const email = form.value.email
      const password = form.value.password
      this.authEntityService.createUserWithEmailAndPassword(email, password)
    } else markInvalidFields(form)
  }

  signInWithPhoneNumber() {
    const capcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' })
    this.authEntityService
      .signInWithPhoneNumber(this.phone.value, capcha)
      .then((result) => (this.confirmationCodeBySMS = result))
      .catch((error) => console.log(error))
  }

  confirmPhoneCode() {
    this.confirmationCodeBySMS.confirm(this.code.value)
  }
}
