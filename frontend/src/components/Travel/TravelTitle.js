import "./TravelTitle.css"
import "globalStyle.css"
import { ReactComponent as User } from 'assets/user.svg'
import React from "react";

function TravelTitle({ title, startDate, profileURL, styles, members, joinLink, budget }) {

    return (
        <div className="container-title">
            <div className="travel-profile">
                <img
                    width={"40"}
                    src="./icons/plane.png"
                    alt="여행 프로필 이미지"
                />
            </div>
            <div className="travel-title">
                여행 제목
            </div>
            <div className="travel-edit">
                <a href="./">편집</a>
            </div>
            <div className="travel-date">
                22.07.14 ~ 22.07.17
            </div>
            <div className="travel-info">
                총 예산: 100만원<br />
                #액티비티 #식도락 <a href="./">더보기</a>
            </div>
            <div className="travel-emoji">
                <User width={20} height={20} display="inline" />3
                <img
                    width={24}
                    src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                    alt="카카오톡 공유 보내기 버튼"
                />
            </div>
        </div>
    )
}

export default TravelTitle;