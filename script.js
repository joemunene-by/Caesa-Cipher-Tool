/* ============================================
   Caesar Cipher Tool — Logic & UI
   Pure vanilla JavaScript, zero dependencies
   ============================================ */

(function () {
  'use strict';

  // --- DOM References ---
  const inputText   = document.getElementById('input-text');
  const outputText  = document.getElementById('output-text');
  const shiftSlider = document.getElementById('shift-slider');
  const shiftDisplay = document.getElementById('shift-display');
  const inputCount  = document.getElementById('input-count');
  const outputCount = document.getElementById('output-count');
  const btnEncrypt  = document.getElementById('btn-encrypt');
  const btnDecrypt  = document.getElementById('btn-decrypt');
  const btnCopy     = document.getElementById('btn-copy');
  const btnClear    = document.getElementById('btn-clear');
  const copyLabel   = document.getElementById('copy-label');

  // --- Caesar Cipher Core ---

  /**
   * Apply Caesar cipher to a string.
   * @param {string} text  — input text
   * @param {number} shift — shift amount (positive = encrypt, negative = decrypt)
   * @returns {string} transformed text
   */
  function caesarCipher(text, shift) {
    // Normalise shift into 0-25 range
    shift = ((shift % 26) + 26) % 26;

    return text.replace(/[a-zA-Z]/g, function (ch) {
      var base = ch >= 'a' ? 97 : 65;
      return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26) + base);
    });
  }

  /**
   * Encrypt the input text with current shift.
   */
  function encrypt() {
    var shift = parseInt(shiftSlider.value, 10);
    var result = caesarCipher(inputText.value, shift);
    setOutput(result);
  }

  /**
   * Decrypt the input text with current shift.
   */
  function decrypt() {
    var shift = parseInt(shiftSlider.value, 10);
    var result = caesarCipher(inputText.value, -shift);
    setOutput(result);
  }

  /**
   * Write result to output textarea with visual feedback.
   */
  function setOutput(text) {
    outputText.value = text;
    updateCount(outputCount, text.length);

    // Flash animation
    outputText.classList.remove('flash');
    // Force reflow so re-adding the class triggers the animation
    void outputText.offsetWidth;
    outputText.classList.add('flash');
  }

  // --- UI Helpers ---

  function updateCount(el, len) {
    el.textContent = len + (len === 1 ? ' character' : ' characters');
  }

  function clearAll() {
    inputText.value = '';
    outputText.value = '';
    updateCount(inputCount, 0);
    updateCount(outputCount, 0);
    inputText.focus();
  }

  function copyToClipboard() {
    var text = outputText.value;
    if (!text) return;

    navigator.clipboard.writeText(text).then(function () {
      btnCopy.classList.add('copied');
      copyLabel.textContent = 'Copied!';
      setTimeout(function () {
        btnCopy.classList.remove('copied');
        copyLabel.textContent = 'Copy';
      }, 1800);
    }).catch(function () {
      // Fallback for older browsers / non-secure contexts
      outputText.select();
      document.execCommand('copy');
      btnCopy.classList.add('copied');
      copyLabel.textContent = 'Copied!';
      setTimeout(function () {
        btnCopy.classList.remove('copied');
        copyLabel.textContent = 'Copy';
      }, 1800);
    });
  }

  // --- Slider ---

  function updateSlider() {
    shiftDisplay.textContent = shiftSlider.value;

    // Fill the track up to the thumb position
    var pct = ((shiftSlider.value - shiftSlider.min) / (shiftSlider.max - shiftSlider.min)) * 100;
    shiftSlider.style.background =
      'linear-gradient(to right, rgba(217,70,239,0.5) ' + pct + '%, rgba(255,255,255,0.08) ' + pct + '%)';
  }

  // --- Event Listeners ---

  shiftSlider.addEventListener('input', updateSlider);

  inputText.addEventListener('input', function () {
    updateCount(inputCount, inputText.value.length);
  });

  btnEncrypt.addEventListener('click', encrypt);
  btnDecrypt.addEventListener('click', decrypt);
  btnCopy.addEventListener('click', copyToClipboard);
  btnClear.addEventListener('click', clearAll);

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + Enter → Encrypt
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      encrypt();
    }

    // Escape → Clear
    if (e.key === 'Escape') {
      e.preventDefault();
      clearAll();
    }
  });

  // --- Init ---
  updateSlider();
  inputText.focus();
})();
