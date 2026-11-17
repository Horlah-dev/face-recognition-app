function Navigation({ onSignOut }){
    return(
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            <p className="f3 link dim black pa3 pointer"
            onClick={onSignOut}
            >
                Sign Out
                </p>
        </nav>
    );
}


export default Navigation;