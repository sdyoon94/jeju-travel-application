import "globalStyle.css"

function TravelTitle({title, date}) {
    return (
        <>
            <h1 className="title-size text-center">{title}</h1>
            <p className="content-size text-center">{date}</p>
        </>
    )
}

export default TravelTitle