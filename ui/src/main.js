import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
// Simple Login / Register UI injected into #app
document.querySelector('#app').innerHTML = `
  <div class="auth-root">
    <div class="auth-card">
      <h1 class="auth-title">Welcome</h1>
      <div class="auth-toggle">
        <button id="show-login" class="toggle active">Login</button>
        <button id="show-register" class="toggle">Register</button>
      </div>

      <form id="login-form" class="auth-form">
        <label>Email<input type="email" id="login-email" required placeholder="you@example.com"/></label>
        <label>Password<input type="password" id="login-password" required placeholder="••••••••"/></label>
        <div class="actions">
          <button type="submit" class="primary">Sign in</button>
        </div>
        <div id="login-message" class="message" aria-live="polite"></div>
      </form>

      <form id="register-form" class="auth-form hidden">
        <label>Name<input type="text" id="register-name" required placeholder="Full name"/></label>
        <label>Email<input type="email" id="register-email" required placeholder="you@example.com"/></label>
        <label>Password<input type="password" id="register-password" required placeholder="At least 6 characters"/></label>
        <div class="actions">
          <button type="submit" class="primary">Create account</button>
        </div>
        <div id="register-message" class="message" aria-live="polite"></div>
      </form>
    </div>
  </div>
`

// Toggle logic
const loginForm = document.getElementById('login-form')
const registerForm = document.getElementById('register-form')
const btnLogin = document.getElementById('show-login')
const btnRegister = document.getElementById('show-register')

function showLogin() {
  btnLogin.classList.add('active')
  btnRegister.classList.remove('active')
  loginForm.classList.remove('hidden')
  registerForm.classList.add('hidden')
}

function showRegister() {
  btnRegister.classList.add('active')
  btnLogin.classList.remove('active')
  registerForm.classList.remove('hidden')
  loginForm.classList.add('hidden')
}

btnLogin.addEventListener('click', showLogin)
btnRegister.addEventListener('click', showRegister)

// Simple client-side handlers (no backend). Replace with real API calls as needed.
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value
  const msg = document.getElementById('login-message')
  msg.textContent = ''

  if (!email || !password) {
    msg.textContent = 'Please fill both fields.'
    msg.classList.add('error')
    return
  }

  // Demo validation: success for any non-empty credentials
  msg.textContent = `Signed in as ${email}`
  msg.classList.remove('error')
  msg.classList.add('success')
})

registerForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = document.getElementById('register-name').value.trim()
  const email = document.getElementById('register-email').value.trim()
  const password = document.getElementById('register-password').value
  const msg = document.getElementById('register-message')
  msg.textContent = ''

  if (!name || !email || !password) {
    msg.textContent = 'Please complete all fields.'
    msg.classList.add('error')
    return
  }
  if (password.length < 6) {
    msg.textContent = 'Password must be at least 6 characters.'
    msg.classList.add('error')
    return
  }

  // Demo success
  msg.textContent = `Account created for ${name} (${email})`
  msg.classList.remove('error')
  msg.classList.add('success')
  // Optionally switch to login view after register
  setTimeout(() => {
    showLogin()
  }, 1200)
})

// Keep counter behavior if used elsewhere
try {
  setupCounter(document.querySelector('#counter'))
} catch (err) {
  // ignore if counter not present in this UI
}
