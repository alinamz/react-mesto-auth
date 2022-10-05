class Api {
    constructor(config) {
        this._baseUrl = config.baseUrl;
        this._headers = config.headers;
    }

    _fetch(partUrl, method = 'GET', body = null) {
        return fetch(`${this._baseUrl}${partUrl}`, {
            headers: this._headers,
            method: method,
            body: body
        })
            .then(res => {
                if (res.ok) return res.json();
                return Promise.reject(`Ошибка: ${res.status}`);
            })
    }


    getInitalCards() {
        return this._fetch(`/cards`);
    }

    getUserData() {
        return this._fetch('/users/me');
    }

    changeUserData(nameUser, aboutUser) {
        return this._fetch(
            '/users/me',
            'PATCH',
            JSON.stringify({
                name: nameUser,
                about: aboutUser
            }))
    }

    addNewCard(nameCard, linkCard) {
        return this._fetch(
            "/cards",
            "POST",
            JSON.stringify({
                name: nameCard,
                link: linkCard
            }))
    }

    deleteCard(cardId) {
        return this._fetch(
            `/cards/${cardId}`,
            "DELETE"
        )
    }

    addLike(card) {
        return this._fetch(
            `/cards/${card._cardID}/likes`,
            "PUT");
    }

    removeLike(card) {
        return this._fetch(
            `/cards/${card._cardID}/likes`,
            "DELETE");
    }

    setProfileAvatar(avatarLink) {
        const obj = { "avatar": avatarLink };
        return this._fetch(
            '/users/me/avatar',
            'PATCH',
            JSON.stringify(obj))
    }

    changeLikeCardStatus(cardId, isLiked) {
        if (isLiked) {
            return this._fetch(
                `/cards/${cardId}/likes`,
                "PUT");
        } else {
            return this._fetch(
                `/cards/${cardId}/likes`,
                "DELETE");
        }
    }


}

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-48',
    headers: {
        authorization: "7d67df57-04a3-4c0e-b94c-731b56c35104",
        'Content-Type': 'application/json',
    },
});
export default api;