import React, { useEffect, useRef, useState } from 'react'
import './component.css';
import { useSelector } from 'react-redux';
import Pills from './Pills';

function FilterComponent({ type }) {
    const [searchTerm, setSearchTerm] = useState("")
    const { productData } = useSelector(state => state.user);
    const [selectedProduct, setSelectedProduct] = React.useState('');
    const [selectedProductSet, setSelectedProductSet] = React.useState(new Set());
    const [dropdownShow ,setDropDownShow] =useState(false);
    // const ref = useRef()
    // const [inputValue, setInputValue] = React.useState('');
    const [data, setData] = React.useState([]);

    const uniqueItems = productData.filter((data, index, self) => {
        return (type === 'Category' ?
            self.findIndex((item) => item.category === data.category) === index :
            self.findIndex((item) => item.subcategory === data.subcategory) === index
        );
    });

  
    const handleSelect = (product) => {
        setSelectedProduct([...selectedProduct, product])
        setSelectedProductSet(new Set(selectedProductSet, product?._id))
        setSearchTerm('');
        setData('')
       
        // ref.current.focus()
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && e.target.value === "" && selectedProduct.length > 0) {
            const lastUser = selectedProduct[selectedProduct.length - 1]
            handleRemoverProduct(lastUser)
            setSearchTerm('')
        }
    }
    React.useEffect(() => {
        let result;
        if (type !== 'subcategory') {
            result = uniqueItems?.map(item => item?.category).filter(cat => cat != null);
        } else {
            result = uniqueItems.map(item => item?.subcategory).filter(subcat => subcat != null);
        }

        // Removing duplicates
        const seen = {};
        const uniqueArray = result.filter(item => {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });

        setData(uniqueArray);
    }, [productData]);
    const handleRemoverProduct = (product) => {
        const updatedProduct = selectedProduct.filter((item) => item._id !== product._id)
        setSelectedProduct(updatedProduct)
        const updatedEmail = new Set(selectedProductSet)
        updatedEmail.delete(product?._id)
        setSelectedProductSet(updatedEmail)
    }

    useEffect(() => {
        setData(productData)
    }, [searchTerm])
     
    window.document.body.addEventListener('click',()=>{
        setDropDownShow(false)
     })
    return (
        <div className='user-search-container'>
            <div className='user-search-input'>
                {/* pills */}
                {
                    selectedProduct.length > 0 && selectedProduct?.map((product,i) => {
                        return <Pills key={i} text={product?.productName} image={product?.productImage} onClick={() => handleRemoverProduct(product)} />
                    })
                }

                {/* input */}

                <div>
                    <input onKeyDown={e => handleKeyDown(e)}  type='text' value={searchTerm} onChange={(e) =>{
                         setSearchTerm(e.target.value);
                         setDropDownShow(true)
                         if(searchTerm == ""){
                             setDropDownShow(false)
                         }
                    }} placeholder='Search your category...' />
                    {/* search suggession */}
                    <ul className='search-list'>{data && data.filter(item => item?.productName?.toLowerCase().includes(searchTerm?.toLowerCase()))?.map((product, index) => {
                        return dropdownShow && !selectedProductSet.has(product?._id) ? (
                            <li key={index} onClick={() => handleSelect(product)}>{product?.productName}</li>
                        ) : <></>
                    })}</ul>
                </div>
            </div>
        </div>
    )
}

export default FilterComponent