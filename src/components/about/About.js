import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const featureRefs = useRef([]);

  useEffect(() => {
    featureRefs.current.forEach((el, index) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 50%",
              scrub: 0.5,
              toggleActions: "play none none none",
              once: true,
            },
            delay: index * 0.2, // Adds delay for staggered effect
          }
        );
      }
    });
  }, []);

  const features = [
    "🚀 Live Code Execution",
    "📚 Assignments & Practice Sets",
    "📊 Progress Tracking",
    "🔒 Secure User Accounts",
    "🏆 Leaderboard & Ranking System",
    "⚡ Multi-Language Support (C, Java, Python)",
    "💡 Real-Time Collaboration",
    "📈 Performance Insights & Analytics",
    "🛠️ Code Debugging Tools",
    "🎯 Interactive Coding Challenges",
    "🤖 AI-Powered Code Suggestions",
    "🔗 API Access for Developers",
  ];

  return (
    <div className="about-container">
      <h2 className="about-heading">Key Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el) => (featureRefs.current[index] = el) }
            className="feature-box"
          >
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
