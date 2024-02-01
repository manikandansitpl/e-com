import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'react-redux';


export default function ControllableStates({ type,reloader, value,setSubcategory, setCategory }) {
    const { productData } = useSelector(state => state.user);
    // const [value, setValue] = React.useState('');
    // const [inputValue, setInputValue] = React.useState('');
    const [data, setData] = React.useState([]);

    const uniqueItems = productData.filter((data, index, self) => {
        return (type === 'Category' ?
            self.findIndex((item) => item.category === data.category) === index :
            self.findIndex((item) => item.subcategory === data.subcategory) === index
        );
    });
    
    const handleInputChange = (cat) => {
        console.log(cat)
        if (type === 'Category') {
            if (cat) {
                setCategory(cat)
            }else{
                setCategory("")
            }
        } else {
            if (cat) {
                setSubcategory(cat)
            } else{
                setSubcategory("")
            }
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
    }, [reloader,productData]); // Added uniqueItems as a dependency
    
    return (
        <div>
            <Autocomplete
                value={value || ''}
                onChange={(event, newValue) => {
                    handleInputChange(newValue)
                }}
                inputValue={value}
                onInputChange={(event, newInputValue) => {
                    handleInputChange(newInputValue);
                }}
                id="controllable-states-demo"
                options={data}
                renderInput={(params) => <TextField {...params} label={type} />}
            />
        </div>
    );
}