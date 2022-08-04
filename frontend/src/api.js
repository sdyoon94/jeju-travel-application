const HOST = "http://i7a609.p.ssafy.io:8081/api/"


const api = {
  accounts: {
    editProfileImgUrl(userId) {
      return HOST + `file/upload/${userId}`
    },
    editNicknameUrl() {
      return HOST + "v1/users"
    },
    logoutUrl() {
      return HOST + "oauth/kakao/logout"
    },
    signoutUrl() {
      return HOST + "oauth/kakao/delete"
    }

  }

}

export default api