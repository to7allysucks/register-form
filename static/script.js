class FormsValidation {
    selectors = {
      form: '[data-js-form]',
      fieldErrors: '[data-js-form-field-errors]',
      checkPassword: '[data-js-form-check-password]',
      password: '[data-js-form-password]',
    }

    errorMessages = {
      valueMissing: () => 'Пожалуйста, заполните это поле',
      patternMismatch: () => 'Данные не соответствуют формату',
      tooShort: ({ minLength }) => `Слишком короткое значение. Минимальное значение символов - ${minLength}.`,
      tooLong: ({ maxLength }) => `Слишком длинное значение. Максимальное значение символов - ${maxLength}.`,
    }

    constructor() {
      this.bindEvents()
    }


    manageErrors(fieldControlElement, errorMessages) {
      const fieldErrorsElement = fieldControlElement.parentElement.querySelector(this.selectors.fieldErrors)
      fieldErrorsElement
        .innerHTML = errorMessages
        .map((message) => `<span class="field__error">${message}</span>`).join('')
    }


    validateField(fieldControlElement) {
      const errors = fieldControlElement.validity
      const errorMessages = []

      Object.entries(this.errorMessages).forEach(([errorType, getErrorMessage]) => {
        if (errors[errorType]) {
          errorMessages.push(getErrorMessage(fieldControlElement))
        }
      })

      this.manageErrors(fieldControlElement, errorMessages)

      const isValid = errorMessages.length === 0

      fieldControlElement.ariaInvalid = !isValid

      return isValid
    }

    onBlur(event) {
      const { target } = event

      const isFormField = target.closest(this.selectors.form)
      const isRequired = target.required

      if (isFormField && isRequired) {
        this.validateField(target)
      }
    }

    onChange(event) {
      const { target } = event
      const isRequired = target.required
      const isToggleType = ['radio', 'checkbox'].includes(target.type)

      if ( isRequired && isToggleType ) {
        this.validateField(target)
      }
    }

    onSubmit(event) {

      const isFormElement = event.target.matches(this.selectors.form)

      if (!isFormElement) {
        return
      }

      const requiredControlElements = [... event.target.elements]
        .filter(({ required }) => required === true)

      let isFormValid = true

      let firstInvalidFieldContol = null

      requiredControlElements.forEach((element) => {
        let isFiledValid = this.validateField(element)

        this.validateField(element)

        if (!isFiledValid) {
          isFormValid = false

          if (!firstInvalidFieldContol) {
            firstInvalidFieldContol = element
          }
        }

        if (!isFormValid) {
          event.preventDefault()
          firstInvalidFieldContol.focus()
        }
      })
    }

    onWatchPassword(event) {
      const isCheckWatch = event.target.matches('[data-js-form-check-password]')
      const checkElement = document.querySelector('[data-js-form-check-password]')
      const passwordElement = document.querySelector('[data-js-form-password]')
      if (isCheckWatch) {
        if (checkElement.checked) {
          passwordElement.setAttribute('type', 'text')
        } else {
          passwordElement.setAttribute('type', 'password')
        }
      }
    }


    bindEvents() {
      document.addEventListener('blur', (event) => {
        this.onBlur(event)
      }, {capture: true})

      document.addEventListener('change', (event) => {
        this.onChange(event)
      })

      document.addEventListener('submit', (event) => {
        this.onSubmit(event)
      })

      document.addEventListener('click', (event) => {
        this.onWatchPassword(event)
      })
    }
}


new FormsValidation()