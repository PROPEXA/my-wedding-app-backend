import { Component, input, output, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Interfaz para las opciones del dropdown */
export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: '.appDropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Dropdown),
      multi: true,
    },
  ],
})
export class Dropdown implements ControlValueAccessor {
  /** Opciones del dropdown */
  options = input<DropdownOption[]>([]);

  /** Placeholder cuando no hay selección */
  placeholder = input<string>('Selecciona una opción');

  /** Label del dropdown */
  label = input<string>('');

  /** Indica si el campo es requerido (muestra asterisco) */
  required = input<boolean>(false);

  /** Mensaje de error a mostrar */
  errorMessage = input<string>('');

  /** ID del dropdown para accesibilidad */
  dropdownId = input<string>('');

  /** Emite el valor seleccionado cada vez que cambia */
  selectionChange = output<string | number>();

  /** Emite cuando el dropdown pierde el foco (blur) */
  blurred = output<string | number>();

  /** Valor interno del dropdown */
  protected value = signal<string | number>('');

  /** Estado de deshabilitado */
  protected isDisabled = signal<boolean>(false);

  /** Estado de touched (para mostrar errores) */
  protected isTouched = signal<boolean>(false);

  /** Callbacks para ControlValueAccessor */
  private onChange: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  /**
   * Escribe el valor desde el form control al dropdown
   */
  writeValue(value: string | number): void {
    this.value.set(value ?? '');
  }

  /**
   * Registra la función de cambio del form control
   */
  registerOnChange(fn: (value: string | number) => void): void {
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
   * Captura y emite el valor seleccionado
   */
  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newValue = selectElement.value;

    this.value.set(newValue);
    this.onChange(newValue);
    this.selectionChange.emit(newValue);
  }

  /**
   * Emite cuando el dropdown pierde el foco
   */
  onBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
    this.blurred.emit(this.value());
  }
}
