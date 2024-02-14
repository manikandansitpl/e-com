import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from './Rating';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({product}) {
  const navigation = useNavigate()
  return (
    <Card className='sliderContent' onClick={()=>navigation(`/product/view/${product?._id}`)} sx={{ maxWidth: 200,maxHeight:'100%' ,padding:'10px',borderRadius:'10px',cursor:'pointer'}}>
      <CardMedia
        sx={{ height: 240 }}
        image={product?.productImage}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom  component="div"
         style={{
            display: '-webkit-box',
            WebkitLineClamp: 1, // Limit to two lines
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 'normal', // Adjust based on your typography size to fit exactly two lines
            fontSize:'14px'
          }}
        >
          {product?.productName}
        </Typography>
        <Typography variant="body2" color="text.secondary"
        style={{
            display: '-webkit-box',
            WebkitLineClamp: 2, // Limit to two lines
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 'normal', // Adjust based on your typography size to fit exactly two lines
            fontSize:'13px',
            margin:'3px 0'
          }}
        >
        {product?.description}
        </Typography>
        <Typography variant="body2" style={{display:'flex',justifyContent:'left',alignItems:'center',margin:'3px 0',gap:5}} color="text.secondary">
       <span>Rating :</span>
        <Rating product={product}/>
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <span style={{display:'flex',justifyContent:'space-between'}}>
            <p style={{color:'#212121',fontSize:'16px',fontWeight:'500'}}>{product?.price?.cost}</p>
            <p style={{textDecoration:'line-through',fontSize:"14px",color:'#878787'}}>{product?.price?.mrp}</p>
            <p style={{color: '#388e3c',fontSize:'13px',letterSpacing:'-.2px',fontWeight:'500'}}>{`${product?.price?.discountPercent}% off`}</p>
            </span>
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}