Welcome to Got the Dough? ! We are so glad you are here and hope this tool serves you well. 
Disclaimer: WE ARE NOT A CERTIFIED FINANCIAL ADVISER APPLICATION. We have made this tool to the best of our abilities and
through researcg, but we are by no means professionals in this field. 

Setup
To run this app, you will need to:
- Install this entire project on your local computer
- Run npm install in the moneyApp directory
- Have 2 terminals running at the same time 
    - 1. Run node server.js from financial_tool_app directory
    - 2. Run npm run dev from moneyApp directory

Features
 Profile page where you will be able to see some of your financial stats like income, expense to income ratio, debt, and expenses. 

 Advice page that generates custom advice regarding whether you should invest or pay off debt if you have some disposable income taking into account debt interest rates. 

 Investments page that shows you projected growth of assets in custom period of time 

 Debt page that gives a thorough breakdown of all reported debts as well as an overview of monthly expenses

 Calculator page that has 3 functions: Debt Payoff Calculator, Monthly Budget Planner, and Emergeny Fund Calculator

Architecture Overview
  financial_tool_app 
     |_
     moneyApp 
     node_modules
        |_
        src
         |_
         assets
         components
             |_
             debts
             expenses
             investments
         controllers
         hooks
         layout
         models
         pages
         routes
         services
         utils


    
