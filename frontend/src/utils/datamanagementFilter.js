
const  DataManagementFilter=(appdata , filterdData ,props)=>{
  const {selectedBrands, selectedColors, selectedRatings, selectedDiscount, selectedPrice,selectedSubCategory} = props;
    let state={
        appdata:appdata,
        filterdData:filterdData,
        props:props,
        filterByBrands:[],
        filterBySubCategory:[],
        filterByColor:[],
        filterByRating:[],
        filterByCost:[],
        
    }

    let globalArray=[]


    function filterBySubCategory(){
        let category = filterdData?.filter(item => props?.selectedSubCategory?.map(b => b.toString().toLowerCase() === item?.subcategory.toString().toLowerCase()))
        globalArray.push(category)
    }

    function filterbyBrand(){
        state.filterByBrands=[];
        let category = filterdData?.filter(item => props?.selectedSubCategory?.map(b => b.toString().toLowerCase() === item?.subcategory.toString().toLowerCase()))
        let brand = category?.filter(item => props?.selectedBrands?.some(b => b.toString().toLowerCase() === item.brand.toString().toLowerCase()))
        globalArray.push(brand)
    }

    function filterbyColor(){
        let category = filterdData?.filter(item => props?.selectedSubCategory?.map(b => b.toString().toLowerCase() === item?.subcategory.toString().toLowerCase()))
        let brand = category?.filter(item => props?.selectedBrands?.some(b => b.toString().toLowerCase() === item.brand.toString().toLowerCase()))
        let color = brand?.filter(item => props?.selectedBrands?.some(b => b.toString().toLowerCase() === item.brand.toString().toLowerCase())).filter(item => props.selectedColors?.some(b => b.toString().toLowerCase() === item.color.toString().toLowerCase()))
        globalArray.push(color)
    }

    function filterCost(){
        let category = filterdData?.filter(item => props?.selectedSubCategory?.map(b => b.toString().toLowerCase() === item?.subcategory.toString().toLowerCase()))
        let brand = category?.filter(item => props?.selectedBrands?.some(b => b.toString().toLowerCase() === item.brand.toString().toLowerCase()))
        let cost = brand?.filter((r)=> r.price.cost >= props?.selectedPrice[0] && r.price.cost <= props?.selectedPrice[1])
        globalArray.push(cost)
    }
    
    function filterbyRating(){
        // let localData = [];
        let category = filterdData?.filter(item => props?.selectedSubCategory?.map(b => b.toString().toLowerCase() === item?.subcategory.toString().toLowerCase()))
        // let brand = category?.filter(item => props?.selectedBrands?.some(b => b.toString().toLowerCase() === item.brand.toString().toLowerCase()));
        // let review = brand?.map(item=> item?.reviews)
        // // let ratings
        // // let final = rating?.filter(item => item?.reviews.filter(t => t?.rating.toString() === props.filterByRating?.toString()))
        // console.log(review);
    }

    // filterbyRating(){
    //             let localData = [];
    //             let category = filterdData?.filter(item => props?.selectedSubCategory?.map(b => b.toString().toLowerCase() === item?.subcategory.toString().toLowerCase()))
    //             let brand = category?.filter(item => props?.selectedBrands?.some(b => b.toString().toLowerCase() === item.brand.toString().toLowerCase()));
    //             let rating = brand?.find(item=> item?.reviews)
    //             // let final = rating?.filter(item => item?.reviews.filter(t => t?.rating.toString() === props.filterByRating?.toString()))
    //         console.log(rating);
        
        
    //         }

  

   if(selectedBrands, selectedColors, selectedRatings, selectedDiscount, selectedPrice,selectedSubCategory){
        filterBySubCategory()
        filterbyBrand()
        filterbyColor()
        filterCost()
        filterbyRating()
    }

return globalArray

} 

export default DataManagementFilter;