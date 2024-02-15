import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataManage from "./dataManagement";
import DataManagementFilter from "./datamanagementFilter";
import { setFilteredProductsFilterPage } from "../redux/userSlice";

const ContextProvider = createContext();

const ContextWrapper = ({ children }) => {
    const dispatch = useDispatch();
    const { productData, filteredProducts,filteredProductsfilterPage } = useSelector(state => state.user);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState('');
    const [selectedRatings, setSelectedrating] = useState([]);
    const [selectedDiscount, setselectedDiscount] = useState([]);
    const [selectedSubCategory, setselectedSubCategory] = useState([]);
    const [selectedPrice, setselectedPrice] = useState([]);
    const [globalData, setGlobalData] = useState(null);
    const [globalDataFilter, setGlobalDataFilter] = useState(null);
    const [filterApikey,setfilterdApiKey] = useState("");
    const [globalApiLink,setGlobalApiLink] = useState("");
    const [selectedImageForProductView,setselectedImageForProductView] = useState("");


    let props = {selectedBrands, selectedColors, selectedRatings, selectedDiscount, selectedPrice,selectedSubCategory};
    useEffect(() => {
        setfilterdApiKey([`subcategory=${selectedSubCategory}&brand=${selectedBrands}&color=${selectedColors}`])
        let isMounted = true; 
        // Initialize DataManage with your data
        const dataManager = new DataManage(productData, filteredProducts, props);
        
        // Perform data manipulations
        dataManager.filterbrand();
        dataManager.filterColor();
        dataManager.filterByCategory();
        dataManager.filterBySubCategory();

        const fetchData = async () => {
            try {
                const data = await dataManager.globaldata();
                if (isMounted) setGlobalData(data);
            } catch (error) {
                console.log("Error fetching global data:", error);
            }
        };
    
        fetchData();
        return () => {
            isMounted = false;

        };
       
    }, [productData, filteredProducts, selectedBrands, selectedColors, selectedRatings, selectedDiscount, selectedPrice,filteredProductsfilterPage]);

    // useEffect(()=>{
    //     const state = DataManagementFilter(productData, filteredProducts, props)
    //     setGlobalDataFilter(state?.globalArray);
    //     // console.log(state);
    //     // dispatch(setFilteredProductsFilterPage(state?.globalArray));
    // },[productData, filteredProducts,selectedSubCategory, selectedBrands, selectedColors, selectedRatings, selectedDiscount, selectedPrice])
    
    
    return (
        <ContextProvider.Provider value={{
            selectedBrands, setSelectedBrands,
            selectedColors, setSelectedColors,
            selectedRatings, setSelectedrating,
            selectedDiscount, setselectedDiscount,
            selectedPrice, setselectedPrice,
            globalData, setGlobalData,
            selectedSubCategory, setselectedSubCategory,
            globalDataFilter, setGlobalDataFilter,
            props,
            filterApikey,
            globalApiLink,setGlobalApiLink,
            selectedImageForProductView,setselectedImageForProductView
        }}>
            {children}
        </ContextProvider.Provider>
    );
};

export const GlobalState = () => useContext(ContextProvider);
export default ContextWrapper;
