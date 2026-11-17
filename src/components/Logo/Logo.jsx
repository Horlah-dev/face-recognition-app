import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

function Logo(){
return(
<div className="logo-container">
    <Tilt
        tiltMaxAngleX={30}
        tiltMaxAngleY={30}
        perspective={1000}
        className='logo-tilt'
    >
    <div className='logo-emoji'><img alt='logo' src={brain}/></div>
    </Tilt>
    </div>
    );
}

export default Logo;