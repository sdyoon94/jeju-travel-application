import "./TravelTitle.css"
import "globalStyle.css"
import { ReactComponent as User } from 'assets/user.svg'
import React from "react";

function TravelTitle({ Dummy }) {
    const { title, startDate, periodInDays, profileURL, styles, members, joinAddress, budget } = Dummy;

    return (
        <div className="container-title">
            <div className="travel-profile">
                <img
                    width={"40"}
                    src={profileURL}
                    alt="여행 프로필 이미지"
                />
            </div>
            <div className="travel-title">
                {title}
            </div>
            <div className="travel-edit">
                <a href="./">편집</a>
            </div>
            <div className="travel-date">
                {startDate} ({periodInDays})
            </div>
            <div className="travel-info">
                총 예산: {budget}<br />
                {
                    styles.map((style, i) => 
                        <div className="inline" key={i}>#{style}</div>
                    )
                }
                <div className="inline"> </div>
                <a href="./">더보기</a>
            </div>
            <div className="travel-emoji">
                <User width={20} height={20} display="inline" />{members.length}
                <img
                    width={24}
                    src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                    alt={"카카오톡 공유 보내기 버튼" + joinAddress}
                />
            </div>
        </div>
    )
}

export default TravelTitle;