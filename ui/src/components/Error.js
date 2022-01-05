import React from 'react';

const Error = ({ errorMessage }) => {
    return (
        <div className='error__container'>
            <p className='error__message'>{errorMessage}</p>
        </div>
    );
}

export default Error;