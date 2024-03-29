import React, { memo, useEffect, useState } from 'react';
import { Box, Grid, Pagination, Accordion, AccordionSummary, AccordionDetails, Typography, Checkbox, useTheme, useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import RangeSlider from '../pages/customer/components/RangeComponent';
import ProductCard from './Cards';
import { getCommonSearchedProductsSearchBar, getSearchedProducts } from '../redux/userHandle';
import { GlobalState } from '../utils/Context';

const ProductsComponent = memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useLocation();
  const itemsPerPage = 9;

  const { productData, filteredProducts, filteredProductsfilterPage } = useSelector(state => state.user);
  const { globalApiLink, setSelectedColors, setSelectedrating, setselectedDiscount, globalData, setselectedSubCategory, selectedColors, setGlobalApiLink } = GlobalState();

  const searchParams = new URLSearchParams(data.search);
  let id = searchParams.get('id');
  let title = searchParams.get('title');
  let product = searchParams.get('product');

  const [currentPage, setCurrentPage] = useState(1);
  const [handleCheckBrand, setHandleCheackBrand] = useState('');
  const [handleCheckSubCategory, setHandleCheackSubcategory] = useState('');
  const [handleCheckRating, setHandleCheackrating] = useState('');
  const [brandList, setBrandList] = useState([]);
  const [currentPageSubCat, setCurrentPageSubCat] = useState("");
  const [currentPageSubBrand, setCurrentPageSubBrand] = useState("");

  useEffect(() => {
    getFilterdProd(id, product);
    dispatch(getSearchedProducts("searchProduct", title));
  }, []);

  const getFilterdProd = (ID, PRODUCT) => {
    console.log(ID, PRODUCT);
    setGlobalApiLink("");
    if (ID || PRODUCT) {
      dispatch(getSearchedProducts("searchProduct", PRODUCT));
      let urlKey = `?title=${title}&subcategory=${PRODUCT}`;
      dispatch(getCommonSearchedProductsSearchBar('getProductFilter', urlKey));
    }
  };

  const clearAll = (value) => {
    if (!value) {
      dispatch(getSearchedProducts("searchProduct", title));
    }
    setHandleCheackSubcategory("");
    setGlobalApiLink("");
    setBrandList([]);
    setSelectedColors("");
    setHandleCheackrating("");
  };

   
  const onBrandSelect = (e, item) => {
    const { value, checked } = e.target;
    setCurrentPageSubBrand(value);
     let updatedBrandList;

     updatedBrandList = [...brandList];

    if (checked) {
      // Add the selected brand if not already in the list
      if (!updatedBrandList.includes(value)) {
        updatedBrandList.push(value);
      }
    } else {
      // Remove the deselected brand from the list
      updatedBrandList = updatedBrandList.filter(brand => brand !== value);
    }
    // Update the state with the new brand list
    setBrandList(updatedBrandList);
    // Construct the URL key with updated brand list
    let urlKey = `?title=${title}&category=${item?.category}&subcategory=${item?.subcategory}&brand=${updatedBrandList.join(',')}`;
    setGlobalApiLink(urlKey)
    dispatch(getCommonSearchedProductsSearchBar('getProductFilter', urlKey));
  };
  
  const handleSubCategory =(e,sub)=>{
    const {value} = e.target;
    clearAll(value)
    let urlKey = `?title=${title}&category=${sub?.category}&subcategory=${sub?.subcategory}`;
    setGlobalApiLink(urlKey);
    dispatch(getCommonSearchedProductsSearchBar('getProductFilter',urlKey));
    setCurrentPageSubCat(value)
    setHandleCheackSubcategory(value);
    setselectedSubCategory([value]);
  }

  const onSelectColors=(e,item)=>{
    const {value , checked} = e.target;
    let brand = [...brandList];
    setSelectedColors(value)
    let urlKey = `?title=${title}&category=${item?.category}&subcategory=${item?.subcategory}&brand=${brand}&color=${value}`;
    setGlobalApiLink(urlKey);
    dispatch(getCommonSearchedProductsSearchBar('getProductFilter',urlKey))
  }
  const onHandlerating=(e)=>{
    const {value , checked} = e.target;
    setHandleCheackrating(value)
    let urlkey = `${globalApiLink}&rating=${value}`;
    dispatch(getCommonSearchedProductsSearchBar('getProductFilter',urlkey))
  }

  // const onDiscountSelect=(e)=>{
  //   const {value , checked} = e.target;
  //   setselectedDiscount(prv=>{
  //     if(checked){
  //       return [...prv ,value]
  //     } else{
  //       return prv.filter(d=>d !==value)
  //     }
  //   })
  // }

  useEffect(()=>{
    getFilterdProd(id ,product);
    // if(filteredProductsfilterPage?.length === 0){
      dispatch(getSearchedProducts("searchProduct", title));
    // }
    // dispatch(getSearchedProducts("searchProduct", title));
  },[])

  return (
 

<>
<Box sx={{ width: '100%' }}>
  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
    {/* Filter Section as an Accordion for Mobile Screens */}
    {isMobile ? (
      <Grid item xs={12}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" gutterBottom>Categories:</Typography>
          <Typography>{globalData?.category}</Typography>

          <Typography variant="h6" gutterBottom>Sub Category:</Typography>
          <Grid xs={12} style={{padding:'10px',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        {/* <SubCategoryFilter/> */}
        {
          globalData?.subCategory && globalData?.subCategory.filter((item,i,self)=>{
           return i === self.findIndex(e => e.subcategory === item.subcategory)
          }).map((sub,i)=>{
           return <Box key={i} style={{display:"flex",justifyContent:"left",alignItems:"center",fontWeight:'400'}}><Checkbox onChange={(e)=>handleSubCategory(e, sub)} value={sub?.subcategory} checked={handleCheckSubCategory === sub?.subcategory}/>{sub?.subcategory ? sub?.subcategory :null}</Box>
          })
        }
      </Grid>

          
          <Typography variant="h6" gutterBottom>Brand:</Typography>
          <Grid xs={12} style={{padding:'10px',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        {
          
          globalData?.brand?.length > 0 && globalData?.brand?.filter(item => item?.subcategory?.toLowerCase() === currentPageSubCat?.toLowerCase())?.filter((item,i,self)=>{
            return i === self.findIndex(b=> b.brand === item.brand)
          }).map((item,i)=>{
            return<Box style={item?{display:'block'}:{display:'none'}} key={i}> <Checkbox checked={brandList?.includes(item?.brand)}  value={item?.brand}  onChange={(e)=>onBrandSelect(e,item)} size="small" /> {item?.brand}</Box>
          }) 
        }
      </Grid>
          
          <Typography variant="h6" gutterBottom>Color:</Typography>
          <Grid xs={12} style={{padding:'10px',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        {
          
          currentPageSubBrand && globalData?.color?.length > 0 &&globalData?.color?.filter((item,i,self)=>{
            return i === self.findIndex(c => c?.color === item?.color)
          }).map((item,i)=>{
            return<Box style={item?{display:'block'}:{display:'none'}} key={i}> <Checkbox value={item?.color} checked={selectedColors === item?.color} onChange={(e)=>onSelectColors(e,item)}  size="small" /> {item?.color ? item?.color :"Select Beand!!"}</Box>
          }) 
        }
      </Grid>
          
          <Typography variant="h6" gutterBottom>Price Range:</Typography>
          <Grid xs={12} style={{padding:'10px',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <RangeSlider/>
      </Grid>

          <Typography variant="h6" gutterBottom>Ratings:</Typography>
          <Grid xs={12} style={{padding:'10px',marginBottom:'10px',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <Box style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:5}}>
          <span><input value={1} checked={Number(handleCheckRating) === 1} onChange={onHandlerating} type='checkbox'/> 1★ & Rating</span>
          <span><input value={2} checked={Number(handleCheckRating) === 2} onChange={onHandlerating} type='checkbox'/> 2★ & Rating</span>
          <span><input value={3} checked={Number(handleCheckRating) === 3} onChange={onHandlerating} type='checkbox'/> 3★ & Rating</span>
          <span><input value={4} checked={Number(handleCheckRating) === 4} onChange={onHandlerating} type='checkbox'/> 4★ & Rating</span>
          <span><input value={5} checked={Number(handleCheckRating) === 5} onChange={onHandlerating} type='checkbox'/> 5★ & Rating</span>
        </Box>
      </Grid>

        </AccordionDetails>
      </Accordion>
    </Grid>
    ) : (
      // Non-mobile Filters Display
      <Grid item xs={12} sm={4} md={3} lg={2} xl={2} style={{borderRight: "1px solid #ccc"}}>
      {/* ///header */}
      <Grid xs={12} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #ccc',padding:'10px',alignItems:'center'}}>
        <Box style={{fontSize:'18px',fontWeight:'700'}}>Filter</Box>
        <Box style={{cursor:'pointer',fontWeight:'500'}} className="from-orange-500" onClick={()=>clearAll()}>clearAll</Box>
      </Grid>

      <Grid xs={12} style={{display:'flex',justifyContent:'left',gap:5,borderBottom:'1px solid #ccc',padding:'10px',alignItems:'center'}}>
        <Box style={{fontSize:'15px',fontWeight:'600'}}>CATEGORIES :</Box>
        <Box style={{fontWeight:'400'}}>{globalData ? globalData?.category :""}</Box>
      </Grid>

      {/* <Grid xs={12} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #ccc',padding:'10px',alignItems:'center'}}>
        <FilterComponent type='Category' clearAll={clearAll}/>
      </Grid> */}
      
      <Grid xs={12} style={{padding:'10px',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <Box style={{fontSize:'15px',fontWeight:'600',marginBottom:'5px'}}>Sub Category :</Box>
        {/* <SubCategoryFilter/> */}
        {
          globalData?.subCategory && globalData?.subCategory.filter((item,i,self)=>{
           return i === self.findIndex(e => e.subcategory === item.subcategory)
          }).map((sub,i)=>{
           return <Box key={i} style={{display:"flex",justifyContent:"left",alignItems:"center",fontWeight:'400'}}><Checkbox onChange={(e)=>handleSubCategory(e, sub)} value={sub?.subcategory} checked={handleCheckSubCategory === sub?.subcategory}/>{sub?.subcategory ? sub?.subcategory :null}</Box>
          })
        }
      </Grid>


      <Grid xs={12} style={{padding:'10px',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <Box style={{fontSize:'15px',fontWeight:'600',marginBottom:'5px'}}>Brand :</Box>
        {/* <FilterAutocomplete title="Brand" /> */}
        {
          
          globalData?.brand?.length > 0 && globalData?.brand?.filter(item => item?.subcategory?.toLowerCase() === currentPageSubCat?.toLowerCase())?.filter((item,i,self)=>{
            return i === self.findIndex(b=> b.brand === item.brand)
          }).map((item,i)=>{
            return<Box style={item?{display:'block'}:{display:'none'}} key={i}> <Checkbox checked={brandList?.includes(item?.brand)}  value={item?.brand}  onChange={(e)=>onBrandSelect(e,item)} size="small" /> {item?.brand}</Box>
          }) 
        }
      </Grid>

      
      <Grid xs={12} style={{padding:'10px',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <Box style={{fontSize:'15px',fontWeight:'600',marginBottom:'5px'}}>Color :</Box>
        {
          
          currentPageSubBrand && globalData?.color?.length > 0 &&globalData?.color?.filter((item,i,self)=>{
            return i === self.findIndex(c => c?.color === item?.color)
          }).map((item,i)=>{
            return<Box style={item?{display:'block'}:{display:'none'}} key={i}> <Checkbox value={item?.color} checked={selectedColors === item?.color} onChange={(e)=>onSelectColors(e,item)}  size="small" /> {item?.color ? item?.color :"Select Beand!!"}</Box>
          }) 
        }
      </Grid>

      
      <Grid xs={12} style={{padding:'10px',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <Box style={{fontSize:'15px',fontWeight:'600',marginBottom:'5px'}}>Price Range :</Box>
        <RangeSlider/>
      </Grid>

      <Grid xs={12} style={{padding:'10px',marginBottom:'10px',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <Box style={{fontSize:'15px',fontWeight:'600',marginBottom:'5px'}}>Ratings :</Box>
        <Box style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:5}}>
          <span><input value={1} checked={Number(handleCheckRating) === 1} onChange={onHandlerating} type='checkbox'/> 1★ & Rating</span>
          <span><input value={2} checked={Number(handleCheckRating) === 2} onChange={onHandlerating} type='checkbox'/> 2★ & Rating</span>
          <span><input value={3} checked={Number(handleCheckRating) === 3} onChange={onHandlerating} type='checkbox'/> 3★ & Rating</span>
          <span><input value={4} checked={Number(handleCheckRating) === 4} onChange={onHandlerating} type='checkbox'/> 4★ & Rating</span>
          <span><input value={5} checked={Number(handleCheckRating) === 5} onChange={onHandlerating} type='checkbox'/> 5★ & Rating</span>
        </Box>
      </Grid>

      {/* <Grid xs={12} style={{padding:'10px',alignItems:'center'}}>
        <Box style={{fontSize:'15px',fontWeight:'600',marginBottom:'5px'}}>Discount :</Box>
        <Box style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:11}}>
          <span><input value={30} onChange={onDiscountSelect} type='checkbox'/> 30% or more</span>
          <span><input value={40} onChange={onDiscountSelect} type='checkbox'/> 40% or more</span>
          <span><input value={50} onChange={onDiscountSelect} type='checkbox'/> 50% or more</span>
          <span><input value={60} onChange={onDiscountSelect} type='checkbox'/> 60% or more</span>
          <span><input value={70} onChange={onDiscountSelect} type='checkbox'/> 70% or more</span>
        </Box>
      </Grid> */}


    </Grid>
    )}

    {/* Product Display Section */}
    <Grid item xs={12} sm={8} md={9} lg={10} xl={10} style={isMobile ? {display: 'flex',justifyContent:"center", gap: 20, flexWrap: 'wrap', paddingTop: '40px'}:{display: 'flex', gap: 20, flexWrap: 'wrap', paddingTop: '40px'}}>
            { filteredProductsfilterPage !== "No products found" ?
              filteredProductsfilterPage?.length > 0 && filteredProductsfilterPage?.map((item,index)=>{
                  return(
                    <>
                    <Grid key={index} >
                       <ProductCard product={item}/>
                    </Grid>
                    </>
                  )
              }) : 
             
                  <>
                  <Grid style={{margin:'10px'}}>
                     <Box style={{fontSize:"17px"}}>{`${filteredProductsfilterPage} !!`}</Box>
                  </Grid>
                  </>
            }
        </Grid>
  </Grid>
</Box>
</>
  )
});

// Custom deep comparison function for ProductsComponent props
const arePropsEqual = (prevProps, nextProps) => {
  // Example deep comparison for productData, filteredProducts, and filteredProductsfilterPage
  // This is a placeholder logic; you might need to adjust based on your actual props and state management
  
  const compareArrays = (arr1, arr2) => {
    if (arr1?.length !== arr2?.length) return false;
    for (let i = 0; i < arr1?.length; i++) {
      if (arr1[i] !== arr2[i]) return false; // This is a shallow comparison; might need deep comparison for objects
    }
    return true;
  };

  // Compare productData
  const isProductDataEqual = compareArrays(prevProps?.productData, nextProps?.productData);
  
  // Compare filteredProducts
  const isFilteredProductsEqual = compareArrays(prevProps?.filteredProducts, nextProps?.filteredProducts);
  
  // Compare filteredProductsfilterPage
  const isFilteredProductsFilterPageEqual = compareArrays(prevProps?.filteredProductsfilterPage, nextProps?.filteredProductsfilterPage);
  
  // If all comparisons are true, then props are equal, no need to re-render
  return isProductDataEqual && isFilteredProductsEqual && isFilteredProductsFilterPageEqual;
};

const Products = memo(ProductsComponent, arePropsEqual);

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