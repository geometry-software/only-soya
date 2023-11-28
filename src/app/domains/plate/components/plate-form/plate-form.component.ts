import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { AngularFireStorageReference } from '@angular/fire/compat/storage'
import { FileStorageService } from 'src/app/shared/services/file-storage.service'
import { PLATE_CATEGORY_TRANSLATE_FORM, PLATE_TYPE_TRANSLATE, Plate } from '../../utils/plate.model'
import { Store } from '@ngrx/store'
import { getItem, getItemLoadingState } from '../../store/plate.selectors'
import { PlateActions as ItemActions } from '../../store/plate.actions'
import { Observable, tap } from 'rxjs'
import { getErrorMessage } from 'src/app/shared/utils/get-error-message'
import { markInvalidFields } from 'src/app/shared/utils/mark-invalid-fields'
import { SharedConstants } from 'src/app/shared/utils/shared.constants'
import { SignalService } from 'src/app/shared/services/signal.service'

@Component({
  selector: 'app-plate-form',
  templateUrl: './plate-form.component.html',
  styleUrls: ['./plate-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlateFormComponent implements OnInit {
  // Selectors
  readonly loadingState$: Observable<boolean> = this.store$.select(getItemLoadingState)
  readonly getItem$: Observable<Plate> = this.store$.select(getItem)

  // Constants
  formTitleDefaultColor = SharedConstants.formTitleDefaultColor
  formTitleErrorColor = SharedConstants.formTitleErrorColor

  form: FormGroup
  recipeTosave: Plate
  isEditForm: boolean
  itemId: string
  hasPrice: boolean
  hasCategory: boolean
  imgURL: string
  fileName: string
  fileImg: AngularFireStorageReference
  uploadProgress: number
  showUploadButton: boolean
  isUploadingImg: boolean
  isUploadedImg: boolean

  plateCategoryTranslate = PLATE_CATEGORY_TRANSLATE_FORM
  plateTypeTranslate = PLATE_TYPE_TRANSLATE

  constructor(
    private store$: Store,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private fileStorageService: FileStorageService,
    private signalService: SignalService
  ) {}

  ngOnInit() {
    this.initForm()
    this.setSignals()
  }

  getTypeControls = (i): string => ['vegan', 'gluten_free', 'sugar_free'][i]

  getTypeNames = (i): string => ['Vegan', 'Gluten free', 'Sugar free'][i]

  initForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null],
      category: [null, [Validators.required]],
      types: new FormArray([
        new FormGroup({
          vegan: new FormControl(null),
        }),
        new FormGroup({
          gluten_free: new FormControl(null),
        }),
        new FormGroup({
          sugar_free: new FormControl(null),
        }),
      ]),
      imgURL: [null],
      price: [null, [Validators.required]],
    })
    if (this.route.snapshot.routeConfig.path.includes('edit')) {
      this.itemId = this.route.snapshot.params['id']
      this.isEditForm = true
      this.store$.dispatch(ItemActions.getItem({ id: this.itemId }))
      this.store$
        .select(getItem)
        .pipe(
          tap((value) => {
            console.log(value)

            this.form.patchValue(value, { onlySelf: true })
            if (value?.price) this.hasPrice = true
          })
        )
        .subscribe()
    } else this.store$.dispatch(ItemActions.createItemFormInit())
  }

  setSignals() {
    this.signalService.setToolbarTitle(this.route.snapshot.data['title'])
    this.signalService.setLayoutType(this.route.snapshot.data['type'])
  }

  transfromTypesToAction() {
    const arr: Array<string> = []
    const hasType = this.form.value.types.find((el) => el === true)
    if (hasType) {
      this.form.value.types.forEach((el) => {
        const value = Object.values(el)
        if (value[0]) {
          arr.push('all')
          arr.push(Object.keys(el)[0])
        }
      })
      return arr
    } else {
      return ['all']
    }
  }

  transfromTypesFromAction() {
    const arr: Array<string> = []
    if (this.form.value.types?.length > 0) {
      this.form.value.types.forEach((el) => {
        const value = Object.values(el)
        if (value[0]) {
          arr.push('all')
          arr.push(Object.keys(el)[0])
        }
      })
      return arr
    } else {
      return ['all']
    }
  }

  submit(form) {
    if (form.valid) {
      if (!this.isEditForm) {
        const item = {
          ...form.value,
          types: this.transfromTypesToAction(),
        }
        this.store$.dispatch(ItemActions.createItem({ item }))
      } else {
        this.store$.dispatch(ItemActions.updateItem({ item: form.value, id: this.itemId }))
      }
    } else markInvalidFields(form)
  }

  getErrorMessage = getErrorMessage

  updateImg(event) {
    this.fileName = event.target.files[0].name
    this.fileImg = event.target.files[0]
    this.showUploadButton = true
  }

  uploadFile() {
    // TODO: check image upload and rewrite in declarative style
    this.isUploadingImg = true
    const uploadLink = this.fileStorageService.getFileLink(this.fileName)
    const uploadCtrl = this.fileStorageService.saveFile(this.fileName, this.fileImg)
    uploadCtrl.percentageChanges().subscribe((percentage) => {
      this.uploadProgress = Math.round(percentage)
      if (this.uploadProgress == 100) {
        this.showUploadButton = false
        this.isUploadingImg = false
        this.isUploadedImg = true
      }
    })
    uploadLink.getDownloadURL().subscribe((URL) => this.form.get('imgURL').setValue(URL))
  }
}
