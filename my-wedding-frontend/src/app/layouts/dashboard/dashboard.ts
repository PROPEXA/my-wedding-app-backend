import { Component } from '@angular/core';
import { Header, NavItem } from '../../components/header/header';

@Component({
  selector: 'app-dashboard',
  imports: [Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  onLogout() {}

  onNavigate(navItem: NavItem) {
    
  }
}
