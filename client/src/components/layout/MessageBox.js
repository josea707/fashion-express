import React from 'react'

const MessageBox = ({msg, type}) => {
    return (
        <div>
            <p className={type}> {msg} </p>
        </div>
    )
}

export default MessageBox;
