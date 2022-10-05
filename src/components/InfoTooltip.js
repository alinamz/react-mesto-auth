import React from 'react';

function InfoTooltip({isOpen, onClose, messageResult}) {
    return (
        <div className={`popup popup_type_info ${isOpen && 'popup_opened'}`} >
            <div className="popup__container">
                <img className="popup__info-img" src={messageResult.image} alt={messageResult.text} />
                <h2 className="popup__title popup__title_info-text">{messageResult.text}</h2>
                <button className="popup__close" type="button" onClick={onClose}></button>
            </div>
        </div>
    )
}

export default InfoTooltip;