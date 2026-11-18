import './Nav.css';

function Navigation({ onSignOut }){
    return(
        <nav className='navBar'>
            <p className='barss'
            onClick={onSignOut}
            >
                Sign Out
                </p>
        </nav>
    );
}


export default Navigation;
