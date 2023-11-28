import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslateService } from '@ngx-translate/core'

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private matSnackBar: MatSnackBar, private translateService: TranslateService) {}

  notifySuccess(message: string) {
    this.translateService.get(message).subscribe((translate) =>
      this.matSnackBar.open(translate, 'Success', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      })
    )
  }
}
