from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Ecommerce API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers.product import router as product_router, category_router
from routers.cart import router as cart_router

app.include_router(product_router)
app.include_router(category_router)
app.include_router(cart_router)

@app.get("/")
def health_check():
    return {"status": "Backend is running"}
