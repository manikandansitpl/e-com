import { Divider, Box, Typography, Button, styled, Container } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/userSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { updateCustomer } from '../redux/userHandle';
import Rating from '../components/Rating';
import Popup from '../components/Popup';

const Slide = memo(({ products, title }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [uniqQuantity, setUniqQuantity] = useState('');

    const { currentUser } = useSelector((state) => state.user);

    const handleRemoveFromCart = async (product) => {
        dispatch(removeFromCart(product));
        let local = await currentUser?.cartDetails.find((item) => item?._id?.toString() === product?._id?.toString())
        setUniqQuantity(local)
    };

    const handleAddToCart = async (product,productQuantity) => {
        let stockCompare = Number(product.tagline) >= productQuantity+1 
        if(stockCompare){
            dispatch(addToCart(product));
            let local = await currentUser?.cartDetails.find((item) => item?._id?.toString() === product?._id?.toString())
            await setUniqQuantity(local)
        }else{
            setMessage('out of Stock!!')
            setShowPopup(true)
        }

        setTimeout(() => {
            setShowPopup(false)
        }, 4000);
    };


    const productBuyingHandler = (id) => {
        dispatch(updateCustomer(currentUser, currentUser._id));
        navigate(`/product/buy/${id}`)
    }

    // const totalQuantity = cartDetails.reduce((total, item) => total + item.quantity, 0);
    // const totalOGPrice = cartDetails.reduce((total, item) => total + (item.quantity * item.price.mrp), 0);
    // const totalNewPrice = cartDetails.reduce((total, item) => total + (item.quantity * item.price.cost), 0);
    return (
        <>
        <Component>
            <Deal>
                <DealText>{title}</DealText>

                <ViewAllButton
                    variant="contained"
                    onClick={() => { navigate("/Products") }}
                >
                    View All
                </ViewAllButton>
            </Deal>

            <Divider />

            <Carousel
                swipeable={false}
                draggable={false}
                responsive={responsive}
                centerMode={true}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={10000}
                keyBoardControl={true}
                showDots={false}
                containerClass="carousel-container"
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px">
                {
                    products.map((product, index) => {
                        // Find the product in the cart and get its quantity, default to 0 if not found
                        const productInCart = currentUser?.cartDetails?.find(item => item?._id === product?._id);
                        const productQuantity = productInCart ? productInCart?.quantity : 0;

                        return (
                            <Box key={index}>
                                <Box className='sliderContent' textAlign="center" style={{ padding: '25px 15px' }}>
                                    <Link to={`/product/view/${product._id}`} style={{ textDecoration: 'none' }}>
                                        <Image src={product.productImage} />
                                        <TitleText style={{ fontWeight: 600, color: '#212121' }}>{product.productName}</TitleText>
                                        <TextContainer>
                                            <Text style={{ color: '#525050', textDecoration: "line-through" }}>{product.price.mrp}</Text>
                                            <Text>₹{product.price.cost}</Text>
                                            <Text style={{ color: 'green' }}>{product.price.discountPercent}</Text>
                                        </TextContainer>
                                    </Link>


                                    <Box style={{ display: "flex", justifyContent: 'space-around', alignItems: 'center', marginBottom: "5px" }}>
                                        <Rating product={product}/>
                                        <Text style={{ color: '#212121', opacity: '.6' }}>{`${product.tagline} Stocks`}</Text>
                                    </Box>

                                    <Box style={{ display: "flex", justifyContent: "space-around", alignItems: 'center' }}>
                                        <Button disabled={productQuantity >= 1 ? false : true} onClick={() => productBuyingHandler(product._id)} variant="contained" size='small'>BUY</Button>
                                        <RemoveShoppingCartIcon style={{ cursor: 'pointer' }} color='#f44336' onClick={() => handleRemoveFromCart(product)} />
                                        <span style={{ width: '10px', height: '10px', color: 'red', paddingBottom: '5%' }}>{productQuantity}</span>
                                        <AddShoppingCartIcon style={{ cursor: 'pointer' }} color='primary' onClick={() => handleAddToCart(product,productQuantity)} />
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })
                }

            </Carousel>
        </Component>
        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
})

export default Slide;

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    }
};

const Component = styled(Box)`
    margin-top: 10px;
    background: #FFFFFF;
`;

const Deal = styled(Box)`
    display: flex;    
    padding: 15px 20px;
`

const DealText = styled(Typography)`
    font-size: 22px;
    font-weight: 600;
    line-height: 32px;
    margin-right: 25px;
`

const ViewAllButton = styled(Button)`
    margin-left: auto;
    background-color: #4d1c9c;
    border-radius: 2px;
    font-size: 13px;
    &:hover {
      background-color: #7a1ccb;
    }
`;

const Image = styled('img')({
    width: 'auto',
    height: 150
})

const TitleText = styled(Typography)`
    font-size: 14px;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Text = styled(Typography)`
    font-size: 14px;
    margin-top: 5px
`

const TextContainer = styled(Container)`
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
    margin: 8px;
`;