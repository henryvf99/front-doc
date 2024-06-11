import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { DataService } from '../../shared/data/data.service';
import { SideBarData, MenuItem } from '../../shared/models/models';
import { routes } from '../../shared/routes/routes';
import { SideBarService } from '../../shared/side-bar/side-bar.service';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  base = '';
  page = '';
  currentUrl = '';
  public classAdd = false;

  public multilevel: Array<boolean> = [false, false, false];

  public routes = routes;
  public sidebarData: Array<SideBarData> = [];
  public user:any;


  constructor(
    private data: DataService,
    private router: Router,
    private sideBar: SideBarService,
    public authService: AuthService,
  ) {
    // this.user = this.authService.user;
    const USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    // INICIO
      this.sidebarData = this.data.sideBar;
    
    // FIN
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        this.getRoutes(event);
      }
    });
    this.getRoutes(this.router);
  }
  
  logout(){
    this.authService.logout();
  }

  public expandSubMenus(menu: MenuItem): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.sidebarData.map((mainMenus: SideBarData) => {
      mainMenus.menu.map((resMenu: MenuItem) => {
        if (resMenu.menuValue == menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }
  private getRoutes(route: { url: string }): void {
    const bodyTag = document.body;

    bodyTag.classList.remove('slide-nav')
    bodyTag.classList.remove('opened')
    this.currentUrl = route.url;

    const splitVal = route.url.split('/');


    this.base = splitVal[1];
    this.page = splitVal[2];
  }
  public miniSideBarMouseHover(position: string): void {
    if (position == 'over') {
      this.sideBar.expandSideBar.next("true");
    } else {
      this.sideBar.expandSideBar.next("false");
    }
  }

}
