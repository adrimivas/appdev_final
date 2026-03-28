import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout() {
    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}