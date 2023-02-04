import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { PosService } from 'src/app/api/pos/pos.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { GetUserInfoComponent } from 'src/app/pages/pos/get-user-info/get-user-info.component';
import { formatNumber } from '@angular/common';
import * as _ from 'lodash';


@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);
  order: Array<any> = []

  user: BehaviorSubject<any> = new BehaviorSubject('')
  totalPrice: BehaviorSubject<number> = new BehaviorSubject(0)
  formatnumber: any = formatNumber
  clickCount = 0;

  constructor(

    public settings: AppSettingsService,
    public dialog: MatDialog,
    public auth: AuthService,
    private modal: ModalsService,
    private translate: TranslateService,
    private apiQuery: ApiQueryService,
    private pos: PosService

  ) { }

  ngOnInit(): void {
    this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'pos', false, 'general.create', true, true))
    this.getData()

    let isApply = this.apiQuery.isApply.subscribe(res => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'pos') return;
      this.getData()
    })


    this.unsubscribe.push(isApply);

  }

  isSelected(id: any) {
    let index = this.order.findIndex(res => res.id === id)
    if (index >= 0) return true
    return false
  }
  getTotalQuantity(){
    let items = this.order.reduce((prev, curr) => prev + curr.quantity, 0)
    return items
  }

  getQuantity(id: any) {
    let item = this.order.find(res => res.id === id)
    let quantity = item.quantity
    return quantity
  }

  add(id: any) {

    let array = _.cloneDeep(this.order)

    let newArr = array.map(res => {
      if (res.id !== id) return res
      if (!this.isCash(res.price)) return res
      res.quantity++
      res.total_price = res.price * res.quantity
      return res

    })

    this.order = newArr

    this.getTotalPrice()
  }



  min(id: any) {

    let array = _.cloneDeep(this.order)

    let newArr = array.map(res => {
      if (res.id !== id) return res
      res.quantity--
      res.total_price = (res.total_price - res.price)
      return res

    })

    this.order = newArr

    let item = this.order.find(res => res.id === id)
    if (item.quantity === 0) this.removeSelect(id)

    this.getTotalPrice()

  }

  addSelect(item: any) {
    let data = item

    if (!this.isCash(data.price)) return data
    data.quantity = 1
    data.total_price = data.price

    this.order.unshift(data)
    this.getTotalPrice()
  }

  removeSelect(id: any) {
    let array = _.cloneDeep(this.order)
    let newArr = array.filter(res => res.id != id)
    this.order = newArr
    this.getTotalPrice()

  }

  handleSelected(item: any = '') {
    if (!this.isUser()) return
    let id = item.id
    if (this.order.length <= 0) return this.addSelect(item)

    let index = this.order.findIndex(res => res.id === id)
    if (index < 0) return this.addSelect(item)
    if (index >= 0) return this.removeSelect(id)
  }

  doubleClickRemove(id: string) {
    this.clickCount++;

    setTimeout(() => {

      if (this.clickCount === 2) this.removeSelect(id)

      this.clickCount = 0;

    }, 250)
  }

  async getData() {

    let data = this.pos.getAllProduct('active').subscribe(async (res: any) => {

      if (!res) return;
      this.items.next(res.content)

      if (res.content.length <= 0) return this.apiQuery.resetPagination()

      this.apiQuery.totalPages.next(res.count - 1)
    })

    this.unsubscribe.push(data);

  }

  clear() {
    this.order = []
    this.user.next('')
    this.totalPrice.next(0)
  }

  newOrder() {

    let invoice = {
      total_price: this.totalPrice.value,
      order: this.order,
      user_id: this.user.value.id
    }

    this.pos.newInvoice(invoice).subscribe(res => {
      if (!res) return;
      this.modal.generalSuccessMessageModal('general.order_added')
      this.clear()

    })

  }

  getUser() {

    const dialogRef = this.dialog.open(GetUserInfoComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',

    }).afterClosed().pipe(take(1)).subscribe(res => {
      if (!res) return;
      if(Object.keys(res).length === 0) return;
      if(res.cash <= 0) return this.modal.generalWarningMessageModal2('pos.no_cash')
      this.user.next(res)
      
    })

  }

  isUser() {
    if (!this.user.value) {
      this.modal.generalWarningMessageModal2('pos.add_student_first')
      return false
    }
    return true;
  }



  getOrderList() {

    let array = _.cloneDeep(this.order)
    return array

  }

  getTotalPrice() {
    let price = this.order.reduce((prev, curr) => (curr.total_price) + prev, 0)
    this.totalPrice.next(price)
  }

  expandCart() {

    if (document.querySelector('.cart')?.classList.contains('cart-expand')) {
      let cart = document.querySelector('.cart')?.classList.remove('cart-expand')
      let arrow = document.querySelector('.expand i')?.classList.remove('rotate_arrow')
      return
    }

    let cart = document.querySelector('.cart')?.classList.add('cart-expand')
    let arrow = document.querySelector('.expand i')?.classList.add('rotate_arrow')

  }

  expandNote() {

    if (document.querySelector('.order-info')?.classList.contains('note-expand')) {
      let cart = document.querySelector('.order-info')?.classList.remove('note-expand')
      return
    }

    let cart = document.querySelector('.order-info')?.classList.add('note-expand')

  }

  isCash(itemPrice = 0) {
    let daily_cash = this.user.value.daily_cash
    let cash = this.user.value.cash

    if (cash && this.totalPrice.value + itemPrice >= cash) {
      this.modal.generalWarningMessageModal2('pos.max_cash')
      return false
    }

    if (daily_cash && this.totalPrice.value + itemPrice >= daily_cash) {
      this.modal.generalWarningMessageModal2('pos.max_cash_daily')
      return false
    }

    return true

  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.resetApiKey(true)
  }

}
