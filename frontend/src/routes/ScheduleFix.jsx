import ScheduleItem from "components/Schedule/ScheduleItem"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import "./ScheduleFix.css"
import axios from "axios"
import { useParams } from "react-router-dom"

function ScheduleFix({ newRecommend }) {
  console.log("newRecommend", newRecommend)
  const { travelId } = useParams()
	const travels = useSelector((state) => state.travel.schedules)
	const initial = travels.reduce((acc, value, idx) => {
		acc[idx] = [{...travels[idx][value.length - 1], turn: 100}]
		return acc
	}, {})

	const turns = {}

	travels.forEach((scheduleList, day) => {
		scheduleList.forEach((schedule, turn) => {
			const { scheduleId } = schedule

			turns[scheduleId] = turn
		})
	})

	const [fixedSpots, setFixedSpots] = useState(initial);

	const handleFixedSpots = (selected, travelIdx, payload) => {
		if (selected) {
			setFixedSpots({
				...fixedSpots,
				[travelIdx]: [...fixedSpots[travelIdx], {
					...payload,
					turn: turns[payload.scheduleId]
				}],
			})
		} else {
			let newArr = fixedSpots[travelIdx].filter((item) => {
				return item.scheduleId !== payload
			})
			setFixedSpots({
				...fixedSpots,
				[travelIdx]: newArr,
			})
		}
	}

  const token = useSelector(state => state.auth.token)

  const fetchNewRecommend = async() => {
		console.log(fixedSpots)
    const response = await(axios({
      method: "post",
      url: `https://i7a609.p.ssafy.io/api/v1/schedule/recommend/${travelId}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: fixedSpots
    
    }))
    console.log("재추천 받은 여행", response.data)
  }

  useEffect(() => {
		if (newRecommend) {

			fetchNewRecommend()
		}
  }, [newRecommend])



	return (
		<>
			<p className="subtitle-size text-center" style={{ marginTop: "11vh" }}>
				<span className="color-1">고정</span>하고 싶은 여행지를 선택해주세요
			</p>
			<p className="gray text-center" style={{ margin: "0" }}>
				숙소는 자동으로 고정돼요
			</p>
			<hr />
			{travels.map((travel, travelIdx) => (
				<div key={travelIdx}>
					<p className="content-size text-center">DAY{travelIdx + 1}</p>
					{travel.map((schedule, scheduleIdx) => (
						<ScheduleItem
							key={schedule.scheduleId}
							handleFixedSpots={handleFixedSpots}
							schedule={schedule}
							travelIdx={travelIdx}
							isFirst={scheduleIdx === 0}
							isLast={scheduleIdx === travel.length - 1}
						/>
					))}
				</div>
			))}
		</>
	);
}

export default ScheduleFix
