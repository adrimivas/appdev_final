import { APP_NAME, ACCOUNT_TYPES, DEBT_TYPES } from "../constants/appConstants";

export default function Constants() {
    return (
        <section className="page">
            <h2>Different Inputs/Variables we'll ask the user for: </h2>
            
            <p>Potential Account Types:</p>
            <ul>
                {ACCOUNT_TYPES.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            <p>Accruing Debts:</p>
            <ul>
                {DEBT_TYPES.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </section>
    )
}