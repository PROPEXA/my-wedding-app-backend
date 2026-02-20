import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../../shared/components/layout/footer/footer";
import { Header, NavItem } from '../../shared/components/layout/header/header';

@Component({
  selector: 'app-web-container',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './web-container.html',
})
export class WebContainer {
  onLogout() {}

  onNavigate(navItem: NavItem) {

  }
}
