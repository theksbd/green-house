import "./Header.css";

const Header = (props) => {
    return(
        <div className="content-header">
            <p>{props.data}</p>
        </div>
    )
}

export default Header;