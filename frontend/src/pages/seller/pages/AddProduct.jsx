import { useEffect, useState } from 'react';
import { Box, CircularProgress, Stack, TextField } from '@mui/material';
import Popup from '../../../components/Popup';
import { BlueButton } from '../../../utils/buttonStyles';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff, getProducts } from '../../../redux/userHandle';
import altImage from "../../../assets/altimg.png";
import styled from 'styled-components';
import ComboBox from '../../../components/AutoComplete';
import ControllableStates from '../../../components/AutoComplete';

const AddProduct = () => {

  const dispatch = useDispatch();

  const { currentUser, status, response, error } = useSelector(state => state.user);

  const [productName, setProductName] = useState("");
  const [mrp, setMrp] = useState("");
  const [cost, setCost] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productImage1, setProductImage1] = useState("");
  const [productImage2, setProductImage2] = useState("");
  const [productImage3, setProductImage3] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");

  const [brand, setbrand] = useState("");
  const [Size, setSize] = useState("");
  const [type, settype] = useState("");
  const [color, setcolor] = useState("");
  const [AgeGroup, setAgeGroup] = useState("");
  const [title, settitle] = useState("");
  const [rating, setrating] = useState("");
  
  const [ram, setRam] = useState("");
  const [rom, setRom] = useState("");

  const seller = currentUser._id

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const[reloader ,setReloader] =useState(false)



 


  const fields = {
    productName,
    price: {
      mrp: mrp,
      cost: cost,
      discountPercent: discountPercent,
    },
    subcategory,
    productImage,
    productImage1,
    productImage2,
    productImage3,
    category,
    description,
    tagline,
    seller,
    brand,
    Size,
    type,
    color,
    AgeGroup,
    title,
    reviews:[
      {
        rating:Number(rating)
      }
    ]
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    console.log(fields);
    dispatch(addStuff("ProductCreate", fields));
    setTimeout(() => {
      dispatch(getProducts());
      setReloader(!reloader)
    }, 1000);
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, response, error]);

  return (
    <>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '30px',
            width: '100%'
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              {
                productImage
                  ? <ProductImage src={productImage} alt="" />
                  : <ProductImage src={altImage} alt="" />
              }
            </Stack>
            <form onSubmit={submitHandler}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Product Image URL"
                  value={productImage}
                  onChange={(event) => setProductImage(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                   <TextField
                  fullWidth
                  label="Product Image URL 1"
                  value={productImage1}
                  onChange={(event) => setProductImage1(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                   <TextField
                  fullWidth
                  label="Product Image URL 2"
                  value={productImage2}
                  onChange={(event) => setProductImage2(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                    <TextField
                  fullWidth
                  label="Product Image URL 3"
                  value={productImage3}
                  onChange={(event) => setProductImage3(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Product Name"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  multiline
                  label="Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="MRP"
                  value={mrp}
                  onChange={(event) => setMrp(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Cost"
                  value={cost}
                  onChange={(event) => setCost(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                 <TextField
                  fullWidth
                  label="Brand (optional)"
                  value={brand}
                  onChange={(event) => setbrand(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                 <TextField
                  fullWidth
                  label="Size (optional)"
                  value={Size}
                  onChange={(event) => setSize(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                 <TextField
                  fullWidth
                  label="Type (optional)"
                  value={type}
                  onChange={(event) => settype(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Color (optional)"
                  value={color}
                  onChange={(event) => setcolor(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Age Group (optional)"
                  value={AgeGroup}
                  onChange={(event) => setAgeGroup(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="deals title"
                  value={title}
                  onChange={(event) => settitle(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                  <TextField
                  fullWidth
                  label="Rating Optional"
                  placeholder='1 to 5 only'
                  value={rating}
                  type='number'
                  onChange={(event) => {
                    if(event.target.value > 5){
                      setrating(5)
                      alert('5 ratings only allowed')
                    } else{
                      setrating(event.target.value)
                    }
                  }}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Discount Percent"
                  value={discountPercent}
                  onChange={(event) => setDiscountPercent(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                 <TextField
                              fullWidth
                              label="Ram"
                              value={ram}
                              onChange={(event) => setRam(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            
                            <TextField
                              fullWidth
                              label="Internal Memory"
                              value={rom}
                              onChange={(event) => setRom(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                {/* <TextField
                  fullWidth
                  label="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                /> */}
                 <ControllableStates setCategory={setCategory} reloader={reloader} value={category} label="Category" type='Category'/>
                {/* <TextField
                  fullWidth
                  label="Subcategory"
                  value={subcategory}
                  onChange={(event) => setSubcategory(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                /> */}

                <ControllableStates setSubcategory={setSubcategory}  label="Subcategory"
                  value={subcategory} type='subcategory'/>
                <TextField
                  fullWidth
                  type='number'
                  label="Stocks"
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
              <BlueButton
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                type="submit"
                disabled={loader}
              >
                {loader ? <CircularProgress size={24} color="inherit" /> : "Add"}
              </BlueButton>
            </form>
          </div>
        </Box>
      </Box>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddProduct;

const ProductImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 8px;
`;