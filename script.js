const formElement = document.querySelector('form')
const loginElement = formElement.elements['login'];
const passwordElement = formElement.elements['password'];

const errorElement = document.createElement('div');
const seePassElement = formElement.elements['check-password'];
errorElement.className = 'error-text';
errorElement.textContent = 'Пример: user@example.com'


formElement.addEventListener('submit', (event) => {
  event.preventDefault();
})

formElement.addEventListener('change',(event) => {
  if (event.target === loginElement) {
    const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!regExp.test(event.target.value)) {
      loginElement.classList.add('error')
      loginElement.after(errorElement)
    } else {
      loginElement.classList.remove('error')
      errorElement.remove()
      loginElement.classList.add('success')
    }
  }

  if (event.target === passwordElement) {
    let len = event.target.value.length;
    console.log(passwordElement.value.length);
    if (! (8 <= len <= 20)) {
      passwordElement.classList.add('error')
      errorElement.textContent = 'Пароль от 8 до 20 символов';
      passwordElement.after(errorElement)
    } else {
      passwordElement.classList.remove('error')
      errorElement.remove()
      passwordElement.classList.add('success')
    }
  }
})


formElement.addEventListener('click', (event) => {
  console.log(event.target)
  if ( event.target === seePassElement ) {
    if ( seePassElement.checked) {
      passwordElement.type = 'text';
    } else {
      passwordElement.setAttribute('type', 'password');
    }
  }
})