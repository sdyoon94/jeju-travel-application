import { useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'assets/arrow-left.svg'
import "./Header.css"

function Header({ children }) {
    const navigate = useNavigate();

    return (
        <div className="header">
            <ArrowLeft
                onClick={() => navigate(-1)}
                width="20"
                height="20"
                fill="black"></ArrowLeft>
            { children }
        </div>
    )
}

export default Header;