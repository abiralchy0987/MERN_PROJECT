import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//placing user order for frontend
const placeOrder = async (req, res) => {

    const frontend_Url = process.env.FRONTEND_URL || req.get('origin');
try {
    // use authenticated user id from auth middleware (req.userId)
    const  newOrder = new orderModel({
        userId: req.userId || req.body.userId,
        items: req.body.items,
        amount: req.body.amount,
        address: req.body.address
    })
    await newOrder.save();
    // clear user's cart using authenticated id when available
    await userModel.findByIdAndUpdate(req.userId || req.body.userId,{cartData:{}});

    const line_items = req.body.items.map((item) =>({
        price_data:{
            currency:"inr",
            product_data:{
                name:item.name,
            },
            unit_amount:item.price * 100*80, //converting to paisa
        },
        quantity:item.quantity,
    }))
    line_items.push({
        price_data:{
            currency:"inr",
            product_data:{
                name:"Delivery Charge",
            },
            unit_amount:2 * 100*80, //converting to paisa
        },
        quantity:1,
    })

    const session = await stripe.checkout.sessions.create({
        line_items:line_items,
        mode:'payment',
        // use consistent spelling `success` in query params
        success_url:`${frontend_Url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_Url}/verify?success=false&orderId=${newOrder._id}`
    })
    // return a proper success boolean and status code
    res.status(200).json({success:true, session_url:session.url});
} catch (error) {
    console.log(error);
    // return error status and consistent key name
    res.status(500).json({success:false,message:"Error"});
}
}

const verifyOrder = async(req,res)=>{
    const {orderId, success} = req.body;
    try {
        if(success =="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.status(200).json({success:true,message:"Paid"});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({success:false,message:"Payment failed, order cancelled"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Error verifying payment"});
    }
}

//user order for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.userId || req.userId});
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});   
    }
}

// listing orders for admin panel 
const listOrders = async(req,res)=> {
try {
    const orders= await orderModel.find({});
    res.json({success:true, data:orders})
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
}
}

//api for update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status});
        res.json({success:true,message:"Status updated"});
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"failed updating status"});
    }

}
export {placeOrder, verifyOrder, userOrders , listOrders , updateStatus};