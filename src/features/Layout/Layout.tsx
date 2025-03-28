import { useState } from "react"
import { Outlet } from "react-router"
import "./Layout.css"

import logo from "../../assets/eiou-wide.svg"

const Layout = () => {
    const [isNavOpen, setIsNavOpen] = useState(false)

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen)
    }

    const closeNav = () => {
        setIsNavOpen(false)
    }

    return (
        <div className="layout">
           <nav className={isNavOpen ? "open" : ""}>
                <header>
                    <button className="nav-toggle" onClick={closeNav}> ← </button>
                </header>
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                </ul>
                <footer>
                    <p>© 2025 eiou.</p>
                </footer>
            </nav>
            <div className="content">
                <header>
                    <button className="nav-toggle" onClick={toggleNav}> ☰ </button>
                    <img src={logo} alt="eiou" />
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default Layout