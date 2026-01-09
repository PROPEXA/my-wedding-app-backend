import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  showPassword = false;
  showConfirmPassword = false;
  acceptTerms = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get passwordsMatch(): boolean {
    return this.registerForm.password === this.registerForm.confirmPassword;
  }

  get passwordStrength(): string {
    const password = this.registerForm.password;
    if (!password) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  }

  onSubmit() {
    if (!this.passwordsMatch) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (!this.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }
    console.log('Register attempt:', this.registerForm);
    // Aquí iría la lógica de registro
  }
}
