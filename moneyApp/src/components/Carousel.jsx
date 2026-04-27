import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import img1 from "../assets/mymoney.webp";
import img2 from "../assets/occ.jpg";
import img3 from "../assets/betterinvesting.png";

export default function Carousel() {
    const [news, setNews] = useState([]);
    const customSlides = [
        {
            headline: "MyMoney.gov: Resources for Finnancial Literacy",
            image: img1,
            url: "https://www.mymoney.gov/"
        },
        {
            headline: "OCC Resource Directory: Financial Literacy and Education",
            image: img2,
            url: "https://www.occ.gov/topics/consumers-and-communities/community-affairs/resource-directories/financial-literacy/index-financial-literacy-resource-directory.html"
        },
        {
            headline: "BetterInvesting: Learn to Invest",
            image: img3,
            url: "https://www.betterinvesting.org/?campaignid=42812494&adgroupid=1541008744&adid=3484388644&gad_source=1&gad_campaignid=42812494&gbraid=0AAAAAD8vyM60vbcpXyvEQC65RlPDHkMit&gclid=Cj0KCQjwkrzPBhCqARIsAJN460k9EMXLEeDQXApr3wtRqgxEUdC3cNQIpXoZEiAKIFIZkDH0o4wAng8aAlfgEALw_wcB"
        }
    ]
    useEffect(() => {
        fetch("http://localhost:5000/api/news")
            .then(res => res.json())
            .then(data => setNews(data))
            .catch(err => console.error("News fetch error:", err));
    }, []);
    const slides = [...customSlides, ...news];
    return (
        <div style={{ width: "100%", maxWidth: "400px" }}>
            <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 5000 }}
                loop={true}
                spaceBetween={20}
                slidesPerView={1}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div style={{
                            background: "#1e1e1e",
                            borderRadius: "10px",
                            overflow: "hidden",
                            textAlign: "center"
                        }}>
                            {slide.image && (
                                <img
                                    src={slide.image}
                                    alt={slide.headline}
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "contain"
                                    }}
                                />
                            )}
                            <div style={{ padding: "10px" }}>
                                <h4>{slide.headline || slide.title}</h4>
                                <a
                                    href={slide.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Read More
                                </a>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}