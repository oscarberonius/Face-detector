import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div>
            <p className="f3">
                {'Input image to detect a face'}
            </p>
            <div className='center form'>
                <div className='pa4 shadow-5 br3 center form'>
                    <input className='f4 center pa2 w-70' type='tex' onChange={onInputChange} />
                    <button className='w-30 f4 grow link ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit}>Detect</button>
                </div>
            </div>
        </div >
    );
}

export default ImageLinkForm;