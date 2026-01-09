import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/components/navbar/navbar";
import { Dashboard } from "./features/dashboard/dashboard";
import { Accounts } from "./features/accounts/accounts";
import { Footer } from "./shared/components/footer/footer";
import { Weddings } from "./features/weddings/weddings";
import { Login } from "./features/login/login";
import { Register } from "./features/register/register";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Dashboard, Accounts, Footer, Weddings, Login, Register],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-wedding-frontend');
}
