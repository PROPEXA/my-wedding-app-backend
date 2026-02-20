import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../../shared/components/layout/footer/footer";
import { Header, NavItem } from '../../shared/components/layout/header/header';

@Component({
  selector: 'app-dashboard',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  onLogout() {}

  onNavigate(navItem: NavItem) {

  }
}
