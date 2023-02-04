import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DrawerComponent } from '../../../kt/components';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  constructor(private router: Router, public auth: AuthService) {}

  ngOnInit(): void {
    this.routingChanges();
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // DrawerComponent.hideAll();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  isAds(){
    if(this.auth.currentUserSubject.value.account_type === 'super_admin') return false
    if(this.auth.currentUserSubject.value.account_type === 'mega_admin') return false
    if(this.auth?.currentUserSubject.value?.school?.ads_status !== 'active') return false

    return true
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
