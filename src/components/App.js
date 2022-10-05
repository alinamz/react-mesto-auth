import logo from '../images/Vector.svg';
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import '../pages/index.css';
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import api from '../utils/api.js';
import ImagePopup from "./ImagePopup.js"
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import DeleteCardPopup from './DeleteCardPopup.js';
import { ProtectedRoute } from './ProtectedRoute.js';
import Register from './Register.js';
import Login from './Login.js';
import InfoTooltip from './InfoTooltip.js';
import * as auth from "../utils/auth.js";
import resImg from "../images/gud.svg";
import errorImg from "../images/error.svg";


function App() {
  const [isEditProfilePopupOpen, handleEditProfileClick] = React.useState(false);
  const [isAddPlacePopupOpen, handleAddPlaceClick] = React.useState(false);
  const [isEditAvatarPopupOpen, handleEditAvatarClick] = React.useState(false);
  const [selectedCard, handleCardClick] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [selectedCardId, setSelectedCardId] = React.useState(null);
  const [isInfoPopupOpen, handleIsInfoPopupOpen] = React.useState(false);
  const [messageResult, setMessageResult] = React.useState({
    text: "",
    image: ""
  })

  // константа для отправки не зарегестрированных пользователей в окно регистарции
  const [loggedIn, setLoggedIn] = React.useState(false);

  // константа для передачи email в шапку профиля
  const [email, setEmail] = React.useState("");

  let navigate = useNavigate()

  // проверка токена
  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth
        .getContent(jwt).then((res) => {
          if (res) {
            setEmail(res.data.email)
            setLoggedIn(true)
            navigate("/")
          }
        })
        .catch((err) => {
          setLoggedIn(false);
          console.log(err)
        })
    }
  }

 // загрузка данных пользователя при rendere
  React.useEffect(() => {
    tokenCheck();
  }, [loggedIn]);

 // регистрация пользователя
  const handleRegist = (passwordUser, emailUser) => {
    auth
      .register(passwordUser, emailUser)
      .then(() => {
        setMessageResult({
          text: "Вы успешно зарегистрировались!",
          image: resImg
        });
        navigate("/sign-in")
      })
      .catch(() => {
        setMessageResult({
          text: "Что-то пошло не так!Попробуйте ещё раз.",
          image: errorImg
        });
      })
      .finally(() => {
        handleIsInfoPopupOpen(true);
      })
  }

 // авторизируем пользователя
  const handleAuthorization = (passwordUser, emailUser) => {
    if (!emailUser || !passwordUser) {
      return;
    }
    auth
      .authorization(passwordUser, emailUser)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setLoggedIn(true);
          navigate("/", { replace: true })
        } else {
          return;
        }
      })
  }
 
  // выходим из аккаунта
  const handleExit = () => {
    localStorage.removeItem('jwt');
    navigate("/sign-in");
    setLoggedIn(false)
  }

  // изменяем данные пользователя
  function handleUpdateUser(userData) {
    api.changeUserData(userData.name, userData.about)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
  }
  // добавляем новый аватар
  function handleUpdateAvatar({ avatar }) {
    api.setProfileAvatar(avatar)
      .then((userAvatar) => {
        setCurrentUser(userAvatar);
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // добавляем новую карточку
  function handleAddPlaceSubmit(name, link) {
    console.log(name, link)
    api.addNewCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // закрываем все попапы
  const closeAllPopups = () => {
    handleEditAvatarClick(false);
    handleEditProfileClick(false);
    handleAddPlaceClick(false);
    handleCardClick(null);
    setIsConfirmPopupOpen(false);
    handleIsInfoPopupOpen(false);
  }

  // загрузка данных польователя на страницу
  React.useEffect(() => {
    const initialPromises = Promise.all([
      api.getUserData(),
      api.getInitalCards()
    ]);

    initialPromises
      .then(([profile, Cards]) => {
        setCards(Cards);
        setCurrentUser(profile)
      })
      .catch(err => {
        console.log(err)
      })

  }, [])

  // удаляем карточку
  const handleCardDeleteSubmit = (card) => {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups()
      })
      .catch(err => {
        console.log(err)
      })
  }

  // открываем попап удаления карточки для выбранной карточки
  function handleCardDelete(cardId) {
    setIsConfirmPopupOpen(true);
    setSelectedCardId(cardId)
  }

  // ставим лайк карточке
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => console.log(err));
  }
  // выводим сообщение при успешной или не очень регистрации
  const handleInfoMessage = () => {
    handleIsInfoPopupOpen(true)
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="background">
        <div className="page">
          <Header email={email} handleExit={handleExit} />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Main
                  onCardDelete={handleCardDelete}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  cards={cards}
                />
              </ProtectedRoute>
            }
            />

            <Route path="/sign-up" element={<Register onSuccess={handleInfoMessage} onMessge={setMessageResult} handleRegist={handleRegist} />} />
            <Route path="/sign-in" element={<Login handleAuthorization={handleAuthorization} />} />
          </Routes>
          <Footer />
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
          <DeleteCardPopup
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleCardDeleteSubmit}
            cardId={selectedCardId}
          />
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
          />

          <InfoTooltip onClose={closeAllPopups} isOpen={isInfoPopupOpen} messageResult={messageResult} />
        </div>
      </div >
    </CurrentUserContext.Provider>


  );
}

export default App;
