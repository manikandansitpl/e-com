import React from 'react'
import "./component.css"
import CloseIcon from '@mui/icons-material/Close';

function Pills({onClick ,text,image}) {
  let alternate = text?.split(" ")[0]
  return (
    <span className='user-pill' onClick={onClick}>
        {/* <image src={image} alt={text}/> */}
        <span>{alternate ? alternate : text}<CloseIcon style={{height:'15px',width:'15px',marginTop:'4px'}}/></span>
    </span>
  )
}

export default Pills