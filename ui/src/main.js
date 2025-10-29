import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
// Simple Login / Register UI injected into #app
import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

// Inject auth UI + dashboard into #app
document.querySelector('#app').innerHTML = `
  <div class="auth-root">
    <div class="auth-card">
      <h1 class="auth-title">Welcome</h1>
      <div class="auth-toggle">
        <button id="show-login" class="toggle">Login</button>
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

  <div class="dashboard-root hidden">
    <div class="dashboard">
      <header class="dashboard-header">
        <h2 id="dash-welcome">Dashboard</h2>
        <div class="dash-actions">
          <button id="btn-logout" class="toggle">Logout</button>
        </div>
      </header>
      <section class="dashboard-widgets">
        <div class="widget">
          <h3>Profile</h3>
          <p id="profile-info">No user</p>
          <div style="margin-top:0.5rem">
            <button id="btn-edit-profile" class="toggle">Edit profile</button>
            <button id="btn-change-password" class="toggle">Change password</button>
          </div>
        </div>
        <div class="widget">
          <h3>Activity</h3>
          <p>Recent activity will appear here.</p>
        </div>
      </section>
    </div>
  </div>
  
  <div class="profile-root hidden">
    <div class="profile-card">
      <header class="profile-header">
        <h2>Profile</h2>
        <div class="dash-actions">
          <button id="btn-back" class="toggle">Back</button>
        </div>
      </header>
      <form id="profile-form" class="auth-form">
        <label>Name<input type="text" id="profile-name" required placeholder="Full name"/></label>
        <label>Email<input type="email" id="profile-email" required placeholder="you@example.com"/></label>
        <div class="actions">
          <button type="submit" class="primary">Save</button>
        </div>
        <div id="profile-message" class="message" aria-live="polite"></div>
      </form>

      <hr />

      <form id="change-password-form" class="auth-form">
        <label>Current password<input type="password" id="current-password" placeholder="Current password"/></label>
        <label>New password<input type="password" id="new-password" placeholder="New password (min 6)"/></label>
        <label>Confirm new password<input type="password" id="confirm-password" placeholder="Confirm new password"/></label>
        <div class="actions">
          <button type="submit" class="primary">Change password</button>
        </div>
        <div id="password-message" class="message" aria-live="polite"></div>
      </form>
    </div>
  </div>
`

// Elements
const loginForm = document.getElementById('login-form')
const registerForm = document.getElementById('register-form')
const btnLogin = document.getElementById('show-login')
const btnRegister = document.getElementById('show-register')
const authRoot = document.querySelector('.auth-root')
const dashboardRoot = document.querySelector('.dashboard-root')
const profileInfo = document.getElementById('profile-info')
const dashWelcome = document.getElementById('dash-welcome')
const btnLogout = document.getElementById('btn-logout')
// profile elements (may be hidden)
const btnBack = document.getElementById('btn-back')
const profileRoot = document.querySelector('.profile-root')
const profileForm = document.getElementById('profile-form')
const profileNameInput = document.getElementById('profile-name')
const profileEmailInput = document.getElementById('profile-email')
const profileMessage = document.getElementById('profile-message')
const changePasswordForm = document.getElementById('change-password-form')
const currentPasswordInput = document.getElementById('current-password')
const newPasswordInput = document.getElementById('new-password')
const confirmPasswordInput = document.getElementById('confirm-password')
const passwordMessage = document.getElementById('password-message')
// buttons inside dashboard profile widget (created in DOM earlier)
// we add them dynamically after DOM is ready
let btnEditProfile
let btnChangePassword

function showLogin() {
  btnLogin.classList.add('active')
  btnRegister.classList.remove('active')
  loginForm.classList.remove('hidden')
  registerForm.classList.add('hidden')
  authRoot.classList.remove('hidden')
  dashboardRoot.classList.add('hidden')
}

function showRegister() {
  btnRegister.classList.add('active')
  btnLogin.classList.remove('active')
  registerForm.classList.remove('hidden')
  loginForm.classList.add('hidden')
  authRoot.classList.remove('hidden')
  dashboardRoot.classList.add('hidden')
}

function showDashboard(user) {
  // user: { name?, email }
  authRoot.classList.add('hidden')
  dashboardRoot.classList.remove('hidden')
  const name = user.name || ''
  dashWelcome.textContent = `Welcome${name ? ', ' + name : ''}`
  profileInfo.textContent = `${user.name ? user.name + ' — ' : ''}${user.email}`
}

function setUser(user) {
  localStorage.setItem('app_user', JSON.stringify(user))
}

function clearUser() {
  localStorage.removeItem('app_user')
}

function getUser() {
  try {
    const raw = localStorage.getItem('app_user')
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    return null
  }
}

btnLogin.addEventListener('click', showLogin)
btnRegister.addEventListener('click', showRegister)

loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value
  const msg = document.getElementById('login-message')
  msg.textContent = ''
  msg.classList.remove('error', 'success')

  if (!email || !password) {
    msg.textContent = 'Please fill both fields.'
    msg.classList.add('error')
    return
  }
  // Check stored user (if any) to validate password for demo
  const stored = getUser()
  if (stored && stored.password) {
    if (stored.email !== email || stored.password !== password) {
      msg.textContent = 'Invalid email or password.'
      msg.classList.add('error')
      return
    }
    // success
    msg.textContent = `Signed in as ${email}`
    msg.classList.add('success')
    setTimeout(() => showDashboard(stored), 600)
    return
  }

  // No stored password (legacy/demo): accept and set a minimal user
  const user = { email }
  setUser(user)
  msg.textContent = `Signed in as ${email}`
  msg.classList.add('success')
  setTimeout(() => showDashboard(user), 600)
})

registerForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = document.getElementById('register-name').value.trim()
  const email = document.getElementById('register-email').value.trim()
  const password = document.getElementById('register-password').value
  const msg = document.getElementById('register-message')
  msg.textContent = ''
  msg.classList.remove('error', 'success')

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

  const user = { name, email, password }
  setUser(user)
  msg.textContent = `Account created for ${name}`
  msg.classList.add('success')
  setTimeout(() => showDashboard(user), 800)
})

btnLogout.addEventListener('click', () => {
  clearUser()
  // clear form inputs for safety
  loginForm.reset()
  registerForm.reset()
  showLogin()
})

// Wire profile/widget buttons (elements exist in DOM)
btnEditProfile = document.getElementById('btn-edit-profile')
btnChangePassword = document.getElementById('btn-change-password')

btnEditProfile.addEventListener('click', () => {
  const user = getUser() || {}
  profileNameInput.value = user.name || ''
  profileEmailInput.value = user.email || ''
  profileMessage.textContent = ''
  passwordMessage.textContent = ''
  authRoot.classList.add('hidden')
  dashboardRoot.classList.add('hidden')
  profileRoot.classList.remove('hidden')
})

btnChangePassword.addEventListener('click', () => {
  const user = getUser() || {}
  profileNameInput.value = user.name || ''
  profileEmailInput.value = user.email || ''
  profileMessage.textContent = ''
  passwordMessage.textContent = ''
  authRoot.classList.add('hidden')
  dashboardRoot.classList.add('hidden')
  profileRoot.classList.remove('hidden')
})

btnBack.addEventListener('click', () => {
  profileRoot.classList.add('hidden')
  showDashboard(getUser() || {})
})

profileForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = profileNameInput.value.trim()
  const email = profileEmailInput.value.trim()
  profileMessage.textContent = ''
  profileMessage.classList.remove('error', 'success')
  if (!name || !email) {
    profileMessage.textContent = 'Name and email are required.'
    profileMessage.classList.add('error')
    return
  }
  const user = getUser() || {}
  user.name = name
  user.email = email
  setUser(user)
  profileMessage.textContent = 'Profile saved.'
  profileMessage.classList.add('success')
  // update dashboard display
  profileInfo.textContent = `${user.name ? user.name + ' — ' : ''}${user.email}`
  dashWelcome.textContent = `Welcome${user.name ? ', ' + user.name : ''}`
})

changePasswordForm.addEventListener('submit', (e) => {
  e.preventDefault()
  passwordMessage.textContent = ''
  passwordMessage.classList.remove('error', 'success')
  const current = currentPasswordInput.value || ''
  const next = newPasswordInput.value || ''
  const confirm = confirmPasswordInput.value || ''
  const user = getUser() || {}

  if (!next || next.length < 6) {
    passwordMessage.textContent = 'New password must be at least 6 characters.'
    passwordMessage.classList.add('error')
    return
  }
  if (next !== confirm) {
    passwordMessage.textContent = 'New password and confirmation do not match.'
    passwordMessage.classList.add('error')
    return
  }

  // If a password is already stored, require current to match
  if (user.password) {
    if (user.password !== current) {
      passwordMessage.textContent = 'Current password is incorrect.'
      passwordMessage.classList.add('error')
      return
    }
  }

  user.password = next
  setUser(user)
  passwordMessage.textContent = 'Password updated.'
  passwordMessage.classList.add('success')
  // clear inputs
  currentPasswordInput.value = ''
  newPasswordInput.value = ''
  confirmPasswordInput.value = ''
})

// On load: if user exists, go straight to dashboard
const existing = getUser()
if (existing) {
  showDashboard(existing)
} else {
  // default to login view
  showLogin()
}

// Keep counter behavior if used elsewhere
try {
  setupCounter(document.querySelector('#counter'))
} catch (err) {
  // ignore if counter not present in this UI
}
