/**
 * Main module for Blueprint Studio
 */
import { init } from './app.js?v=2.1.57';

// Start the application
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
