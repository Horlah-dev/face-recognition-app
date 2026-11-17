import './ImgLinkForm.css';

function ImageLinkForm({ input, onInputChange, onButtonSubmit }) {
return(
    <div className='head'>
        <p className="linkf">This Magic Brain will detect faces in your pictures. Give it a try</p>
    
    <div className='bar'>
        <input className='txt' type='text' value={input} onChange={onInputChange} placeholder="Paste image URL here" />
        <button className='detect' onClick={onButtonSubmit}>
            Detect
        </button>  
    </div>
    </div>
    );
}

export default ImageLinkForm;