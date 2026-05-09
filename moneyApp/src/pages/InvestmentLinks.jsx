import { useNavigate } from "react-router-dom";

export default function InvestmentLinks() {
    const navigate = useNavigate();
    const sections = [
        {
            title: "Free Websites & Educational Platforms",
            links: [
                { name: "Investor.gov", url: "https://www.investor.gov/" },
                { name: "Khan Academy (Personal Finance)", url: "https://www.khanacademy.org/college-careers-more/personal-finance?" },
                { name: "FINRA Investor Education", url: "https://www.finra.org/investors#/" },
                { name: "Morningstar Investing Classroom", url: "https://www.morningstar.com/start-investing/classroom" },
            ]
        },
        {
            title: "Free Analytical & News Tools",
            links: [
                { name: "Yahoo Finance", url: "https://finance.yahoo.com/" },
                { name: "Google Finance", url: "https://www.google.com/finance/?hl=en" },
                { name: "EDGAR (SEC Database)", url: "https://www.sec.gov/edgar/search/" },
                { name: "Quartr.com" , url: "https://quartr.com/"}
            ]
        },
        {
            title: "Practice & Simulation Tools",
            links: [
                { name: "Investopedia Stock Simulator", url: "https://www.investopedia.com/simulator/" },
                { name: "Acorns", url: "https://www.acorns.com/" },
            ]
        },
        {
            title: "Free Courses",
            links: [
                { name: "Coursera - Investing for Beginners", url: "https://www.coursera.org/collections/investing-for-beginners" },
                { name: "Investing 101 Course", url: "https://investing101.net/" },
                { name: "Yale University Open Courses", url: "https://oyc.yale.edu/node/3" },
            ]
        }
    ];
    return (
        <section className="page">
            <button onClick={() => navigate(-1)}
                style={{
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "1px solid #bbb",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 16,
                    marginBottom: 20,
                }}>
                Back
            </button>
            <h1>Investment Resources</h1>
            {sections.map((section, i) => (
                <div key={i} style={{ marginBottom: "20px" }}>
                    <h3>{section.title}</h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {section.links.map((link, j) => (
                            <li key={j}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: "black" }}>
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}