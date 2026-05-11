import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function StockPriceChart({ data }) {
    if (!data?.length) return null;

    return (
        <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDashArray="3 3" />
                    <XAxis dataKey="date" minTickGap={24} />
                    <YAxis domain={["auto", "Auto"]} />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Close"]} />
                    <Line type="monotone" dataKey="close" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}