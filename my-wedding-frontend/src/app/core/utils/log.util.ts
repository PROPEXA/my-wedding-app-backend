export const logger = {
  success: (msg: string) => console.log('%c✔ ' + msg, 'color: #4caf50; font-weight: bold;'),

  error: (msg: string) => console.log('%c✖ ' + msg, 'color: #f44336; font-weight: bold;'),

  warning: (msg: string) => console.log('%c⚠ ' + msg, 'color: #ff9800; font-weight: bold;'),
};
