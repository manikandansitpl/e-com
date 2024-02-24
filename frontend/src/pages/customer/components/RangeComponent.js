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

// Wrapping the functional component with React.memo
const RangeSlider = React.memo(() => {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState([1, 100]);
  const [amount, setAmount] = React.useState([10, 500000]);
  const { setselectedPrice, selectedPrice, globalApiLink, setGlobalApiLink } = GlobalState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const newAmounts = newValue.map(mapValueToAmount);
    setAmount(newAmounts);
    setselectedPrice(newAmounts);
  };

  React.useEffect(() => {
    const cost = selectedPrice?.join("-");
    const newGlobalApiLink = updateGlobalApiLinkWithCost(globalApiLink, cost);
    setGlobalApiLink(newGlobalApiLink);
    console.log(newGlobalApiLink);
    if(newGlobalApiLink.toString() !== '&cost='){
      dispatch(getCommonSearchedProductsSearchBar('getProductFilter', newGlobalApiLink));
    }
  }, [selectedPrice]);

  function updateGlobalApiLinkWithCost(apiLink, cost) {
    const parts = apiLink.split('&').filter(part => !part.startsWith('cost='));
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
});

export default RangeSlider;
