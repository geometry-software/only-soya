import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './app-confirmation-dialog.component.html',
  styleUrls: ['./app-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppConfirmationDialogComponent implements OnInit, AfterViewInit {
  // isDeleteRecipe: boolean
  // isDeleteMenu: boolean
  // isDeleteClient: boolean
  // isDeleteOrders: boolean
  // isDeleteDelivery: boolean
  // isDeleteDeliveryRejected: boolean
  // isDeleteProduct: boolean
  // isDeleteStore: boolean

  isLoading: boolean

  constructor(
    private dialogRef: MatDialogRef<AppConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges()
  }

  ngOnInit() {
    this.checkOpenOrders()
  }

  checkOpenOrders() {
    // if (this.dialogData?.orders?.open) {
    //   this.openAmount = this.dialogData.orders.open
    // }
    // if (this.dialogData?.orders?.delivery) {
    //   this.deliveryAmount = this.dialogData.orders.delivery
    // }
  }

  // prepareRelatedView() {
  //   switch (this.data.type) {
  //     case 'delete-farm':
  //       this.isDeleteRecipe = true
  //       break
  //     case 'delete-menu':
  //       this.isDeleteMenu = true
  //       break
  //     case 'delete-client':
  //       this.isDeleteClient = true
  //       break
  //     case 'delete-orders':
  //       this.isDeleteOrders = true
  //       break
  //     case 'delete-delivery-list':
  //       this.isDeleteDelivery = true
  //       break
  //     case 'delete-delivery-list-rejected':
  //       this.isDeleteDeliveryRejected = true
  //       break
  //     case 'delete-product':
  //       this.isDeleteProduct = true
  //       break
  //     case 'delete-store':
  //       this.isDeleteStore = true
  //       break
  //     default:
  //       break
  //   }
  // }

  confirm() {
    this.isLoading = !this.isLoading
    this.dialogRef.close(true)
  }

  close() {
    this.dialogRef.close(false)
  }
}
