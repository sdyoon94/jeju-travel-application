const HOST = "https://i7a609.p.ssafy.io/api/v1/"
const TRAVEL = "trip/"
const SCHEDULE = "schedule/"

const api = {
  accounts: {
    editProfileImgUrl() {
      return HOST + "file/upload";
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
  travel: {
    createTravelInfoUrl(travelId) {
      return `${HOST}trip/showTripInfo/${travelId}`
    },
    createTravelScheduleUrl(travelId, day) {
      return `${HOST}schedule?tripId=${travelId}&day=${day}`
    },
    getTravelInfoUrl() {
      return HOST + TRAVEL + "showTripList"
    },
    getTravelJoinUrl(travelId) {
      return `${HOST}trip/addUser/${travelId}`
    }
  },
  inputs: {
    createTravelUrl() {
      return HOST + "trip";
    },
  },
  schedule: {
    scheduleUrl(scheduleId) {
      return HOST + SCHEDULE + `${scheduleId}`
    },
  }
};

export default api;
