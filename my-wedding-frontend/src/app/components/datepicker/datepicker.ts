import { Component, input, output, forwardRef, signal, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: '.appDatepicker',
  imports: [],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Datepicker),
      multi: true,
    },
  ],
})
export class Datepicker implements ControlValueAccessor {
  /** Placeholder del input */
  placeholder = input<string>('Selecciona una fecha');

  /** Label del datepicker */
  label = input<string>('');

  /** Indica si el campo es requerido (muestra asterisco) */
  required = input<boolean>(false);

  /** Mensaje de error a mostrar */
  errorMessage = input<string>('');

  /** ID del datepicker para accesibilidad */
  datepickerId = input<string>('');

  /** Fecha mínima permitida (formato YYYY-MM-DD) */
  minDate = input<string>('');

  /** Fecha máxima permitida (formato YYYY-MM-DD) */
  maxDate = input<string>('');

  /** Emite el valor seleccionado cada vez que cambia */
  dateChange = output<string>();

  /** Emite cuando el datepicker pierde el foco (blur) */
  blurred = output<string>();

  /** Valor interno del datepicker (formato YYYY-MM-DD) */
  protected value = signal<string>('');

  /** Estado de deshabilitado */
  protected isDisabled = signal<boolean>(false);

  /** Estado de touched (para mostrar errores) */
  protected isTouched = signal<boolean>(false);

  /** Estado de calendario abierto */
  protected isCalendarOpen = signal<boolean>(false);

  /** Mes y año actual para navegación */
  protected currentMonth = signal<Date>(new Date());

  /** Callbacks para ControlValueAccessor */
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  /** Días de la semana */
  protected weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  /** Nombre del mes actual */
  protected currentMonthName = computed(() => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[this.currentMonth().getMonth()];
  });

  /** Año actual */
  protected currentYear = computed(() => this.currentMonth().getFullYear());

  /** Días del mes actual para el calendario */
  protected calendarDays = computed(() => {
    const year = this.currentMonth().getFullYear();
    const month = this.currentMonth().getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: { day: number; date: string; isCurrentMonth: boolean; isToday: boolean; isSelected: boolean; isDisabled: boolean }[] = [];

    // Días del mes anterior para completar la primera semana
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1; // Ajustar para empezar en lunes

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = this.formatDate(year, month - 1, day);
      days.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: this.value() === date,
        isDisabled: this.isDateDisabled(date),
      });
    }

    // Días del mes actual
    const today = new Date();
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = this.formatDate(year, month, day);
      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      days.push({
        day,
        date,
        isCurrentMonth: true,
        isToday,
        isSelected: this.value() === date,
        isDisabled: this.isDateDisabled(date),
      });
    }

    // Días del mes siguiente para completar la última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let day = 1; day <= remainingDays; day++) {
      const date = this.formatDate(year, month + 1, day);
      days.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: this.value() === date,
        isDisabled: this.isDateDisabled(date),
      });
    }

    return days;
  });

  /** Valor formateado para mostrar */
  protected displayValue = computed(() => {
    if (!this.value()) return '';
    const [year, month, day] = this.value().split('-');
    return `${day}/${month}/${year}`;
  });

  /**
   * Escribe el valor desde el form control
   */
  writeValue(value: string): void {
    this.value.set(value ?? '');
    if (value) {
      const date = new Date(value);
      this.currentMonth.set(new Date(date.getFullYear(), date.getMonth(), 1));
    }
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
   * Abre/cierra el calendario
   */
  toggleCalendar(): void {
    if (this.isDisabled()) return;
    this.isCalendarOpen.update(v => !v);
  }

  /**
   * Cierra el calendario
   */
  closeCalendar(): void {
    this.isCalendarOpen.set(false);
    this.isTouched.set(true);
    this.onTouched();
    this.blurred.emit(this.value());
  }

  /**
   * Selecciona una fecha
   */
  selectDate(date: string): void {
    if (this.isDateDisabled(date)) return;

    this.value.set(date);
    this.onChange(date);
    this.dateChange.emit(date);
    this.closeCalendar();
  }

  /**
   * Navega al mes anterior
   */
  previousMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  /**
   * Navega al mes siguiente
   */
  nextMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  /**
   * Formatea una fecha a YYYY-MM-DD
   */
  private formatDate(year: number, month: number, day: number): string {
    const date = new Date(year, month, day);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Verifica si una fecha está deshabilitada
   */
  private isDateDisabled(date: string): boolean {
    if (this.minDate() && date < this.minDate()) return true;
    if (this.maxDate() && date > this.maxDate()) return true;
    return false;
  }

  /**
   * Retorna la fecha de hoy en formato YYYY-MM-DD
   */
  formatTodayDate(): string {
    const today = new Date();
    return this.formatDate(today.getFullYear(), today.getMonth(), today.getDate());
  }

  /**
   * Maneja clics fuera del componente
   */
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.datepicker-container')) {
      this.closeCalendar();
    }
  }
}
