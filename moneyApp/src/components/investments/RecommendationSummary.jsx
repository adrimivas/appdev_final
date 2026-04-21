import { getInvestmentSuggestion } from "../../utils/investmentCalculations";

export default function RecommendationSummary({ profile }) {
    const suggestion = getInvestmentSuggestion(profile);

    return (
        <section className="page-section recommendation-card">
            <h2>Starter Recommendation</h2>
            <p><strong>{suggestion.primary}</strong></p>
            <p>{suggestion.secondary}</p>
            <p><strong>Current favored path:</strong> {suggestion.favored}</p>
        </section>
    );
}