const HOST = "http://i7a609.p.ssafy.io:8081/api/v1/"
const TRAVEL = "trip/"

const api = {
  accounts: {
    editProfileImgUrl(userId) {
      return HOST + `file/upload/${userId}`;
    },
    editNicknameUrl() {
      return HOST + "users";
    },
    logoutUrl() {
      return HOST + "logout";
    },
    signoutUrl() {
      return HOST + "delete";
    },
    verifyUrl() {
      return HOST + "auth/verify";
    },
  },
  inputs: {
    createTravelUrl() {

      return HOST + "trip";


    },
  },
  travel: {
    getTravelInfoUrl() {
      return HOST + TRAVEL + "showTripList"
    }
  }
};

export default api;
