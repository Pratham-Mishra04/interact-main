class APIFeatures{

    constructor(query, queryStr){  //Where query initially is the list of all the objects
        this.query=query,
        this.queryStr=queryStr
    }

    filter(){
    const queryObj = {...this.queryStr}  // cause queryObj=req.query will pass by reference
    const exlcudeFields=['page', 'sort', 'limit', 'fields']
    exlcudeFields.forEach(item=> delete queryObj[item])

    //{duration :{$gte : 5}} means duration greater than equal to 5, and it the url we will write it as ?duration[gte]=5

    // the query set for gte and lte which we get doesnt has $ sign before it, so we have to add it

    let queryString= JSON.stringify(queryObj);
    queryString= queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)  //regex

    this.query=this.query.find(JSON.parse(queryString)) //empty find means get all

    // const query= Tour.find().where('duration').gt(5).where('difficulty').equals('easy')
    return this
    }

    sort(){
        if(this.queryStr.sort){
            const sortBy= this.queryStr.sort.replace(',',' ')
            this.query=this.query.sort(sortBy)  //sort(' price, rating ') this means first by price and then by rating if items have same price
        }
        else this.query=this.query.sort('createdAt')

        return this
    }

    fields(){
        if(this.queryStr.fields){
            const fields= this.queryStr.fields.replace(',',' ')
            this.query=this.query.select(fields) // selects only the specified data i.e " name duration "
          }else this.query=this.query.select('-__v') // exclude __v

        return this
    }

    paginator(){
        const page=this.queryStr.page *1 || 1;
        const limit = this.queryStr.limit *1 || 10;
    
        const skip=(page-1)*limit;
    
        // ?page=2,limit=10 means we have to skip 10 results to get to page 2.
    
        // const totalPages= await Tour.countDocuments();
        // if(skip>=totalPages) throw new Error(" Page Does Not Exist ") // Throwing error will automatically take cursor to catch block
    
        this.query=this.query.skip(skip).limit(limit)

        return this
    }
}

export default APIFeatures