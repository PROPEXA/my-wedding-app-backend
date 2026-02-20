import { API } from '../env/env.dev';

/**
 * logger is a utility object that provides methods for logging messages to the console with different styles based on the
 * type of message (success, error, warning).
 * Each method checks if logging is enabled in the API configuration before outputting the message.
 * - success: Logs a message with a green checkmark and bold font.
 * - error: Logs a message with a red cross and bold font.
 * - warning: Logs a message with an orange warning sign and bold font.
 * - info: Logs a message with a blue information sign and bold font.
 * - debug: Logs a message with a purple debug sign and bold font.
 * Each method takes a string message as an argument and formats it accordingly before logging it to the console.
 */
export const logger = {
  success: (msg: string) => {
    if (API.showLog) {
      console.log('%c[SUCCESS] ' + msg, 'color: #4caf50; font-weight: bold;');
    }
  },

  error: (msg: string) => {
    if (API.showLog) {
      console.log('%c[ERROR] ' + msg, 'color: #f44336; font-weight: bold;');
    }
  },

  warning: (msg: string) => {
    if (API.showLog) {
      console.log('%c[WARN] ' + msg, 'color: #ff9800; font-weight: bold;');
    }
  },

  info: (msg: string) => {
    if (API.showLog) {
      console.log('%c[INFO] ' + msg, 'color: #2196f3; font-weight: bold;');
    }
  },

  debug: (msg: string) => {
    if (API.showLog) {
      console.log('%c[DEBUG] ' + msg, 'color: #9c27b0; font-weight: bold;');
    }
  },
};
