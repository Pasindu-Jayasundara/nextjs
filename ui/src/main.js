import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
// API base (backend Express server)
const API = 'http://localhost:3000'
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
          <button id="btn-products" class="toggle">Products</button>
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
  
  <div class="products-root hidden">
    <div class="products-card">
      <header class="products-header">
        <h2>Products</h2>
        <div class="dash-actions">
          <button id="btn-products-back" class="toggle">Back</button>
        </div>
      </header>
      <section id="products-grid" class="products-grid">
        <!-- product cards will be rendered here -->
      </section>
      <div id="product-detail" class="product-detail hidden">
        <div class="product-detail-actions">
          <button id="product-detail-close" class="toggle">Close</button>
          <button id="product-detail-buy" class="primary">Buy</button>
        </div>
        <div id="product-detail-content"></div>
      </div>
    </div>
  </div>

  <!-- Checkout / Payment modal (demo, client-side) -->
  <div id="checkout-root" class="checkout-root hidden">
    <div class="checkout-card">
      <header class="profile-header">
        <h2>Checkout</h2>
        <div class="dash-actions">
          <button id="checkout-close" class="toggle">Close</button>
        </div>
      </header>

      <section>
        <h4>Payment methods</h4>
        <div id="payment-methods-list" class="payment-methods-list"></div>
        <hr />
        <h4>Add a payment method</h4>
        <form id="add-payment-form" class="auth-form">
          <label>Cardholder name<input id="card-name" required placeholder="Full name"/></label>
          <label>Card number<input id="card-number" required placeholder="4242 4242 4242 4242"/></label>
          <label>Expiry<input id="card-expiry" required placeholder="MM/YY"/></label>
          <label>CVV<input id="card-cvv" required placeholder="123"/></label>
          <div class="actions">
            <button type="submit" class="primary">Add card</button>
          </div>
        </form>
        <div id="payment-message" class="message" aria-live="polite"></div>
        <div style="margin-top:0.75rem; display:flex; justify-content:flex-end; gap:0.5rem">
          <button id="process-payment-btn" class="primary">Pay</button>
        </div>
      </section>
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
// products elements
let btnProducts = document.getElementById('btn-products')
let productsRoot = document.querySelector('.products-root')
let productsGrid = document.getElementById('products-grid')
let btnProductsBack = document.getElementById('btn-products-back')
let productDetail = document.getElementById('product-detail')
let productDetailClose = document.getElementById('product-detail-close')
let productDetailContent = document.getElementById('product-detail-content')

// Sample products
const sampleProducts = [
  { id: 'p1', title: 'Aurora Headphones', price: 129, desc: 'Wireless over-ear headphones with active noise cancellation.', img: 'https://via.placeholder.com/320x180?text=Aurora' },
  { id: 'p2', title: 'Nimbus Smartwatch', price: 199, desc: 'Lightweight smartwatch with health tracking and GPS.', img: 'https://via.placeholder.com/320x180?text=Nimbus' },
  { id: 'p3', title: 'Lumen Desk Lamp', price: 59, desc: 'Adjustable LED lamp with touch controls and warm/cool modes.', img: 'https://via.placeholder.com/320x180?text=Lumen' },
  { id: 'p4', title: 'Quanta Speaker', price: 89, desc: 'Portable Bluetooth speaker with rich bass and 12h battery.', img: 'https://via.placeholder.com/320x180?text=Quanta' }
]

// current products data (will be fetched from server)
let productsData = sampleProducts.slice()

function renderProducts(list) {
  if (!productsGrid) return
  productsGrid.innerHTML = ''
  list.forEach(p => {
    const card = document.createElement('article')
    card.className = 'product-card'
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <p class="price">$${p.price}</p>
      <p class="short">${p.desc}</p>
      <div class="card-actions"><button data-id="${p.id}" class="toggle">View</button></div>
    `
    productsGrid.appendChild(card)
  })

  // attach listeners
  productsGrid.querySelectorAll('button[data-id]').forEach(b => {
    b.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id')
      const prod = (productsData || []).find(x => x.id === id)
      if (prod) showProductDetail(prod)
    })
  })
}

function showProducts() {
  authRoot.classList.add('hidden')
  dashboardRoot.classList.add('hidden')
  profileRoot.classList.add('hidden')
  productsRoot.classList.remove('hidden')
  // fetch products from backend, fallback to sample
  fetch(`${API}/api/products`).then(r => r.json()).then(list => {
    productsData = Array.isArray(list) ? list : sampleProducts
    renderProducts(productsData)
  }).catch(() => {
    productsData = sampleProducts
    renderProducts(productsData)
  })
}

function showProductDetail(prod) {
  if (!productDetail || !productDetailContent) return
  productDetailContent.innerHTML = `
    <h3>${prod.title}</h3>
    <img src="${prod.img}" alt="${prod.title}" />
    <p class="price">$${prod.price}</p>
    <p>${prod.desc}</p>
  `
  // wire Buy button to open checkout for this product
  const buyBtn = document.getElementById('product-detail-buy')
  if (buyBtn) {
    buyBtn.onclick = () => openCheckoutFor(prod)
  }
  productDetail.classList.remove('hidden')
}

function hideProductDetail() {
  if (!productDetail) return
  productDetail.classList.add('hidden')
}

// --- Payment / Checkout (client-side demo) ---
let checkoutRoot = document.getElementById('checkout-root')
let checkoutClose = document.getElementById('checkout-close')
let paymentMethodsList = document.getElementById('payment-methods-list')
let addPaymentForm = document.getElementById('add-payment-form')
let cardNameInput = document.getElementById('card-name')
let cardNumberInput = document.getElementById('card-number')
let cardExpiryInput = document.getElementById('card-expiry')
let cardCvvInput = document.getElementById('card-cvv')
let paymentMessage = document.getElementById('payment-message')
let processPaymentBtn = document.getElementById('process-payment-btn')

const PAYMENT_KEY = 'payment_methods'
const TX_KEY = 'transactions'
let currentProductForCheckout = null
let selectedPaymentId = null

function getPaymentMethods() {
  try {
    const raw = localStorage.getItem(PAYMENT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) { return [] }
}

function setPaymentMethods(list) {
  localStorage.setItem(PAYMENT_KEY, JSON.stringify(list))
}

function maskCard(num) {
  const s = (num || '').replace(/\s+/g, '')
  if (s.length < 4) return '••••'
  return '•••• •••• •••• ' + s.slice(-4)
}

function renderPaymentMethods() {
  const list = getPaymentMethods()
  paymentMethodsList.innerHTML = ''
  if (!list.length) paymentMethodsList.innerHTML = '<p class="read-the-docs">No payment methods saved.</p>'
  list.forEach(m => {
    const el = document.createElement('div')
    el.className = 'payment-method-item'
    el.innerHTML = `
      <div>
        <div class="pm-name">${m.cardholder}</div>
        <div class="pm-num">${m.last4 ? '•••• •••• •••• ' + m.last4 : ''}</div>
      </div>
      <div class="pm-actions">
        <button data-id="${m.id}" class="toggle select-payment">Select</button>
        <button data-id="${m.id}" class="toggle remove-payment">Remove</button>
      </div>
    `
    paymentMethodsList.appendChild(el)
  })

  // attach listeners
  paymentMethodsList.querySelectorAll('.select-payment').forEach(b => b.addEventListener('click', (e) => {
    selectedPaymentId = e.currentTarget.getAttribute('data-id')
    paymentMessage.textContent = 'Selected payment method.'
    paymentMessage.classList.remove('error')
    paymentMessage.classList.add('success')
  }))
  paymentMethodsList.querySelectorAll('.remove-payment').forEach(b => b.addEventListener('click', (e) => {
    const id = e.currentTarget.getAttribute('data-id')
    const left = getPaymentMethods().filter(x => x.id !== id)
    setPaymentMethods(left)
    renderPaymentMethods()
  }))
}

function openCheckoutFor(product) {
  currentProductForCheckout = product
  selectedPaymentId = null
  paymentMessage.textContent = ''
  checkoutRoot.classList.remove('hidden')
  renderPaymentMethods()
}

function closeCheckout() {
  checkoutRoot.classList.add('hidden')
  currentProductForCheckout = null
}

addPaymentForm?.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = (cardNameInput.value || '').trim()
  const number = (cardNumberInput.value || '').trim()
  const expiry = (cardExpiryInput.value || '').trim()
  const cvv = (cardCvvInput.value || '').trim()
  paymentMessage.textContent = ''
  paymentMessage.classList.remove('error', 'success')
  if (!name || !number || !expiry || !cvv) {
    paymentMessage.textContent = 'Please fill all card fields.'
    paymentMessage.classList.add('error')
    return
  }
  // Tokenize card client-side for demo: store only token + last4
  const methods = getPaymentMethods()
  const id = 'pm_' + Date.now().toString(36)
  const token = 'tok_' + Math.random().toString(36).slice(2, 10)
  const last4 = (number.replace(/\D+/g, '').slice(-4)) || ''
  methods.push({ id, token, cardholder: name, last4, expiry })
  setPaymentMethods(methods)
  cardNameInput.value = ''
  cardNumberInput.value = ''
  cardExpiryInput.value = ''
  cardCvvInput.value = ''
  paymentMessage.textContent = 'Card added.'
  paymentMessage.classList.add('success')
  renderPaymentMethods()
})

processPaymentBtn?.addEventListener('click', () => {
  paymentMessage.textContent = ''
  paymentMessage.classList.remove('error', 'success')
  if (!currentProductForCheckout) {
    paymentMessage.textContent = 'No product selected.'
    paymentMessage.classList.add('error')
    return
  }
  const methods = getPaymentMethods()
  const method = methods.find(m => m.id === selectedPaymentId)
  if (!method) {
    paymentMessage.textContent = 'Please select a payment method.'
    paymentMessage.classList.add('error')
    return
  }
  // Call backend payments API (mock) with tokenized payment method
  const user = getUser() || {}
  const token = user.token
  if (!token) {
    paymentMessage.textContent = 'Please sign in to complete payment.'
    paymentMessage.classList.add('error')
    return
  }

  fetch(`${API}/api/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId: currentProductForCheckout.id, paymentToken: method.token, amount: currentProductForCheckout.price })
  }).then(r => r.json().then(json => ({ ok: r.ok, status: r.status, json }))).then(result => {
    if (!result.ok) {
      paymentMessage.textContent = result.json.error || 'Payment failed'
      paymentMessage.classList.add('error')
      return
    }
    // record server-side transaction is already stored on server; locally we can also keep a light record
    const txList = JSON.parse(localStorage.getItem(TX_KEY) || '[]')
    txList.push({ id: result.json.transaction.id, productId: result.json.transaction.productId, amount: result.json.transaction.amount, date: result.json.transaction.date })
    localStorage.setItem(TX_KEY, JSON.stringify(txList))
    paymentMessage.textContent = 'Payment successful — thank you!'
    paymentMessage.classList.add('success')
    setTimeout(() => { closeCheckout(); hideProductDetail() }, 900)
  }).catch(err => {
    console.error('Payment call failed', err)
    paymentMessage.textContent = 'Payment failed, please try again.'
    paymentMessage.classList.add('error')
  })
})

checkoutClose?.addEventListener('click', () => closeCheckout())

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
  // Call backend login
  fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(r => r.json().then(json => ({ ok: r.ok, status: r.status, json }))).then(result => {
    if (!result.ok) {
      msg.textContent = result.json.error || 'Login failed'
      msg.classList.add('error')
      return
    }
    const data = result.json
    // store id/email/name/token
    const user = { id: data.id, email: data.email, name: data.name || '', token: data.token }
    setUser(user)
    msg.textContent = `Signed in as ${data.email}`
    msg.classList.add('success')
    setTimeout(() => showDashboard(user), 600)
  }).catch(err => {
    console.error('Login error', err)
    msg.textContent = 'Login failed'
    msg.classList.add('error')
  })
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

  // Call backend register
  fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  }).then(r => r.json().then(json => ({ ok: r.ok, status: r.status, json }))).then(result => {
    if (!result.ok) {
      msg.textContent = result.json.error || 'Registration failed'
      msg.classList.add('error')
      return
    }
    const data = result.json
    const user = { id: data.id, email: data.email, name: data.name || '', token: data.token }
    setUser(user)
    msg.textContent = `Account created for ${name}`
    msg.classList.add('success')
    setTimeout(() => showDashboard(user), 800)
  }).catch(err => {
    console.error('Register error', err)
    msg.textContent = 'Registration failed'
    msg.classList.add('error')
  })
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

  // Call backend change-password endpoint (requires JWT)
  const token = user.token
  if (!token) {
    passwordMessage.textContent = 'You must be signed in to change password.'
    passwordMessage.classList.add('error')
    return
  }

  fetch(`${API}/api/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ currentPassword: current, newPassword: next })
  }).then(r => r.json().then(json => ({ ok: r.ok, status: r.status, json }))).then(result => {
    if (!result.ok) {
      passwordMessage.textContent = result.json.error || 'Password change failed'
      passwordMessage.classList.add('error')
      return
    }
    passwordMessage.textContent = 'Password updated.'
    passwordMessage.classList.add('success')
    // clear inputs
    currentPasswordInput.value = ''
    newPasswordInput.value = ''
    confirmPasswordInput.value = ''
  }).catch(err => {
    console.error('Change password error', err)
    passwordMessage.textContent = 'Password change failed'
    passwordMessage.classList.add('error')
  })
})

// Products navigation handlers
if (btnProducts) btnProducts.addEventListener('click', () => showProducts())
if (btnProductsBack) btnProductsBack.addEventListener('click', () => { productsRoot.classList.add('hidden'); showDashboard(getUser() || {}) })
if (productDetailClose) productDetailClose.addEventListener('click', hideProductDetail)

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
