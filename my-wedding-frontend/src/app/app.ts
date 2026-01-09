import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/components/navbar/navbar";
import { Dashboard } from "./features/dashboard/dashboard";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-wedding-frontend');
}
