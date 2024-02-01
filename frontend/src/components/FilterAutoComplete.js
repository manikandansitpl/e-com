import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState } from '../utils/Context';
import "./component.css";

function FilterAutocomplete() {
  const { productData } = useSelector(state => state.user);
  const { Brand, setBrand } = GlobalState();
  const [showDropdown, setShowDropdown] = useState(false);
  const [brandArray, setBrandArray] = useState([]);

  useEffect(() => {
    const uniqBrand = [...new Set(productData.map(item => item.brand))];
    setBrand(uniqBrand);
  }, [productData, setBrand]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleCheckBoxChange = (e) => {
    const { value, checked } = e.target;
    setBrandArray(prev => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(item => item !== value);
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }} className='filterComponent'>
      <div  style={{ cursor: 'pointer', userSelect: 'none', position: 'relative' }}>
       <h5 onClick={toggleDropdown}>Select Brands</h5>
        <div style={{ display: showDropdown ? 'block' : 'none', position: 'absolute', zIndex: 100, backgroundColor: '#fff', border: '1px solid #ddd', width: '90%', padding: 10 }}>
          {Brand.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="checkbox"
                id={`checkbox-${i}`}
                value={item}
                onChange={handleCheckBoxChange}
                checked={brandArray.includes(item)}
              />
              <label htmlFor={`checkbox-${i}`} style={{ cursor: 'pointer' }}>{item}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterAutocomplete;
