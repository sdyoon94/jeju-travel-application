const HOST = "http://i7a609.p.ssafy.io:8081/api"


const api = {
  accounts: {
    editProfileImgUrl(userId) {
      return HOST + `/file/upload/${userId}`
    },
    editNicknameUrl(userId) {
      return HOST + `/v1/users/${userId}`
    }

  }

}

export default api