import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * Tamaños disponibles para el contenedor de formulario
 */
export type FormContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';

@Component({
  selector: 'app-form-container',
  imports: [NgClass],
  templateUrl: './form-container.html',
  styleUrl: './form-container.css',
})
export class FormContainer {
  /**
   * Tamaño máximo del contenedor
   * - sm: 384px (max-w-sm)
   * - md: 448px (max-w-md)
   * - lg: 512px (max-w-lg) - default
   * - xl: 576px (max-w-xl)
   * - 2xl: 672px (max-w-2xl)
   * - 3xl: 768px (max-w-3xl)
   * - 4xl: 896px (max-w-4xl)
   * - full: 100% (sin límite)
   */
  size = input<FormContainerSize>('lg');

  /**
   * Clase CSS calculada según el tamaño
   */
  sizeClass = computed(() => {
    const sizeMap: Record<FormContainerSize, string> = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      'full': 'max-w-full',
    };
    return sizeMap[this.size()];
  });
}
