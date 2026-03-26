**Module 5 & 10 — Order Placement**  
**Summary for Teammates**  
**Author:** Module 5 (Backend) + Module 10 (Frontend)  
   
 **Depends on:** Module 4 (Cart), Module 2 (Auth), Module 11 (DB schema)  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSPBCj7fFwtCmJHAjAU2QtIq6DIzW7UHAMBfnGt1V8fHEQAA3rsexOkF3va0dq8AAAAASUVORK5CYII=)  
**What Was Built**  
**Module 5 — Backend: Order Placement Logic**  
Three new files were added to the backend:  
| | |  
|-|-|  
| **File** | **Purpose** |   
| backend/routers/order.py | Exposes the 3 API endpoints |   
| backend/schemas/order.py | Pydantic request/response models |   
| backend/services/order_service.py | All business logic |   
   
main.py was updated to register the new router:  
from routers import order as order_router  
 app.include_router(order_router.router)  
   
**What the service does when an order is placed:**  
1. Loads the customer's cart and validates it is not empty.  
2. Validates and applies a coupon code if provided (checks expiry, usage limit, minimum order amount).  
3. Calculates delivery charge (৳50 standard; free if subtotal ≥ ৳500; or free if customer uses an EggClub free delivery slot).  
4. Creates an Order row with all financial totals.  
5. Creates OrderItem rows for every item in the cart.  
6. Creates a Shipment row (status: pending).  
7. Clears the customer's cart.  
8. Decrements coupon times_used and EggClub free_deliveries_left as needed.  
9. All of the above happens in a single database transaction.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQ2AQBAAsSHhiQI0IWp9ngBsYIEfIWkVdJuZs5oAAPiLe6+O6vp6AgDAa+sBhYwEOqBD7p8AAAAASUVORK5CYII=)  
**API Endpoints**  
All endpoints require a Bearer token (JWT) in the Authorization header — same auth as the cart module.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsScYxpg/h5VMYARvRrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA224BcUMk6pDAAAAAElFTkSuQmCC)  
**1. Validate Coupon**  
**POST** /order/validate-coupon  
Checks whether a coupon code is valid for a given subtotal **without** placing an order. Use this to give the customer live feedback before they submit.  
**Request body:**  
{  
   "code": "SAVE10",  
   "subtotal": 350.00  
 }  
   
**Response (valid):**  
{  
   "valid": true,  
   "discount_type": "percentage",  
   "discount_value": 10.0,  
   "discount_amount": 35.0,  
   "message": "Coupon applied successfully."  
 }  
   
**Response (invalid):**  
{  
   "valid": false,  
   "discount_type": null,  
   "discount_value": null,  
   "discount_amount": null,  
   "message": "Coupon has expired."  
 }  
   
Possible failure messages: "Coupon not found or inactive.", "Coupon has expired.", "Coupon usage limit reached.", "Minimum order amount for this coupon is ৳X."  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQmAABRAsSd4NIGBzPXBmAawhhW8ibAl2DIze3UGAMBf3Gu1VcfXEwAAXrsehaQEN+8fLHEAAAAASUVORK5CYII=)  
**2. Place Order**  
**POST** /order/place  
Places the order. Clears the cart on success.  
**Request body:**  
{  
   "phone": "01712345678",  
   "delivery_address": "House 12, Road 5, Dhanmondi",  
   "delivery_city": "Dhaka",  
   "delivery_time": "2026-04-01T14:00:00",  
   "delivery_type": "standard",  
   "payment_method": "cod",  
   "coupon_code": "SAVE10",  
   "use_free_delivery": false  
 }  
   
Field notes:  
- phone — required, stored for delivery contact.  
- delivery_address — required.  
- delivery_city — optional.  
- delivery_time — optional ISO datetime string; only relevant if delivery_type is "scheduled".  
- delivery_type — "standard" or "scheduled".  
- payment_method — "cod" (Cash on Delivery) or "online".  
- coupon_code — optional; should only be sent if already validated.  
- use_free_delivery — true to spend one EggClub free delivery slot (ignored if subtotal ≥ ৳500, which gives auto-free delivery).  
**Response (success, HTTP 200):**  
{  
   "id": 42,  
   "customer_id": 7,  
   "subtotal": 350.00,  
   "discount_amount": 35.00,  
   "delivery_charge": 50.00,  
   "total_amount": 365.00,  
   "delivery_address": "House 12, Road 5, Dhanmondi",  
   "delivery_city": "Dhaka",  
   "delivery_type": "standard",  
   "payment_method": "cod",  
   "status": "pending",  
   "used_free_delivery": false,  
   "created_at": "2026-03-27T10:00:00Z"  
 }  
   
**Error responses:**  
- 400 — Cart not found / Cart is empty / Invalid coupon.  
- 401 — Not authenticated.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsScYxpg/h5VMYARvRrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA224BcUMk6pDAAAAAElFTkSuQmCC)  
**3. EggClub Status**  
**GET** /order/eggclub-status  
Returns the current customer's EggClub membership info so the frontend can show/hide the free delivery option.  
**Response (member):**  
{  
   "is_member": true,  
   "free_deliveries_left": 3  
 }  
   
**Response (not a member / expired):**  
{  
   "is_member": false,  
   "free_deliveries_left": 0  
 }  
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALUlEQVR4nO3OQQ0AIAwEsAMlSJ0UrOFkGngRklZBR1WtJDsAAPzizNcDAADuNcKwAyU+nb+5AAAAAElFTkSuQmCC)  
**Module 10 — Frontend: Checkout UI**  
Three new files were added to the frontend:  
| | |  
|-|-|  
| **File** | **Purpose** |   
| frontend/src/api/orderApi.js | Axios wrappers for the 3 endpoints above |   
| frontend/src/pages/CheckoutPage.jsx | The checkout form page |   
| frontend/src/pages/OrderSuccessPage.jsx | Success confirmation page |   
   
App.jsx was updated with two new protected routes:  
<Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />  
 <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />  
   
CartPage.jsx — the handleProceedToOrder function was updated to navigate to /checkout instead of showing a toast.  
**CheckoutPage features**  
- **Phone number field** (required, validated with regex).  
- **Delivery address** (required) and  **city** (optional).  
- **Delivery type toggle** — Standard or Scheduled; scheduled shows a datetime picker.  
- **Payment method toggle** — Cash on Delivery or Online Payment.  
- **Coupon section** — user types a code and clicks Apply; calls /order/validate-coupon and shows the discount or error inline. Enter key also triggers validation.  
- **EggClub section** — shown only if the customer is an active member with free deliveries remaining AND the subtotal is under ৳500. A checkbox lets them choose to spend one free delivery slot.  
- **Order summary** (sticky sidebar on desktop) — live-updates subtotal, discount, delivery charge, and grand total as the user changes options.  
- **Place Order button** — disabled until phone and address are filled. On success, clears the cart store and navigates to /order-success.  
**OrderSuccessPage features**  
- Displays order ID, total amount, payment method, and status.  
- "Continue Shopping" button navigates back to the product browse page.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AUBBAsUeCE4yeIiT9CRVMWGAjJK2CbjNzVGcAAPzF2qu7Wl9PAAB47XoA/vcF8exqpY4AAAAASUVORK5CYII=)  
**Delivery Charge Rules (also enforced server-side)**  
| | |  
|-|-|  
| **Condition** | **Delivery charge** |   
| Subtotal ≥ ৳500 | ৳0 (automatic) |   
| EggClub member uses a free delivery slot | ৳0 |   
| Otherwise | ৳50 |   
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAM0lEQVR4nO3KsQ0AIRAEsUW6Qij1KvnevhMSYmKQ7GiCGd09k3wBAOAVf+2o4wYAwE1qAdYuAy151mgcAAAAAElFTkSuQmCC)  
**Database Tables Used**  
| | |  
|-|-|  
| **Table** | **Action** |   
| cart | Read to get subtotal; total_price reset to 0 after order |   
| cart_item | Read for order items; all rows deleted after order |   
| coupon | Read for validation; times_used incremented on use |   
| eggclub_membership | Read for eligibility; free_deliveries_left decremented on use |   
| order | New row created |   
| order_item | New rows created (one per cart item) |   
| shipment | New row created with status "pending" |   
   
