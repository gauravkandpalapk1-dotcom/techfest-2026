import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="brand">
              <span className="brand-symbol">TF</span>
              <span><b>TECH</b>FEST</span>
              <small>2026</small>
            </a>
          </div>

          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#events">Events</a>
            <a href="#schedule">Schedule</a>
            <a href="#register">Register</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 TECHFEST. ALL RIGHTS RESERVED.</span>
          <span>DESIGNED FOR THE NEXT GENERATION.</span>
        </div>
      </div>
    </footer>
  );
}
