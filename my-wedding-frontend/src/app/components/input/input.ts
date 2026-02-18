import { Component, input, output } from '@angular/core';

@Component({
  selector: '.appInput',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input {
  /** Tipo de input HTML */
  type = input<string>('text');

  /** Placeholder del input */
  placeholder = input<string>('');

  /** Label del input */
  label = input<string>('');

  /** Valor inicial del input */
  value = input<string>('');

  /** Emite el valor del input cada vez que cambia */
  text = output<string>();

  /** Emite cuando el input pierde el foco (blur) */
  blurred = output<string>();

  /** Emite cuando se presiona Enter */
  enterPressed = output<string>();

  /**
   * Captura y emite el valor del input en tiempo real
   */
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.text.emit(inputElement.value);
  }

  /**
   * Emite el valor cuando el input pierde el foco
   */
  onBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.blurred.emit(inputElement.value);
  }

  /**
   * Emite el valor cuando se presiona Enter
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const inputElement = event.target as HTMLInputElement;
      this.enterPressed.emit(inputElement.value);
    }
  }
}
