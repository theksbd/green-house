import "./Percent.css";
const Percent = ({data}) => {
    return(
        <div className="circle-out" style={{background: `conic-gradient(#282A35 0 ${data}%, #cbcfda ${data}% ${100-data}%)`}}>
            <div className="circle-inner">
                {data}%
            </div>
        </div>
    );
}

export default Percent;