import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MediaService } from 'src/app/api/media/media.service';
import { ApiQueryService } from '../../services/apiQuery/api-query.service';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { AuthService } from '../../services/auth/auth.service';
import { RoleService } from '../../services/role/role.service';

@Component({
  selector: 'app-select-media',
  templateUrl: './select-media.component.html',
  styleUrls: ['./select-media.component.scss']
})
export class SelectMediaComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);
  selected: Array<string> = [];

  constructor(

    private dialogRef: MatDialogRef<SelectMediaComponent>,
    public settings: AppSettingsService,
    public auth: AuthService,
    private apiQuery: ApiQueryService,
    public role: RoleService,
    private media: MediaService,

  ) { }

  ngOnInit(): void { }

  viewImage(item: any) {
    // if(item.type === 'doc') return '';
    let image = item
    if (!image) return
    let url = `${this.settings.url}media/${image}`

    window.open(url, "_blank");
  }

  isSelected(id: any){
    let index = this.selected.findIndex(res => res === id)
    if(index >= 0) return true
    return false
  }

  addSelect(id: any) {
    this.selected.push(id)

  }

  removeSelect(id:any) {
    let newArr = this.selected.filter(res => res != id)
    this.selected = newArr

  }

  handleSelected(id: any) {

    if (this.selected.length <= 0) return this.addSelect(id)

    let index = this.selected.findIndex(res => res === id)
    if (index < 0) return this.addSelect(id)
    if (index >= 0) return this.removeSelect(id)
  }

  getImage(item: any) {
    let image = item
    if (!image) return
    let url = `url(${this.settings.url}media/${image})`
    return url
  }
  removeItem(id: string) {
    let data = this.items.value
    let index = this.items.value.findIndex((item: any) => item.id === id)

    data.splice(index, 1)

    this.items.next(data)

  }

  isImage(name: any) {
    if (name.includes('jpg') || name.includes('jpeg') || name.includes('png')) return true
    return false
  }

  getAll() {

    this.media.getAll().subscribe((res: any) => {
      if (!res) return;
      this.items.next(res.content)
    })

  }

  save() {

    this.dialogRef.close({media: this.selected});

  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.isShowSearch.next(false)

  }

  ngAfterViewInit(): void {
    this.getAll();

    this.apiQuery.isShowSearch.next(true)

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

  }

}
