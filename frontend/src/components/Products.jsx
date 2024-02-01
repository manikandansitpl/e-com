import React, { useState } from 'react';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import { BasicButton } from '../utils/buttonStyles';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';
import { addStuff } from '../redux/userHandle';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ControllableStates from './AutoComplete';
import FilterComponent from './FilterComponent';
import RangeSlider from '../pages/customer/components/RangeComponent';
import FilterAutocomplete from './FilterAutoComplete';

const Products = ({ productData }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const itemsPerPage = 9;

  const { currentRole, responseSearch } = useSelector(state => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [category, setGategory] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddToCart = (event, product) => {
    event.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleUpload = (event, product) => {
    event.stopPropagation();
    console.log(product);
    dispatch(addStuff("ProductCreate", product));
  };

  const messageHandler = (event) => {
    event.stopPropagation();
    setMessage("You have to login or register first")
    setShowPopup(true)
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // if (responseSearch) {
  //   return <div>Product not found</div>;
  // }
  
  const clearAll =()=>{
        console.log(currentItems)
  }


  


  return (
    <>
    <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} lg={2} md={2} xl={2}>
          {/* ///header */}
          <Grid xs={12} style={{display:'flex',justifyContent:'space-between',padding:'10px',alignItems:'center'}}>
            <Box style={{fontSize:'18px',fontWeight:'700'}}>Filter</Box>
            <Box style={{cursor:'pointer',fontWeight:'500'}} onClick={()=>clearAll()}>clearAll</Box>
          </Grid>

          <Grid xs={12} style={{display:'flex',justifyContent:'space-between',padding:'10px',alignItems:'center'}}>
            <Box style={{fontSize:'15px',fontWeight:'600'}}>CATEGORIES</Box>
          </Grid>

          <Grid xs={12} style={{display:'flex',justifyContent:'space-between',padding:'10px',alignItems:'center'}}>
            <FilterComponent type='Category' clearAll={clearAll}/>
          </Grid>

          <Grid xs={12} style={{padding:'10px',alignItems:'center'}}>
            <Box style={{fontSize:'15px',marginBottom:'5px'}}>Price Range :</Box>
            <RangeSlider/>
          </Grid>

          <Grid xs={12} style={{padding:'10px',alignItems:'center'}}>
            <Box style={{fontSize:'15px',marginBottom:'5px'}}>Brand :</Box>
            <FilterAutocomplete/>
          </Grid>

        </Grid>
        <Grid item xs={10}>
          
        </Grid>
      </Grid>
    </Box>
      {/* <ProductGrid container >
        {currentItems.map((data, index) => (
          <Grid item xs={12} sm={2} md={6} lg={4}
            key={index}
            onClick={() => navigate("/product/view/" + data._id)}
            sx={{ cursor: "pointer" }}
          >
            <ProductContainer>
              <ProductImage src={data.productImage} />
              <ProductName>{data.productName}</ProductName>
              <PriceMrp>{data.price.mrp}</PriceMrp>
              <PriceCost>₹{data.price.cost}</PriceCost>
              <PriceDiscount>{data.price.discountPercent}% off</PriceDiscount>
              <AddToCart>
                {currentRole === "Customer" &&
                  <>
                    <BasicButton
                      onClick={(event) => handleAddToCart(event, data)}
                    >
                      Add To Cart
                    </BasicButton>
                  </>
                }
                {currentRole === "Shopcart" &&
                  <>
                    <BasicButton
                      onClick={(event) => handleUpload(event, data)}
                    >
                      Upload
                    </BasicButton>
                  </>
                }
                {currentRole === null &&
                  <>
                    <BasicButton
                      onClick={messageHandler}
                    >
                      Add To Cart
                    </BasicButton>
                  </>
                }

              </AddToCart>
            </ProductContainer>
          </Grid>
        ))}
      </ProductGrid>

      <Container sx={{ mt: 10, mb: 10, display: "flex", justifyContent: 'center', alignItems: "center" }}>
        <Pagination
          count={Math.ceil(productData.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="secondary"
        />
      </Container>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} /> */}
    </>
  )
};

export default Products;

// const ProductContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 16px;
// `;

// const ProductGrid = styled(Grid)`
//   display: flex;
//   align-items: center;
// `;

// const ProductImage = styled.img`
//   width: 200px;
//   height: auto;
//   margin-bottom: 8px;
// `;

// const ProductName = styled.p`
//   font-weight: bold;
//   text-align: center;
// `;

// const PriceMrp = styled.p`
//   margin-top: 8px;
//   text-align: center;
//   text-decoration: line-through;
//   color: #525050;
// `;

// const PriceCost = styled.h3`
//   margin-top: 8px;
//   text-align: center;
// `;

// const PriceDiscount = styled.p`
//   margin-top: 8px;
//   text-align: center;
//   color: darkgreen;
// `;

// const AddToCart = styled.div`
//   margin-top: 16px;
// `;