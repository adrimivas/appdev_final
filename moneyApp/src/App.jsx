import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Income from './pages/income'
import ExpensesDebt from './pages/expences'
import Investments from './pages/investments'
import Login from './pages/login'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '20px 0' }}>
        <Link to="/">Home</Link>
        <Link to="/income">Income</Link>
        <Link to="/expenses-debt">Expenses/Debt</Link>
        <Link to="/investments">Investments</Link>
        <Link to="/login">Login</Link>
      </nav>

      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Money App</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>feel free to add files fwends</h2>
          <p>we can work on modifying layout week 2 and week 3</p>
        </div>

        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>links</h2>
          <p>git hub repo link (actually works)</p>
          <ul>
            <li>
              <a href="https://github.com/adrimivas/appdev_final.git" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expenses-debt" element={<ExpensesDebt />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App