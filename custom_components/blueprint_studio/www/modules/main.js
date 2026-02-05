/**
 * Main module for Blueprint Studio
 */
import { init } from './app.js';

// Start the application
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}