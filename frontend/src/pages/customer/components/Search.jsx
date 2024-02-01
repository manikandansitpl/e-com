import React, { useState, useEffect, useRef } from 'react';
import { InputBase, Box, styled, Paper, List, ListItem, ListItemText, CircularProgress, ListItemAvatar, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchedProducts } from '../../../redux/userHandle';

const Search = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const { filteredProducts } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null); // Create a ref for the dropdown

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                console.log('text')
                setLoading(true);
                dispatch(getSearchedProducts("searchProduct", searchTerm));
                setShowDropdown(true);
                setLoading(false);
            } else {
                setShowDropdown(false);
            }
            
        }, 500); // Debounce delay for 500ms

        return () => {
            clearTimeout(delayDebounceFn);
        };
    }, [searchTerm]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        // Add event listener to the document
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Function to close the dropdown
        function closeDropdown() {
            setShowDropdown(false);
        }
        // Call closeDropdown whenever the location changes
        closeDropdown();
        // Optional: Add an event listener for the 'popstate' event
        window.addEventListener('popstate', closeDropdown);
        return () => {
            // Clean up the event listener
            window.removeEventListener('popstate', closeDropdown);
        };
    }, [location]); // Dependency array includes location


    const handleSearch = (Product) => {
        setShowDropdown(false);
        setSearchTerm('')
        if(Product){
            dispatch(getSearchedProducts("searchProduct", Product));
            if (location.pathname !== "/ProductSearch") {
                navigate("/ProductSearch");
                setShowDropdown(false);
            }
        }else{
            dispatch(getSearchedProducts("searchProduct", searchTerm));
            if (location.pathname !== "/ProductSearch") {
                navigate("/ProductSearch");
            }
        }
       
    };

    return (
        <SearchContainer>
            <InputSearchBase
                placeholder="Search for products, brands and more"
                value={searchTerm}
                onChange={(e) => {
                    if (e.target.value) {
                        setSearchTerm(e.target.value)
                        dispatch(getSearchedProducts("searchProduct", e.target.value));
                    } else {
                        setSearchTerm("")
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <SearchIconWrapper onClick={handleSearch}>
                <SearchIcon sx={{ color: "#4d1c9c" }} />
            </SearchIconWrapper>
            {showDropdown && (
                <Dropdown ref={dropdownRef}>
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <List>
                            {filteredProducts?.map((result, index) => (
                                <ListItem button key={index} onClick={() => {
                                    setSearchTerm(result.productName);
                                    handleSearch(result.productName);
                                }}>
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={result.productName}
                                            src={result.productImage}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={result.productName} secondary={result.category}/>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Dropdown>
            )}
        </SearchContainer>
    );
};


const SearchContainer = styled(Box)`
  position: relative;
  border-radius: 2px;
  margin-left: 10px;
  width: 100%; // Make width responsive
  max-width: 600px; // Max width for larger screens
  background-color: #fff;
  display: flex;
  align-items: center;
`;

const SearchIconWrapper = styled(Box)`
  margin-left: auto;
  padding: 5px;
  display: flex;
  cursor: pointer;
`;

const InputSearchBase = styled(InputBase)`
  font-size: unset;
  width: 100%;
  padding-left: 20px;
`;

const Dropdown = styled(Paper)`
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  top: 100%;
  z-index: 2; // Ensure it's above other content
  border: 1px solid #ddd;
  border-top: none;
`;

export default Search;
