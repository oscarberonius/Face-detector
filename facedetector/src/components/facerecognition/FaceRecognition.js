import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, faceBox }) => {
    return (
        <div className='ma center'>
            <div className='absolute mt2'>
                <img id='faceImage' alt='' src={imageUrl} width='500px' height='auto' />
                <div className='bounding-box' style={{ top: faceBox.topRow, right: faceBox.rightCol, bottom: faceBox.bottomRow, left: faceBox.leftCol }} ></div>
            </div>

        </div>
    );
}

export default FaceRecognition;
