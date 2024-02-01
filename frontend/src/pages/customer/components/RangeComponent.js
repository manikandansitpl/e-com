import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}°C`;
}

// Function to map slider value to monetary amount without decimals
function mapValueToAmount(value) {
  // Assuming the mapping is linear: 1 -> 10 rupees, 100 -> 500,000 rupees
  const m = (500000 - 10) / (100 - 1);
  const b = 10 - m;
  const amount = m * value + b;
  // Round the amount to the nearest whole number to avoid decimals
  return Math.round(amount);
}

export default function RangeSlider() {
  const [value, setValue] = React.useState([1, 100]);
  const [amount, setAmount] = React.useState([10, 500000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Map the new slider values to amounts and round them to avoid decimals
    const newAmounts = newValue.map(mapValueToAmount);
    setAmount(newAmounts);
    console.log(newValue, newAmounts);
  };

  return (
    <Box sx={{ width: '100%', zIndex: '1' }}>
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        min={1}
        max={100}
      />
      <Box sx={{ mt: 2 }}>
         ₹{amount[0]} - ₹{amount[1]}
      </Box>
    </Box>
  );
}
