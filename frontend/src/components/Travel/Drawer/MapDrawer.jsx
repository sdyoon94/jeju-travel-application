import { CircularProgress, Drawer } from "@mui/material";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";

import { ReactComponent as MapIcon } from "assets/map.svg";

import api from "api";
import axios from "axios";

import "./MapDrawer.css";
import { useSelector } from "react-redux";

const API_KEY = "AIzaSyA_Kp9lPUVHWZ5i3blrGYJRk8yG70ZovsM";
const containerStyle = {
  height: "max(30vh, 250px)",
  width: "90vw",
};
const center = {
  lat: 33.48883,
  lng: 126.498083,
};
// Map 객체의 bounds, center 변경을 위한 함수
const updateBounds = (bounds, lat, lng) => {
  if (lat > bounds.north) {
    bounds.north = lat;
  }
  if (lat < bounds.south) {
    bounds.south = lat;
  }
  if (lng > bounds.east) {
    bounds.east = lng;
  }
  if (lng < bounds.west) {
    bounds.west = lng;
  }
};
const updateCenter = (center, lat, lng) => {
  center.lat += lat;
  center.lng += lng;
};
const divideCenter = (center, len) => {
  center.lat /= len;
  center.lng /= len;
};
// tag 처리 함수
// const buildTags = (tag) => {
//   const tags = tag.split(",")
//   if (tags.length === 0) {
//     return "#태그없음"
//   }
//   if (tags.length === 1) {
//     return `#${tag}`
//   }
//   return tags.reduce((prev, curr) => `#${prev} #${curr}`)
// }

function MapDrawer({ travel, scheduleIdx }) {
  const [day, setDay] = useState(scheduleIdx + 1);
  const [route, setRoute] = useState(travel.schedules[scheduleIdx]);
  const [date, setDate] = useState(
    travel.info.startDate
      ? format(addDays(travel.info.startDate, scheduleIdx))
      : ""
  );

  // Drawer 컴포넌트에서 사용
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpened(true);
  };
  const closeDrawer = () => {
    setIsDrawerOpened(false);
  };

  useEffect(() => {
    setRoute(travel.schedules[scheduleIdx]);
    // eslint-disable-next-line
  }, [travel.schedules[scheduleIdx], scheduleIdx]);

  useEffect(() => {
    setDay(scheduleIdx + 1);
    setDate(
      travel.info.startDate
        ? format(addDays(travel.info.startDate, scheduleIdx))
        : ""
    );
  }, [travel.info.startDate, scheduleIdx]);

  const [markers] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });

  const PlaceInfo = () => {
    return (
      <div id="place">
        <a id="place-link" href="">
          <div id="place-name"></div>
        </a>
        <div id="place-spec">
          <img id="place-image" alt="장소 이미지" src=""></img>
          <div id="place-info">
            <div id="place-addr">관광지 주소</div>
            <div id="place-tag">
              지도의 마커를 클릭하여 관광지 정보를 확인하고, <br />
              사람 모양 아이콘을 드래그하여 스트리트 뷰를 <br /> 확인할 수
              있어요.
            </div>
          </div>
        </div>
      </div>
    );
  };
  const token = useSelector((state) => state.auth.token);

  const fetchPlaceInfo = async (placeUid) => {
    const response = await axios({
      url: api.place.placeInfoUrl(placeUid),
      method: "get",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.place;
  };

  const Map = ({ route, markers }) => {
    // 지도가 로드되었을 때 실행하는 로직
    const onLoad = useCallback(
      (mapInstance) => {
        while (markers.length > 0) {
          markers.pop().setMap(null);
        }

        const bounds = {
          north: -90,
          south: 90,
          east: -180,
          west: 180,
        };

        const center = {
          lat: 0,
          lng: 0,
        };

        route.forEach((place, idx) => {
          const lat = place.lat;
          const lng = place.lng;

          updateBounds(bounds, lat, lng);
          updateCenter(center, lat, lng);

          const marker = new window.google.maps.Marker({
            position: {
              lat,
              lng,
            },
            title: `${idx + 1}. ${place.placeName}`,
            label: `${idx + 1}`,
            map: mapInstance,
            optimized: false,
          });

          marker.addListener("click", (e) => {
            const promise = fetchPlaceInfo(place.placeUid);
            const getData = () => {
              promise.then((res) => {
                document.getElementById("place-name").innerText = res.placeName;
                document.getElementById(
                  "place-link"
                ).href = `https://m.search.naver.com/search.naver?query=제주${res.placeName}`;
                document.getElementById("place-name").style.display = "block";
                document.getElementById("place-image").src = res.imgPath
                  ? res.imgPath
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Jeju_Island.jpg/320px-Jeju_Island.jpg";
                document.getElementById("place-image").style.display = "block";
                document.getElementById("place-addr").innerText =
                  res.roadAddress;
                document.getElementById("place-addr").style.display = "block";
                document.getElementById("place-tag").innerText = res.tag
                  ? `#${res.tag.join(" #")}`
                  : "#태그없음";
              });
            };
            getData();
          });

          markers.push(marker);
        });

        divideCenter(center, route.length);

        mapInstance.fitBounds(bounds);
        mapInstance.setCenter(center);
      },
      [markers, route]
    );

    return (
      <div className="google-map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={11}
          onLoad={onLoad}
        ></GoogleMap>
      </div>
    );
  };

  return (
    <>
      <MapIcon className="map-marker" onClick={toggleDrawer} />
      <Drawer anchor={"bottom"} open={isDrawerOpened} onClose={closeDrawer}>
        <div className="map-title">
          {date ? `${day}일차 지도 (${date})` : `${day}일차 지도`}
        </div>
        {loadError ? (
          <div>현재 지도 API 호출이 원활하지 않습니다. </div>
        ) : isLoaded ? (
          <Map route={route} markers={markers} />
        ) : (
          <CircularProgress />
        )}
        <PlaceInfo />
      </Drawer>
    </>
  );
}

export default MapDrawer;
