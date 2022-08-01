import { AvatarGroup, Avatar, Divider } from "@mui/material";

import React, { useState } from "react";
import { getEndDate } from 'components/DateTime/date';

import "./TravelTitle.css"
import "globalStyle.css"

function TravelTitle({ title, members, maxMemberCnt, startDate, periodInDays, budget, styles, joinAddress }) {

    const [ endDate, setEndDate ] = useState(getEndDate(startDate, periodInDays))

    const onClickJoinLinkHandler = e => {
        e.preventDefault()
        if (members.length < maxMemberCnt) {
            console.log("멤버 초대 링크!");
        }
        // 최대 멤버 수를 초과했을 경우, 링크 비활성화
    }

    return (
        <div className="container-title">
            <div className="travel-title">
                <p>{ title }</p>
                <AvatarGroup className="avatar-group" max={4}>
                    {
                        members.map((member, i) => {
                            return <Avatar
                                key={i} 
                                className="avatar"
                                alt={member.nickname} 
                            >
                                {member.nickname}
                            </Avatar>
                        })
                    }
                </AvatarGroup>
            </div>
            <div className="travel-info">
                <p>{startDate} ~ {endDate}</p>
                <p>₩{budget}만원</p>
            </div>
            <div className="travel-style">
                {
                    styles.map((style, i) => 
                        <p key={i}>#{style}</p>
                    )
                }
            </div>
            <div className="travel-link">
                <div onClick={onClickJoinLinkHandler}>
                    <p>초대하기</p>
                    <img
                        src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                        alt={"카카오톡 공유 보내기 버튼" + joinAddress}
                    />
                </div>
            </div>
            <Divider className="divider" />
        </div>
    )
}

export default TravelTitle;