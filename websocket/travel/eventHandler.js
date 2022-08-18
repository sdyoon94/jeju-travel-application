import { eventEmitter, errorEmitter, CAST_TYPES } from "./emitter.js";
import {
  checkSchedulesAuthority,
  checkTravelInfoAuthority,
  grantAllAuthorities,
  putTravelInfo,
} from "./stateManager.js";
import {
  grantSchedulesAuthority,
  grantTravelInfoAuthority,
} from "./stateManager.js";
import {
  revokeSchedulesAuthority,
  revokeTravelInfoAuthority,
} from "./stateManager.js";
import { revokeAllAuthorities } from "./stateManager.js";
import {
  updateStaytime,
  swapSchedule,
  createSchedule,
  deleteSchedule,
} from "./stateManager.js";
import { fetchNewRecommend } from "./api/recommendTravel.js";
import { fetchTravel } from "./api/fetchTravel.js";

const CALLBACK_RESPONSE = {
  OK: {
    status: "ok",
  },
  BAD: {
    status: "bad",
  },
};

// ERROR
const ERRORS = {
  UNKNOWN_CAST_TYPE_ERROR: {
    statusCode: -1,
    msg: "unknown cast type error",
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 0,
    msg: "internal server error",
  },
  FETCH_ERROR: {
    statusCode: 1,
    msg: "fetch error",
  },
  BLOCKED_ERROR: {
    statusCode: 2,
    msg: "blocked error",
  },
  TERMINATED_ERROR: {
    statusCode: 3,
    msg: "terminated error",
  },
  JOIN_ERROR: {
    statusCode: 4,
    msg: "join error",
  },
  INPUT_ERROR: (err) => ({
    statusCode: 5,
    msg: err.message,
  }),
  CALLBACK_ERROR: {
    statusCode: 6,
    msg: "no callback error",
  },
};

const TYPE_FUNCTION = "function";

const typeCheck = (typeName, variable) => typeof variable === typeName;

// EVENT
const EVENTS = {
  FETCH_TRAVEL_EVENT: {
    eventName: "fetch travel",
    call: (socket, namespace, travelId, roomTable, eventName, _, callback) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        errorEmitter(
          { socket, namespace, room },
          CAST_TYPES.UNICAST,
          ERRORS.CALLBACK_ERROR
        );
        return;
      }
      const room = travelId;
      callback(CALLBACK_RESPONSE.OK);
      eventEmitter({ socket, namespace, room }, CAST_TYPES.UNICAST, eventName, {
        travelInfo: roomTable[travelId].travelInfo,
        schedules: roomTable[travelId].schedules,
      });
    },
  },
  GRANT_TRAVELINFO_AUTHORITY_EVENT: {
    eventName: "grant travelinfo authority",
    call: (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      { id },
      callback
    ) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        return;
      }
      const room = travelId;
      try {
        grantTravelInfoAuthority(travelId, roomTable, { id });
        callback(CALLBACK_RESPONSE.OK);
      } catch (err) {
        callback(CALLBACK_RESPONSE.BAD);
      }
    },
  },
  GRANT_SCHEDULES_AUTHORITY_EVENT: {
    eventName: "grant schedules authority",
    call: (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      { id, day },
      callback
    ) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        return;
      }
      const room = travelId;
      try {
        grantSchedulesAuthority(travelId, roomTable, { id, day });
        callback(CALLBACK_RESPONSE.OK);
      } catch (err) {
        callback(CALLBACK_RESPONSE.BAD);
      }
    },
  },
  REVOKE_TRAVELINFO_AUTHORITY_EVENT: {
    eventName: "revoke travelinfo authority",
    call: (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      { id },
      callback
    ) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        return;
      }
      const room = travelId;
      try {
        revokeTravelInfoAuthority(travelId, roomTable, { id });
        callback(CALLBACK_RESPONSE.OK);
      } catch (err) {
        callback(CALLBACK_RESPONSE.BAD);
      }
    },
  },
  REVOKE_SCHEDULES_AUTHORITY_EVENT: {
    eventName: "revoke schedules authority",
    call: (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      { id, day },
      callback
    ) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        return;
      }
      const room = travelId;
      try {
        revokeSchedulesAuthority(travelId, roomTable, { id, day });
        callback(CALLBACK_RESPONSE.OK);
      } catch (err) {
        callback(CALLBACK_RESPONSE.BAD);
      }
    },
  },
  REVOKE_ALL_AUTHORITY_EVENT: {
    eventName: "revoke all authority",
    call: (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      { id },
      callback
    ) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        return;
      }
      try {
        revokeAllAuthorities(travelId, roomTable, { id });
        callback(CALLBACK_RESPONSE.OK);
      } catch (err) {
        callback(CALLBACK_RESPONSE.BAD);
      }
    },
  },
  UPDATE_STAYTIME_EVENT: {
    eventName: "update staytime",
    call: (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      { day, turn, stayTime },
      callback
    ) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        return;
      }
      const room = travelId;
      try {
        checkSchedulesAuthority(travelId, roomTable, {
          id: socket.data.id,
          day,
        });
        updateStaytime(travelId, roomTable, { day, turn, stayTime });
        callback(CALLBACK_RESPONSE.OK);
        eventEmitter(
          { socket, namespace, room },
          CAST_TYPES.BROADCAST_CLIENT,
          eventName,
          { day, turn, stayTime }
        );
      } catch (err) {
        callback(CALLBACK_RESPONSE.BAD);
      }
    },
  },
  SWAP_SCHEDULE_EVENT: {
    eventName: "swap schedule",
    call: (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      { day, turn1, turn2 },
      callback
    ) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        return;
      }
      const room = travelId;
      try {
        checkSchedulesAuthority(travelId, roomTable, {
          id: socket.data.id,
          day,
        });
        swapSchedule(travelId, roomTable, { day, turn1, turn2 });
        callback(CALLBACK_RESPONSE.OK);
        eventEmitter(
          { socket, namespace, room },
          CAST_TYPES.BROADCAST_CLIENT,
          eventName,
          { day, turn1, turn2 }
        );
      } catch (err) {
        callback(CALLBACK_RESPONSE.BAD);
      }
    },
  },
  CREATE_SCHEDULE_EVENT: {
    eventName: "create schedule",
    call: (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      { day, spots },
      callback
    ) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        return;
      }
      const room = travelId;
      try {
        checkSchedulesAuthority(travelId, roomTable, {
          id: socket.data.id,
          day,
        });
        createSchedule(travelId, roomTable, { day, spots });
        callback(CALLBACK_RESPONSE.OK);
        eventEmitter(
          { socket, namespace, room },
          CAST_TYPES.BROADCAST_CLIENT,
          eventName,
          { day, spots }
        );
      } catch (err) {
        callback(CALLBACK_RESPONSE.BAD);
      }
    },
  },
  DELETE_SCHEDULE_EVENT: {
    eventName: "delete schedule",
    call: (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      { day, turn },
      callback
    ) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        return;
      }
      const room = travelId;
      try {
        checkSchedulesAuthority(travelId, roomTable, {
          id: socket.data.id,
          day,
        });
        deleteSchedule(travelId, roomTable, { day, turn });
        callback(CALLBACK_RESPONSE.OK);
        eventEmitter(
          { socket, namespace, room },
          CAST_TYPES.BROADCAST_CLIENT,
          eventName,
          { day, turn }
        );
      } catch (err) {
        callback(CALLBACK_RESPONSE.BAD);
      }
    },
  },
  PUT_TRAVELINFO_EVENT: {
    eventName: "put travel info",
    call: (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      { tripName, startDate, style, vehicle },
      callback
    ) => {
      if (!typeCheck(TYPE_FUNCTION, callback)) {
        return;
      }
      const room = travelId;
      try {
        checkTravelInfoAuthority(travelId, roomTable, {
          id: socket.data.id,
        });
        const response = putTravelInfo(travelId, roomTable, {
          tripName,
          startDate,
          style,
          vehicle,
        });
        callback(CALLBACK_RESPONSE.OK);
        eventEmitter(
          { socket, namespace, room },
          CAST_TYPES.BROADCAST_CLIENT,
          eventName,
          response
        );
      } catch (err) {
        callback(CALLBACK_RESPONSE.BAD);
      }
    },
  },
  RECOMMEND_EVENT: {
    eventName: "recommend",
    call: async (
      socket,
      namespace,
      travelId,
      roomTable,
      eventName,
      fixedSpots
    ) => {
      const room = travelId;
      const id = socket.data.id;
      const token = socket.data.token;
      let isGranted = false;
      try {
        checkTravelInfoAuthority(travelId, roomTable, {
          id,
        });
        grantAllAuthorities(travelId, roomTable, {
          id,
        });
        isGranted = true;
        eventEmitter(
          { socket, namespace, room },
          CAST_TYPES.BROADCAST_SERVER,
          eventName,
          {
            status: "in process",
          }
        );
        await fetchNewRecommend(travelId, socket.data.token, fixedSpots);
        await fetchTravel(travelId, roomTable, token);
        eventEmitter(
          { socket, namespace, room },
          CAST_TYPES.BROADCAST_SERVER,
          eventName,
          {
            status: "complete",
            travel: {
              info: roomTable[travelId].travelInfo,
              schedules: roomTable[travelId].schedules,
            },
          }
        );
      } catch (err) {
        console.log(err)
        eventEmitter(
          { socket, namespace, room },
          CAST_TYPES.BROADCAST_SERVER,
          eventName,
          {
            status: "fail",
          }
        );
      }
      isGranted && revokeAllAuthorities(travelId, roomTable, { id });
    },
  },
};

export { ERRORS, EVENTS };
