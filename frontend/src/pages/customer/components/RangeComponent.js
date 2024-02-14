import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useDispatch } from 'react-redux';
import { getCommonSearchedProductsSearchBar } from '../../../redux/userHandle';
import { GlobalState } from '../../../utils/Context';

function mapValueToAmount(value) {
  const m = (500000 - 10) / (100 - 1);
  const b = 10 - m;
  const amount = m * value + b;
  return Math.round(amount);
}

export default function RangeSlider() {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState([1, 100]);
  const [amount, setAmount] = React.useState([10, 500000]);
  const { setselectedPrice, selectedPrice, globalApiLink, setGlobalApiLink } = GlobalState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const newAmounts = newValue.map(mapValueToAmount);
    setAmount(newAmounts);
    setselectedPrice(newAmounts); // Assuming this function correctly updates part of the global state
  };

  React.useEffect(() => {
    const cost = selectedPrice?.join("-");
    // Assuming you have a function to update just the cost part of your globalApiLink correctly
    const newGlobalApiLink = updateGlobalApiLinkWithCost(globalApiLink, cost); // Implement this function
    setGlobalApiLink(newGlobalApiLink);
    console.log(newGlobalApiLink);
    if(newGlobalApiLink.toString() !== '&cost='){
      dispatch(getCommonSearchedProductsSearchBar('getProductFilter', newGlobalApiLink));
    }
  }, [selectedPrice, globalApiLink, setGlobalApiLink, dispatch]);

  // A function to correctly update the globalApiLink with the new cost, removing old cost values
  function updateGlobalApiLinkWithCost(apiLink, cost) {
    // Split the existing apiLink by '&' to filter out any existing cost parameter
    const parts = apiLink.split('&').filter(part => !part.startsWith('cost='));
    // Rejoin the parts and append the new cost parameter
    return `${parts.join('&')}&cost=${cost}`;
  }


  return (
    <Box sx={{ width: '95%', zIndex: '1', marginLeft: '8px' }}>
      <Slider
        getAriaLabel={() => 'Price range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        onChangeCommitted={() => setselectedPrice(amount)}
        min={1}
        max={100}
      />
      <Box sx={{ mt: 2 }}>
        ₹{amount[0]} - ₹{amount[1]}
      </Box>
    </Box>
  );
}
