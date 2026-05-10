import '../App.css'
import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import money from '../assets/money.png'
import Carousel from '../components/Carousel';

export default function Home() {
    const [count, setCount] = useState(0)
    
      return (
        <section className="page">
          <section id="center">
            <div className="hero" style={{ marginBottom: "10px" }}>
              <img src={money} className="base" width="170" height="179" alt="" />
            </div>
            <div style={{ marginTop: "0" }}>
              <h1>Money App</h1>
              <p>
                Track your finances and decide whether you want to invest or pay off debt faster.
              </p>
            </div>
          </section>
    
          <div className="ticks"></div>
    
          <section id="next-steps">
            <div id="docs" style={{ width: "100%" }}>
              <h2>Learn More</h2>
              <Carousel />
            </div>
            <div id="social">
              <h2>About This App</h2>
              <p>This app is designed to help users better understand their financial situation by 
                tracking their expenses and managing debt to help you decide to pay off debt or invest. 
                By tracking your expenses and analyzing your debts, you can see how different payment strategies 
                affect your payoff time and total interest. It also provides tools to calculate how much you can 
                earn on investments. With this insight, you can make smarter financial decisions that align with 
                your goals.
              </p>
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
                    View on GitHub
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