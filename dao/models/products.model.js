import mongoose from 'mongoose';

const collection = 'products';

const productoschema = mongoose.Schema({
   
    id:Number,
    title:{type:String, required: true},
    description:{type:String, required: true},
    price: {type:Number, required: true},
    thumbnail: {type:String, required: true},
    code: {type:Number, required: true},
    stock : {type:Number, required: true},
    status:Boolean,
    category:{type:String, required: true},
  

})

const productModel = mongoose.model(collection,productoschema);

export default productModel;