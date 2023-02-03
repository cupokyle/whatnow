import React, { useState } from "react";
import styles from "../index.module.css";

const Modal = props => {
    const [artInput, setArtInput] = useState("digital art");

    const handleChange = (event) => {
        // 👇 Get input value from "event"
        setArtInput(event.target.value);
      };

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
                        <span>Art Style: </span><input name="artInput" id="artInput" type="text" placeholder={props.artStyle} onChange={handleChange}></input>
                    </div>
                    <div className={styles.modalFooter}>
                        <button onClick={props.onClose}>Close</button>
                        <button onClick={props.setArtStyle(artInput)}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal