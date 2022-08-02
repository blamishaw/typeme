import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import { WebSocketContext } from '../network/WebSocketContext';
import { processServerMessage } from '../network/connect';
import { registerUserInRadar, getUserLocation } from '../network/location';

Modal.setAppElement('#root');

const LoginModal = ({ setDisplayName }) => {
    const { sendMessage, serverMessage } = useContext(WebSocketContext);

    const [modalIsOpen, setModalIsOpen] = useState(true);
    const [err, setErr] = useState('');
    const [ctxMsg, setCtxMsg] = useState('');

    useEffect(() => {
        processServerMessage('CTX_REJECT', serverMessage, () => {
            setErr(`Chatroom is full. Refresh browser to keep trying.`);
        });
        processServerMessage('USER_REJECT', serverMessage, () => {
            setErr(`Display name "${serverMessage.message}" is already in use.`);
        });
        processServerMessage('USER_ACCEPT', serverMessage, () => {
            setModalIsOpen(false);
            setDisplayName(serverMessage.message);
        });
    }, [serverMessage])

    const isValidDisplayName = (displayName) => {
        if (displayName) {
            // Sanitize display name
            const displayNamePattern = /^[a-zA-Z0-9_-]*$/
            if (displayName.length > 14) {
                setErr('Display names must be less than 13 characters');
                return false;
            }
            if (!displayNamePattern.test(displayName)) {
                setErr('Display names can only contain alphanumeric characters and underscores/hyphens');
                return false;
            }
        } else {
            setErr('Please enter a valid display name')
            return false;
        }
        return true;
    }

    const connectUser = (displayName) => {
        setCtxMsg('Connecting...');
        // Fetch location using Radar API and send to server
        registerUserInRadar(displayName);
        getUserLocation(displayName).then(
            userLocation => sendMessage('USER_CONNECT', { displayName }, userLocation)
        )
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();
        const inputText = e.target[0].value;
        const displayName = inputText.trim();
        // Check if display name is in active use
        if (isValidDisplayName(displayName)) {
            connectUser(displayName);
        } else{
            e.target[0].value = '';
        }
        
    }

    return (
        <Modal
            isOpen={modalIsOpen}
            className="modal"
        >
            <h1 className="modal__title">typeme.io</h1>
            <form autoComplete='off' autoCapitalize='off' onSubmit={handleSubmitForm} className='typeme-form'>
                <input className="typeme-input" autoComplete='off' placeholder='Enter display name'></input>
                <button className="typeme-button">Submit</button>
            </form>
            <h3 className="modal__info">Display names must be 13 characters or less</h3>
            <h4 className="modal__error">{err}</h4>
            <h4 className="modal__ctx_msg">{ctxMsg}</h4>
        </Modal>
    );
}


export default LoginModal;