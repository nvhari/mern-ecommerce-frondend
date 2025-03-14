import React, { useContext, useEffect, useState } from 'react';
import { fetchDataFromApi, postData } from '../../utils/api';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { MdClose } from "react-icons/md";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { MyContext } from "../../App";
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reviews, setReviews] = useState({
        review: "",
        customerRating: 1,
    });
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        } else {
            history("/signIn");
        }

        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/orders?userid=${user?.userId}`).then((res) => {
            setOrders(res);
        });

        context.setEnableFilterTab(false);
    }, []);

    const showProducts = (id) => {
        fetchDataFromApi(`/api/orders/${id}`).then((res) => {
            setIsOpenModal(true);
            setProducts(res.products);
        });
    };

    const handleReviewClick = (product) => {
        setSelectedProduct(product);
        setIsReviewDialogOpen(true);
    };

    const addReview = (e) => {
        e.preventDefault();
    
        const user = JSON.parse(localStorage.getItem("user"));
    
        if (user !== null) {
            if (reviews.review.trim() === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Please add a review.",
                });
                return;
            }
    
            const reviewData = {
                productId: selectedProduct.productId,
                customerName: user.name,
                customerId: user.userId,
                customerRating: reviews.customerRating,
                review: reviews.review,
            };
    
            setIsLoading(true);
    
            postData("/api/productReviews/add", reviewData)
                .then((res) => {
                    console.log("API Response:", res); // Debugging: Log the response
                    setIsLoading(false);
    
                    if (res.success) { // Check for the 'success' field in the response
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: "Review submitted successfully!",
                        });
                        setReviews({
                            review: "",
                            customerRating: 1,
                        });
                        setIsReviewDialogOpen(false);
                    } else {
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: res.message || "Review submitted successfully!", // Use the backend message if available
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error submitting review:", error); // Debugging: Log the error
                    setIsLoading(false);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "An error occurred while submitting the review.",
                    });
                });
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please login first.",
            });
        }
    };

    return (
        <>
            <section className="section">
                <div className='container'>
                    <h2 className='hd'>Orders</h2>

                    <div className='table-responsive orderTable'>
                        <table className='table table-striped table-bordered'>
                            <thead className='thead-light'>
                                <tr>
                                    <th>Order Id</th>
                                    <th>Paymant Id</th>
                                    <th>Products</th>
                                    <th>Name</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                    <th>Pincode</th>
                                    <th>Total Amount</th>
                                    <th>Email</th>
                                    <th>User Id</th>
                                    <th>Order Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders?.length !== 0 && orders?.map((order, index) => (
                                    <tr key={index}>
                                        <td><span className='text-blue fonmt-weight-bold'>{order?.id}</span></td>
                                        <td><span className='text-blue fonmt-weight-bold'>{order?.paymentId}</span></td>
                                        <td>
                                            <span className='text-blue fonmt-weight-bold cursor' onClick={() => showProducts(order?._id)}>
                                                Click here to view
                                            </span>
                                        </td>
                                        <td>{order?.name}</td>
                                        <td>{order?.phoneNumber}</td>
                                        <td>{order?.address}</td>
                                        <td>{order?.pincode}</td>
                                        <td>{order?.amount}</td>
                                        <td>{order?.email}</td>
                                        <td>{order?.userid}</td>
                                        <td>
                                            {order?.status === "pending" ?
                                                <span className='badge badge-danger'>{order?.status}</span> :
                                                <span className='badge badge-success'>{order?.status}</span>
                                            }
                                        </td>
                                        <td>{order?.date?.split("T")[0]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <Dialog open={isOpenModal} className="productModal">
                <Button className='close_' onClick={() => setIsOpenModal(false)}><MdClose /></Button>
                <h4 className="mb-1 font-weight-bold pr-5 mb-4">Products</h4>

                <div className='table-responsive orderTable'>
                    <table className='table table-striped table-bordered'>
                        <thead className='thead-light'>
                            <tr>
                                <th>Product Id</th>
                                <th>Product Title</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>SubTotal</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products?.length !== 0 && products?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.productId}</td>
                                    <td style={{ whiteSpace: "inherit" }}>
                                        <span>{item?.productTitle?.substr(0, 30) + '...'}</span>
                                    </td>
                                    <td>
                                        <div className='img'>
                                            <img src={item?.image} alt={item?.productTitle} />
                                        </div>
                                    </td>
                                    <td>{item?.quantity}</td>
                                    <td>{item?.price}</td>
                                    <td>{item?.subTotal}</td>
                                    <td>
                                        <Button variant="contained" color="primary" onClick={() => handleReviewClick(item)}>
                                            Review
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Dialog>

            {/* Review Dialog */}
            <Dialog open={isReviewDialogOpen} onClose={() => setIsReviewDialogOpen(false)}>
                <DialogTitle>
                    Review Product
                    <Button className='close_' onClick={() => setIsReviewDialogOpen(false)} style={{ float: 'right' }}>
                        <MdClose />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <div className="mb-3">
                        <label className="form-label">Rating</label>
                        <Rating
                            name="simple-controlled"
                            value={reviews.customerRating}
                            onChange={(event, newValue) => {
                                setReviews({ ...reviews, customerRating: newValue });
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Comment</label>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={reviews.review}
                            onChange={(e) => setReviews({ ...reviews, review: e.target.value })}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsReviewDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={addReview} color="primary" disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit Review"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Orders;