class DataManage{
    constructor(appdata , filterdData ,props){
        this.state={
            appdata:appdata,
            filterdData:filterdData,
            props:props,
            category:"",
            subCategory:[],
            brand:[],
            color:[],
        }
    }


       // Method to update state in an immutable way
       updateState(newState) {
        this.state = { ...this.state, ...newState };
    }
    filterbrand(){
        const {appdata,filterdData,props}=this.state
        let brand =filterdData?.filter(item => item?.brand)
        let brands = [...new Set(brand)]
        this.updateState({brand:brands})
    }
    // .filter(item=>item?.color).map(c=>c?.color)
    filterColor(){
        const {appdata,filterdData,props}=this.state;
        let color =  filterdData
        ?.filter(item => item?.color)
        
        let finalData = [...new Set(color)]
        if(this.state.color.length === 0){
            
        }
        this.updateState({color:finalData})
    }
    filterByCategory(){
        const {appdata,filterdData,props}=this.state;
        let cat = filterdData.map(c=>c.category)
        let uniq = [...new Set(cat)].toString()
        this.updateState({category:uniq})
    }

    filterBySubCategory(){
        const {appdata,filterdData,props}=this.state;
        let subcat = filterdData
        let uniq = [...new Set(subcat)]
        this.updateState({subCategory:uniq})
    }
    globaldata(){
        let promise = new Promise((resolve,reject)=>{
               if(this.state.category){
                resolve(this.state)
               } else{
                reject("somethis went worng !!")
               }
        })

        return promise;
    }
}

export default DataManage;