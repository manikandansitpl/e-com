import ReactStars from "react-rating-stars-component";
import React from "react";
 
const ratingChanged = (newRating) => {
  console.log(newRating);
};

function Rating({product}) {
  let rating = product?.reviews[0]?.rating || 0;
  return (
    <ReactStars
    count={rating}
    value={rating}
    onChange={ratingChanged}
    size={18}
    activeColor= "#FED600" 
  />
  )
}

export default Rating;