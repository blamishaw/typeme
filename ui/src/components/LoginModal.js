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
                setDisplayName(serverMessage.message);
                setModalIsOpen(false);
            }
            if (serverMessage.type === 'USER_REJECT'){
                setErr('Display name is already in use.');
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
        if (!isValidDisplayName(displayName)) {
            e.target[0].value = '';
        } else {
            // Check if display name is in active use
            sendMessage('USER_CONNECT', { displayName });
            serverResponseTimer = setTimeout(() => console.log('Server unresponsive.'), 3000);
        }
    }

    return (
        <Modal
            isOpen={modalIsOpen}
        >
            <form autoComplete='off' autoCapitalize='off' onSubmit={handleSubmitForm}>
                <h3>{err || "Display names must be 13 characters or less"}</h3>
                <input autoComplete='off' placeholder='Enter display name'></input>
            </form>
        </Modal>
    );
}

export default LoginModal;