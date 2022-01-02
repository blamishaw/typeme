import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import { WebSocketContext } from '../network/WebSocketContext';

Modal.setAppElement('#root');

const LoginModal = ({ setDisplayName }) => {
    const { sendMessage, serverMessage } = useContext(WebSocketContext);

    const [modalIsOpen, setModalIsOpen] = useState(true);
    const [err, setErr] = useState('');
    let serverResponseTimer;

    useEffect(() => {
        if (typeof serverMessage.type === 'string'){
            
            if (serverMessage.type === 'USER_ACCEPT') {
                setModalIsOpen(false);
                setDisplayName(serverMessage.message);
            }
            if (serverMessage.type === 'USER_REJECT'){
                setErr(`Display name "${serverMessage.message}" is already in use.`);
            }
        }
        return () => clearTimeout(serverResponseTimer);
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

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const inputText = e.target[0].value;
        const displayName = inputText.trim();
        if (isValidDisplayName(displayName)) {
            // Check if display name is in active use
            sendMessage('USER_CONNECT', { displayName });
            serverResponseTimer = setTimeout(() => console.log('Server unresponsive.'), 3000);
        }
        e.target[0].value = '';
    }

    return (
        <Modal
            isOpen={modalIsOpen}
            className="modal"
        >
            <form autoComplete='off' autoCapitalize='off' onSubmit={handleSubmitForm}>
                <h1 className="modal__title">typeme.</h1>
                <input className="typeme-input" autoComplete='off' placeholder='Enter display name'></input>
                <button className="typeme-button">Submit</button>
                <h3 className="modal__info">Display names must be 13 characters or less</h3>
                <h4 className="modal__error">{err}</h4>
            </form>
        </Modal>
    );
}

export default LoginModal;