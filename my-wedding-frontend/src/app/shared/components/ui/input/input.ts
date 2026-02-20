import { Component, input, output, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: '.appInput',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  /** Tipo de input HTML */
  type = input<string>('text');

  /** Placeholder del input */
  placeholder = input<string>('');

  /** Label del input */
  label = input<string>('');

  /** Indica si el campo es requerido (muestra asterisco) */
  required = input<boolean>(false);

  /** Mensaje de error a mostrar */
  errorMessage = input<string>('');

  /** ID del input para accesibilidad */
  inputId = input<string>('');

  /** Emite el valor del input cada vez que cambia */
  text = output<string>();

  /** Emite cuando el input pierde el foco (blur) */
  blurred = output<string>();

  /** Emite cuando se presiona Enter */
  enterPressed = output<string>();

  /** Valor interno del input */
  protected value = signal<string>('');

  /** Estado de deshabilitado */
  protected isDisabled = signal<boolean>(false);

  /** Estado de touched (para mostrar errores) */
  protected isTouched = signal<boolean>(false);

  /** Callbacks para ControlValueAccessor */
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  /**
   * Escribe el valor desde el form control al input
   */
  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  /**
   * Registra la función de cambio del form control
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /**
   * Registra la función de touched del form control
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Maneja el estado disabled desde el form control
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  /**
   * Captura y emite el valor del input en tiempo real
   */
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;
    
    this.value.set(newValue);
    this.onChange(newValue);
    this.text.emit(newValue);
  }

  /**
   * Emite el valor cuando el input pierde el foco
   */
  onBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.isTouched.set(true);
    this.onTouched();
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
