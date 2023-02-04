import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { FormBuilder } from '@angular/forms';
import { ApiQueryService } from '../../services/apiQuery/api-query.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  form:any;
  isRtl: boolean = false

  constructor(
    public settings: AppSettingsService,
    private formBuilder: FormBuilder,
    public apiQuery: ApiQueryService

  ) { }

  ngOnInit(): void {

    if (this.settings.currentLang.value == 'ar') {
      this.isRtl = true
    }
    
    this.form = this.formBuilder.group({ 
      search: [this.apiQuery.search.value],
    });

    const search  =   this.form.get('search').valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((res: any) =>{
      
      if(res === ''){

        if(this.apiQuery.search.value === '') return

        this.apiQuery.search.next('')
        this.apiQuery.apply(true)
        this.apiQuery.isSearch.next(false);
      }

     })

     this.unsubscribe.push(search);

     
    let isReset = this.apiQuery.isReset.subscribe(res =>{
      if(!res) return
      this.reset()
    })

    this.unsubscribe.push(isReset)

  }

  reset(){

    this.form.controls['search'].setValue(null)

  }


  search(value: string = ''){
    if(this.settings.isContentLoading.value) return
    if(value === '' || !value) return;
    
    this.apiQuery.search.next(value)
    this.apiQuery.apply(true)
    this.apiQuery.isSearch.next(true);
    
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
   
  }

}
