import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import styled from 'styled-components';
// import { BasicButton } from '../utils/buttonStyles';
import { getProductDetails, updateCustomer, updateStuff } from '../redux/userHandle';
import { Avatar, Card, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { generateRandomColor, timeAgo } from '../utils/helperFunctions';
import { MoreVert } from '@mui/icons-material';
import Magnifire from '../components/Magnifire';
import ImageList from '../components/ImageList';
import { GlobalState } from '../utils/Context';
import StarIcon from '@mui/icons-material/Star';

const ViewProduct = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate()
    const productID = params.id;
    const { selectedImageForProductView,setselectedImageForProductView } = GlobalState();

    const { currentUser, currentRole, productDetails, loading, responseDetails } = useSelector(state => state.user);

  
    const [anchorElMenu, setAnchorElMenu] = useState(null);

    const handleOpenMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    const deleteHandler = (reviewId) => {
        const fields = { reviewId };

        dispatch(updateStuff(fields, productID, "deleteProductReview"));
    };

    const productBuyingHandler = (id) => {
        dispatch(updateCustomer(currentUser, currentUser._id));
        navigate(`/product/buy/${id}`)
    }

    useEffect(() => {
        dispatch(getProductDetails(productID));
    }, [productID, dispatch]);
    

    const reviewer = currentUser && currentUser._id

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {
                        responseDetails ?
                            <div>Product not found</div>
                            :
                            <>
                                <ProductContainer>
                                    <ImageContainer>
                                        <InnerImageContainer>
                                        <ImageList productDetails={productDetails} />
                                        <Magnifire image={selectedImageForProductView} />
                                        </InnerImageContainer>

                                {
                                    currentRole === "Customer" &&
                                    <ButtonMainContainer>
                                        <ButtonContainer>
                                            <BasicButton
                                                onClick={() => dispatch(addToCart(productDetails))}
                                            >
                                                Add to Cart
                                            </BasicButton>
                                        </ButtonContainer>

                                        <ButtonContainer>
                                            <BasicButton
                                                 onClick={() => productBuyingHandler(productDetails._id)}
                                            >
                                               Buy
                                            </BasicButton>
                                        </ButtonContainer>
                                    </ButtonMainContainer>
                                }
                                    </ImageContainer>
                                    {/* <ProductImage  alt={productDetails && productDetails.productName} /> */}
                                    <ProductInfo>
                                        <ProductName>{productDetails && productDetails.productName}</ProductName>
                                        <ProductRatingsReview>4.4 &#9733;</ProductRatingsReview>
                                        <PriceContainer>
                                            <PriceCost>₹{productDetails && productDetails.price && productDetails.price.cost}</PriceCost>
                                            <PriceMrp>₹{productDetails && productDetails.price && productDetails.price.mrp}</PriceMrp>
                                            <PriceDiscount>{productDetails && productDetails.price && productDetails.price.discountPercent}% off</PriceDiscount>
                                        </PriceContainer>
                                        <Description>{productDetails && productDetails.description}</Description>
                                        <ProductDetails>
                                            {/* <p>Category: {productDetails && productDetails.category}</p> */}
                                            {/* <p>Subcategory: {productDetails && productDetails.subcategory}</p> */}
                                        </ProductDetails>
                                        <Ram>Ram : 
                                            <RamBox>{productDetails?.ram}gb</RamBox>
                                        <RamBox>16gb</RamBox>
                                        </Ram>

                                        <Rom>Internal Storage : 
                                            <RomBox>{productDetails?.rom}gb</RomBox>
                                        <RamBox>256gb</RamBox>
                                        </Rom>

                                        <Color>Color : 
                                            <ColorBox>{productDetails?.color}</ColorBox>
                                        <ColorBox>blue</ColorBox>
                                        </Color>

                                    </ProductInfo>
                                </ProductContainer>

                            
                                <ReviewWritingContainer>
                                    <Typography variant="h4">Reviews</Typography>
                                </ReviewWritingContainer>

                                {productDetails.reviews && productDetails.reviews.length > 0 ? (
                                    <ReviewContainer>
                                        {productDetails.reviews.map((review, index) => (
                                            <ReviewCard key={index}>
                                                <ReviewCardDivision>
                                                    <Avatar sx={{ width: "60px", height: "60px", marginRight: "1rem", backgroundColor: generateRandomColor(review._id) }}>
                                                        {String(review?.reviewer?.name).charAt(0)}
                                                    </Avatar>
                                                    <ReviewDetails>
                                                        <Typography variant="h6">{review?.reviewer?.name}</Typography>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>

                                                            <Typography variant="body2">
                                                                {timeAgo(review.date)}
                                                            </Typography>
                                                        </div>
                                                        <Typography variant="subtitle1">Rating: {review.rating}</Typography>
                                                        <Typography variant="body1">{review?.comment}</Typography>
                                                    </ReviewDetails>
                                                    {review?.reviewer?._id === reviewer &&
                                                        <>
                                                            <IconButton onClick={handleOpenMenu} sx={{ width: "4rem", color: 'inherit', p: 0 }}>
                                                                <MoreVert sx={{ fontSize: "2rem" }} />
                                                            </IconButton>
                                                            <Menu
                                                                id="menu-appbar"
                                                                anchorEl={anchorElMenu}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'left',
                                                                }}
                                                                keepMounted
                                                                transformOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'left',
                                                                }}
                                                                open={Boolean(anchorElMenu)}
                                                                onClose={handleCloseMenu}
                                                                onClick={handleCloseMenu}
                                                            >
                                                                <MenuItem onClick={() => {
                                                                    handleCloseMenu()
                                                                }}>
                                                                    <Typography textAlign="center">Edit</Typography>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => {
                                                                    deleteHandler(review?._id)
                                                                    handleCloseMenu()
                                                                }}>
                                                                    <Typography textAlign="center">Delete</Typography>
                                                                </MenuItem>
                                                            </Menu>
                                                        </>
                                                    }
                                                </ReviewCardDivision>
                                            </ReviewCard>
                                        ))}
                                    </ReviewContainer>
                                )
                                    :
                                    <ReviewWritingContainer>
                                        <Typography variant="h6">No Reviews Found. Add a review.</Typography>
                                    </ReviewWritingContainer>
                                }
                            </>
                    }
                </>
            }
        </>
    );
};

export default ViewProduct;

const ProductContainer = styled.div`
    display: flex;
    margin: 20px;
    justify-content: center;
    align-items: center;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ImageContainer = styled.div`
display:flex;
flex-direction:column;
justify-content:space-around;
align-items:center;
height:auto
`
const InnerImageContainer= styled.div`
display:flex;
@media (max-width: 768px) {
    flex-direction: column-reverse;
}
`

const ProductImage = styled.img`
    max-width: 300px;
    /* width: 50%; */
    margin-bottom: 20px;
`;

const ProductInfo = styled.div`
    display: flex;
    flex-direction: column;
    width:60%
    @media (max-width: 768px) {
        width:100%;
    }
`;

const ProductName = styled.h1`
    font-size: 24px;
`;

const PriceContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
`;
// const MagnifyContainer = styled.div`
//   position:absolute;
//   left:0
//   `

const PriceMrp = styled.p`
    margin-top: 8px;
    text-decoration: line-through;
    color: #525050;
`;

const PriceCost = styled.h3`
    margin-top: 8px;
`;

const PriceDiscount = styled.p`
    margin-top: 8px;
    color: darkgreen;
`;

const Description = styled.p`
    margin-top: 16px;
`;

const ProductDetails = styled.div`
    margin: 16px;
`;

const ButtonContainer = styled.div`
    margin: 16px;
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

const ReviewWritingContainer = styled.div`
    // margin: 6rem;
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    flex-direction:column;
`;

const ReviewContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ReviewCard = styled(Card)`
  && {
    background-color: white;
    margin-bottom: 2rem;
    padding: 1rem;
  }
`;

const ReviewCardDivision = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewDetails = styled.div`
  flex: 1;
`;

const ProductRatingsReview = styled.label`
line-height: normal;
display: inline-block;
color: #fff;
padding: 2px 4px 2px 6px;
border-radius: 3px;
font-weight: 500;
font-size: 12px;
vertical-align: middle;
background-color: #388e3c;
width:fit-content;
`
const Ram = styled.div`
 display:flex;
 flex-direction:row;
 align-items:center;
 gap:5;
 margin-bottom:10px;
`
const RamBox = styled.div`
border : 1px solid silver;
width:fit-content;
padding:5px;
margin-left:5px;
cursor:pointer;
`
const Rom = styled.div`
 display:flex;
 flex-direction:row;
 align-items:center;
 gap:5;
`
const RomBox = styled.div`
border : 1px solid silver;
width:fit-content;
padding:5px;
margin-left:5px;
cursor:pointer;
`
const Color = styled.div`
 display:flex;
 flex-direction:row;
 align-items:center;
 gap:5;
 margin-top:10px;
`
const ColorBox = styled.div`
border : 1px solid silver;
width:fit-content;
padding:5px;
margin-left:5px;
cursor:pointer;
`

const ButtonMainContainer = styled.div`
display:flex;
margin-left: 100px;
display:flex;
@media (max-width: 768px) {
    width:100%;
}
`
const BasicButton = styled.button`
  && {
    background-color: #4d1c9c;
    padding:5px 7px;
    width:100px;
    font-size:14px;
    font-weight:600;
    border-radius:5px;
    color: #fff;
    &:hover {
      background-color: #7a1ccb;
      cursor:pointer;
    }
  }
`;