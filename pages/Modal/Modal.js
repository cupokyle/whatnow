import React, { useState } from "react";
import PropTypes from 'prop-types';
import styles from "../index.module.css";

const Modal = props => {
    const [artInput, setArtInput] = useState("digital art");

    const handleChangeArt = (event) => {
        // 👇 Get input value from "event"
        setArtInput(event.target.value);
    };
    const submitSettings = () => {
        props.onClose();
        props.setArtStyle(artInput);
    }

    if (!props.show) {
        return null;
    }
    return (
        <div className={styles.modal} onClick={props.onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle}>
                        <h4>
                            Settings
                        </h4>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={styles.settingBox}>
                            <h4 className={styles.settingLabel}>Art Style: </h4><input name="artInput" id="artInput" type="text" placeholder={props.artStyle} onChange={handleChangeArt}></input>
                        </div>
                    </div>
                    <div className={styles.modalFooter}>
                        <button onClick={props.onClose}>Close</button>
                        <button onClick={submitSettings}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    setArtStyle: PropTypes.func.isRequired,
    artStyle: PropTypes.string
};

export default Modal