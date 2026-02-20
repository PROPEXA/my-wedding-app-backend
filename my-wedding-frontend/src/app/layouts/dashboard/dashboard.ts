import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header, NavItem } from '../../features/header/header';
import { Footer } from "../../features/footer/footer";

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
