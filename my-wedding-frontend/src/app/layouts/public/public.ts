import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../features/footer/footer';

@Component({
  selector: 'app-public',
  imports: [RouterOutlet, Footer],
  templateUrl: './public.html',
})
export class Public {}
