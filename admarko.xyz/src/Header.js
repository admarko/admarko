import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <div>
          <Link to="/">LOGO</Link>
        </div>
        <ul>
          <li>
            <Link to="/notes">Notes</Link>
          </li>
          <li>
            <a>Call me</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
