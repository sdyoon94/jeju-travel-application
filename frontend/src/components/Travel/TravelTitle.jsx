import { AvatarGroup, Avatar, Divider } from "@mui/material"

import React, { useEffect, useState } from "react";
import { getEndDate } from 'components/DateTime/date'

import "./TravelTitle.css"
import "globalStyle.css"
import { useSelector } from "react-redux";

const KAKAO_API_KEY = "03817511d5315ef223b0e6861c8f729e"

function TravelTitle() {

    const travel = useSelector((state) => state.travel)

    // Title에서 사용되는 여행 관련 정보
    const [ title ] = useState("여행 제목이 길어지면 어떻게 될까 ㅎㅎ;")
    const [ members ] = useState(travel.members)
    // const [ maxMemberCnt ] = useState(travel.maxMemberCnt)
    const [ startDate ] = useState(travel.startDate)
    const [ periodInDays ] = useState(travel.periodInDays)
    const [ budget ] = useState(travel.budget)
    const [ styles ] = useState(travel.styles)

    // 여행 끝 일자
    const [ endDate, setEndDate ] = useState(getEndDate(startDate, periodInDays))

    useEffect(() => {
        setEndDate(getEndDate(startDate, periodInDays))
    }, [ startDate ])

    // 여행 참여 링크
    const joinUrl = "http://localhost:3000"

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
        window.Kakao.Share.sendDefault({
            objectType: 'text',
            text:
              '기본 템플릿으로 제공되는 텍스트 템플릿은 텍스트를 최대 200자까지 표시할 수 있습니다. 텍스트 템플릿은 텍스트 영역과 하나의 기본 버튼을 가집니다. 임의의 버튼을 설정할 수도 있습니다. 여러 장의 이미지, 프로필 정보 등 보다 확장된 형태의 카카오톡 공유는 다른 템플릿을 이용해 보낼 수 있습니다.',
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
                <span className="title-size overflow-x-dots">{ title }</span>
                <AvatarGroup className="avatar-group" max={4}>
                    {
                        members.map((member, i) => {
                            return <Avatar
                                key={i} 
                                className="avatar overflow-x-dots"
                                alt={member.nickname} 
                            >
                                {member.nickname}
                            </Avatar>
                        })
                    }
                </AvatarGroup>
            </div>
            <div className="travel-info content-size content-weight">
                <span className="travel-info-content">{startDate} ~ {endDate}</span>
                <span className="travel-info-content">₩{budget}만원</span>
            </div>
            <div className="travel-style-container content-size">
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