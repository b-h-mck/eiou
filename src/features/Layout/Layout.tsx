import { useState } from "react"
import { Outlet } from "react-router"
import "./Layout.css"

import logo from "../../assets/eiou-wide.svg"
import { TiChevronLeftOutline, TiThMenuOutline } from "react-icons/ti"

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
                <div className="nav-container">
                    <header>
                        <button className="nav-toggle" onClick={closeNav}><TiChevronLeftOutline /></button>
                    </header>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/settings">Settings</a></li>
                        <li><a href="/help">Help</a></li>
                    </ul>
                    <footer>
                        <p>© 2025 eiou.</p>
                        <p>Licensed under the <a href="https://github.com/b-h-mck/eiou/blob/main/LICENSE.txt">MIT License</a></p>
                    </footer>
                </div>
            </nav>
            <div className="content">
                <header>
                    <button className="nav-toggle" onClick={toggleNav}><TiThMenuOutline /></button>
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