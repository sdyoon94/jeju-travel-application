import { AvatarGroup, Avatar, Divider } from "@mui/material"

import React, { useEffect, useState } from "react"
import { format, addDays } from "date-fns"

import "./TravelTitle.css"
import "globalStyle.css"

const KAKAO_API_KEY = "03817511d5315ef223b0e6861c8f729e"
const STYLE_COUNT = 7
const STYLE_FORMAT = ["식도락", "전통 시장", "포토스팟", "체험/액티비티", "유명관광지", "자연", "여유"]

const integerToArray = (n) => {
  const str = String(n);
  const mapfn = (arg) => Number(arg);
  const arr = Array.from(str, mapfn);
  const emptyArr = Array(7 - arr.length).fill(0);
  return [...emptyArr, ...arr];
};

function TravelTitle({ travel, auth }) {

  const [styles, setStyles] = useState([])
  const [endDate, setEndDate] = useState(
    format(
      addDays(travel.info.startDate ?
        new Date(travel.info.startDate) :
        new Date(),
        travel.info.periodInDays - 1),
      "yyyy-MM-dd"
    )
  )

  useEffect(() => {
    setEndDate(
      format(
        addDays(travel.info.startDate ?
          new Date(travel.info.startDate) :
          new Date(),
          travel.info.periodInDays - 1),
        "yyyy-MM-dd"
      )
    )
  }, [travel.info.startDate, travel.info.periodInDays])

  useEffect(() => {
    if (travel.info.style) {
      const styles_ = []
      const styleArr = integerToArray(travel.info.style)

      for (let i = 0; i < STYLE_COUNT; i++) {
        if (styleArr[i]) {
          styles_.push(STYLE_FORMAT[i])
        }
      }
      setStyles(styles_)
    }
    else {
      setStyles(["스타일 없음"])
    }
  }, [travel.info.style])

  useEffect(() => {
    initKakao()
  }, [])

  const initKakao = () => {
    if (window.Kakao) {
      const kakao = window.Kakao
      if (!kakao.isInitialized()) {
        kakao.init(KAKAO_API_KEY)
      }
    }
  }

  const share = () => {
    const joinUrl = `https://i7a609.p.ssafy.io/join/${travel.info.tripId}/${encodeURIComponent(auth.nickname)}`
    window.Kakao.Share.sendDefault({
      objectType: "text",
      text:
        `${auth.nickname}님이 제주도 여행에 초대하셨습니다.`,
      buttonTitle: "여행 참여하기",
      link: {
        mobileWebUrl:
          joinUrl,
        webUrl:
          joinUrl,
      }
    })
  }

  return (
    <div className="travel-title-container">
      <div className="travel-title title-weight">
        <span className="title-size overflow-x-dots">{travel.info.tripName}</span>
        <AvatarGroup className="avatar-group" max={4}>
          {
            travel.info.member.map((member, i) => {
              return <Avatar
                key={i}
                className="avatar overflow-x-dots"
                src={member.imagePath}
                alt={member.nickname}
              >
                {member.nickname}
              </Avatar>
            })
          }
        </AvatarGroup>
      </div>
      <div className="travel-info subcontent-size content-weight">
        <span className="travel-info-content">
          {travel.info.startDate ? travel.info.startDate : format(new Date(), "yyyy-MM-dd")} ~ {endDate}
        </span>
        {/* <span className="travel-info-content">₩{travel.info.budget}만원</span> */}
      </div>
      <div className="travel-style-container subcontent-size">
        {
          styles.map((style, i) =>
            <span className="travel-style" key={i}>#{style}</span>
          )
        }
      </div>
      <div id="kakao-link-btn" onClick={share}>
        {/* Kakao share button */}
        <span className="subcontent-size">초대하기</span>
        <img
          src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
          alt={"카카오톡 공유하기 버튼"}
        />
      </div>
      <Divider className="divider" />
    </div>
  )
}

export default TravelTitle;