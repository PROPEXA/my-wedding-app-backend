import { Component, signal } from '@angular/core';
import { Button } from "../../components/button/button";
import { Input } from '../../components/input/input';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [Button, Input, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = signal<string>('');
  password = signal<string>('');

  onSubmitLogin(){

  }
}
