import React from 'react';

function InfoTooltip({ isOpen, onClose, isLogin }) {
    return (
        <div className={`popup popup_type_info ${isOpen && 'popup_opened'}`} >
            <div className="popup__container">
            { isLogin ? 
                <>
                    <div className="popup__info-img popup__info-img_success"></div>
                    <h2 className="popup__title popup__title_text-error">Вы успешно зарегистрировались!</h2>
                </> :
                <>
                    <div className="popup__info-img popup__info-img_error"></div> 
                    <h2 className="popup__title popup__title_text-success">Что-то пошло не так!
              Попробуйте ещё раз.</h2>
                </>
             }
                <button className="popup__close" type="button" onClick={onClose}></button>
            </div>
        </div>
    )
}

export default InfoTooltip;