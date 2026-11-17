import './Rank.css';

function Rank({ name, rank = 0 }){
return(
    <div className='top'>
        <p className="pag">{name}, your current rank:</p>
    <div className=''>
        <p className="rank">#{rank}</p>
    </div>
    </div>
    );
}

export default Rank;