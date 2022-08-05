import { useState } from "react"
import Header from "components/Header/Header"
import DaumPostcodeEmbed from 'react-daum-postcode'
import "./AddressInput.css"

function AddressInput() {

  const [inputAddress, setInputAddress] = useState("")
  const [addressName, setAddressName] = useState("")

  const handleComplete = (data) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }
    setInputAddress(fullAddress)
    console.log(fullAddress) // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  }

  const handleAddressName= (e) => {
    setAddressName(e.target.value)
  }

  return (
    <>
      <Header style={{ margin: "3vh 4vw"}} />
      <DaumPostcodeEmbed 
        onComplete={handleComplete} 
        autoClose={false}
        style={{height: "53vh", width: "100%", padding: "10px 0"}}
      />
      {
        inputAddress
        ? <div>
            <input 
              className="address-input"
              value={addressName}
              placeholder="장소 이름을 입력하세요."
              onChange={handleAddressName} />
            <p className="content-size address-detail">{inputAddress}</p>
          </div>
        : null
      }
      <button className="place-btn block" style={{margin: "5vh auto"}}>추가하기</button>
    </>
  )
}

export default AddressInput