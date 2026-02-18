import { Component, computed, input, output } from '@angular/core';

export type ButtonTheme =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  text = input<string>('');
  type = input<string>('submit');
  theme = input<ButtonTheme>('primary');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(true);

  onClick = input<((event: MouseEvent) => void) | null>(null);
  onClickHandlers = input<ReadonlyArray<(event: MouseEvent) => void>>([]);
  clicked = output<MouseEvent>();

  private readonly themeClasses: Record<ButtonTheme, string> = {
    primary:
      'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600',
    secondary:
      'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600',
    success:
      'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600',
    danger:
      'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600',
    warning:
      'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600',
    info: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600',
    dark: 'bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black',
    light:
      'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300',
    'outline-primary':
      'bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white',
    'outline-secondary':
      'bg-transparent border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white',
    'outline-danger':
      'bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
  };

  private readonly sizeClasses: Record<ButtonSize, string> = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-6 text-lg',
  };

  buttonClasses = computed(() => {
    const base = 'font-bold rounded-lg transition transform hover:scale-105 duration-200';
    const themeClass = this.themeClasses[this.theme()];
    const sizeClass = this.sizeClasses[this.size()];
    const widthClass = this.fullWidth() ? 'w-full' : '';
    const disabledClass = this.disabled()
      ? 'opacity-50 cursor-not-allowed hover:scale-100'
      : '';

    return `${base} ${themeClass} ${sizeClass} ${widthClass} ${disabledClass}`.trim();
  });

  handleClick(event: MouseEvent): void {
    if (this.disabled()) return;

    this.clicked.emit(event);

    const handler = this.onClick();
    if (handler) handler(event);

    for (const fn of this.onClickHandlers()) {
      fn(event);
    }
  }
}
