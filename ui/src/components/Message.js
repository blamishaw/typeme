import React from 'react';

const Message = ({ from, content }) => {
    return (
        <div>
            <p>{content} --{from}</p>
        </div>
    );
}

export default Message;