const form = document.getElementById('trialForm');
const fullNameInput = document.getElementById('fullName');
const passwordInput = document.getElementById('password');
const emailInput = document.getElementById('email');
const phoneNumberInput = document.getElementById('phoneNumber');
const beltRankInput = document.getElementById('beltRank');
const sessionInput = document.getElementById('session');

const fullNameError = document.getElementById('fullNameError');
const passwordError = document.getElementById('passwordError');
const emailError = document.getElementById('emailError');
const phoneNumberError = document.getElementById('phoneNumberError');
const beltRankError = document.getElementById('beltRankError');
const sessionError = document.getElementById('sessionError');

const errorSummaryBox = document.getElementById('errorSummaryBox');
const successCard = document.getElementById('successCard');
const resName = document.getElementById('resName');
const resEmail = document.getElementById('resEmail');
const resetFormBtn = document.getElementById('resetFormBtn');

form.noValidate = true;

function validateField(inputElement, errorElement) {
  let isValid = true;
  let message = "";

  if (!inputElement.checkValidity()) {
    isValid = false;
    message = inputElement.validationMessage || "Invalid field value.";
  }

  if (!isValid) {
    inputElement.classList.add('is-invalid');
    inputElement.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
  } else {
    inputElement.classList.remove('is-invalid');
    inputElement.setAttribute('aria-invalid', 'false');
  }

  return isValid;
}

const inputs = [fullNameInput, passwordInput, emailInput, phoneNumberInput, beltRankInput, sessionInput];

inputs.forEach(input => {
  input.addEventListener('blur', () => {
    validateField(input, getErrorElement(input));
  });

  input.addEventListener('input', () => {
    validateField(input, getErrorElement(input));
  });
});

function getErrorElement(input) {
  if (input === fullNameInput) return fullNameError;
  if (input === passwordInput) return passwordError;
  if (input === emailInput) return emailError;
  if (input === phoneNumberInput) return phoneNumberError;
  if (input === beltRankInput) return beltRankError;
  if (input === sessionInput) return sessionError;
  return fullNameError;
}

form.addEventListener('submit', function(event) {
  event.preventDefault();

  let formIsValid = true;
  let firstInvalid = null;

  inputs.forEach(input => {
    const valid = validateField(input, getErrorElement(input));
    if (!valid) {
      formIsValid = false;
      if (!firstInvalid) firstInvalid = input;
    }
  });

  if (!formIsValid) {
    errorSummaryBox.classList.remove('d-none');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  errorSummaryBox.classList.add('d-none');

  resName.textContent = fullNameInput.value;
  resEmail.textContent = emailInput.value;

  form.classList.add('d-none');
  successCard.classList.remove('d-none');
});

resetFormBtn.addEventListener('click', function() {
  form.reset();
  form.classList.remove('d-none');
  successCard.classList.add('d-none');
  inputs.forEach(input => {
    input.classList.remove('is-invalid');
  });
});