import '../App.css'
import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'

export default function Home() {
    const [count, setCount] = useState(0)
    
      return (
        <section className="page">
          <section id="center">
            <div className="hero">
              <img src={heroImg} className="base" width="170" height="179" alt="" />
              <img src={reactLogo} className="framework" alt="React logo" />
              <img src={viteLogo} className="vite" alt="Vite logo" />
            </div>
            <div>
              <h1>Money App</h1>
              <p>
                Edit <code>..src/pages/Home.jsx</code> and save to test
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
                  <a href="https://github.com/adrimivas/appdev_final.git" target="_blank">
                    <svg
                      className="button-icon"
                      role="presentation"
                      aria-hidden="true"
                    >
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
        </section>
      );
}