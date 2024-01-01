import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.scss']
})
export class DashboardScreenComponent {
  current_route: string = '/config';
  current_screen: string = 'config';
  constructor(private router: Router)
  {

  }


  changeTab(event: number) {
    switch(event) {
      case 0:
        this.current_screen = 'config';
        break;
      case 1:
        this.current_screen = 'product';
        break;
      case 2:
        this.current_screen = 'category';
        break;
      case 3:
        this.current_screen = 'color';
        break;
      case 4:
        this.current_screen = 'size';
        break;
      default:
        this.current_screen = 'config';
        break;
    }
  }
}
