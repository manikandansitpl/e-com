class ApiFeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    search(){
        let keyword = this.queryString.keyword ? 
        {
            category:{
                $regex:this.queryString.keyword,
                $options:'i'
            }
        } : {}

        this.query.find({...keyword})
        return this
    }

}

module.exports = ApiFeatures;