import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import "./subnav.css";

const SubNav = () => {
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      navRef.current.children,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <nav className="sub-nav" ref={navRef}>
      <NavLink to="/dashboard" className="sub-nav-link">Dashboard</NavLink>
      <NavLink to="/dashboard/assignments" className="sub-nav-link">Assignments</NavLink>
      <NavLink to="/dashboard/tests" className="sub-nav-link">Tests</NavLink>
    </nav>
  );
};

export default SubNav;