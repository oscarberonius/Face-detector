import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import logo from './logo.png';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max: 40 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa4">
                    <img style={{ paddingTop: '15px' }} src={logo} alt="what" />
                </div>
            </Tilt>
        </div >
    );
}

export default Logo;
