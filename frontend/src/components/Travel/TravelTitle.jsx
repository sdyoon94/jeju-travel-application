import { AvatarGroup, Avatar, Divider } from "@mui/material"

import React, { useEffect, useState } from "react"
import { format, addDays } from "date-fns"

import "./TravelTitle.css"
import "globalStyle.css"

const KAKAO_API_KEY = "03817511d5315ef223b0e6861c8f729e"
const STYLE_COUNT = 7
const STYLE_FORMAT = ["식도락", "전통 시장", "포토스팟", "체험/액티비티", "유명관광지", "자연", "여유"]

function TravelTitle({ travel }) {

    const [ styles, setStyles ] = useState([])
    const [ endDate, setEndDate ] = useState(
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
    }, [ travel.info.startDate, travel.info.periodInDays ])

    useEffect(() => {
        if (travel.info.style) {
            const styles_ = []
            for (let i = 0; i < STYLE_COUNT; i++) {
                if (travel.info.style.charAt(i) === '1') {
                    styles_.push(STYLE_FORMAT[i])
                }
            }
            setStyles(styles_)
        }
        else {
            setStyles([ "스타일 없음" ])
        }
    }, [ travel.info.style ])

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
                <span className="title-size overflow-x-dots">{ travel.info.tripName }</span>
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
            <div className="travel-info content-size content-weight">
                <span className="travel-info-content">
                    {travel.info.startDate ? travel.info.startDate : format(new Date(), "yyyy-MM-dd")} ~ {endDate}
                </span>
                <span className="travel-info-content">₩{travel.info.budget}만원</span>
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