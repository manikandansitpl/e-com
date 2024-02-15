import React, { useEffect } from 'react'
import styled from 'styled-components';
import { GlobalState } from '../utils/Context';

function ImageList({productDetails}) {
    const {setselectedImageForProductView,selectedImageForProductView} = GlobalState();
    useEffect(()=>{
        setselectedImageForProductView(productDetails?.productImage)
    },[productDetails?.productImage])
  return (
    <ImageContainer>
        {productDetails?.productImage  &&  <ImageComponent src={productDetails?.productImage} onClick={()=>setselectedImageForProductView(productDetails?.productImage)}/>}
        {productDetails?.productImage1 && <ImageComponent src={productDetails?.productImage1} onClick={()=>setselectedImageForProductView(productDetails?.productImage1)}/>}
        {productDetails?.productImage2 && <ImageComponent src={productDetails?.productImage2} onClick={()=>setselectedImageForProductView(productDetails?.productImage2)}/>}
        {productDetails?.productImage3 && <ImageComponent src={productDetails?.productImage3} onClick={()=>setselectedImageForProductView(productDetails?.productImage3)}/>}
    </ImageContainer>
  )
}

export default ImageList;

const ImageContainer = styled.div`
display:flex;
flex-direction:column
`
const ImageComponent = styled.img`
width:100px;
height:100px;
margin-top:5px;

&:hover{
    border:1px solid blue;
    margin-top:5px;
}
`