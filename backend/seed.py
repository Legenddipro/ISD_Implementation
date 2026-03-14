from database import SessionLocal
from models.category import Category
from models.product import Product

def seed():
    db = SessionLocal()

    # Seed categories
    categories = [
        Category(name="Dairy", description="Milk, eggs and dairy products"),
        Category(name="Grains", description="Rice, flour and grains"),
        Category(name="Bakery", description="Bread and bakery items"),
        Category(name="Meat", description="Chicken, beef and meat products"),
    ]
    db.add_all(categories)
    db.commit()

    # Seed products
    dairy = db.query(Category).filter_by(name="Dairy").first()
    grains = db.query(Category).filter_by(name="Grains").first()
    bakery = db.query(Category).filter_by(name="Bakery").first()
    meat = db.query(Category).filter_by(name="Meat").first()

    products = [
        Product(name="Egg (12 pcs)", price=120.00, stock_quantity=100, category_id=dairy.id),
        Product(name="Milk (1L)",    price=80.00,  stock_quantity=50,  category_id=dairy.id),
        Product(name="Rice (5kg)",   price=350.00, stock_quantity=30,  category_id=grains.id),
        Product(name="Bread",        price=45.00,  stock_quantity=60,  category_id=bakery.id),
        Product(name="Chicken (1kg)",price=280.00, stock_quantity=20,  category_id=meat.id),
    ]
    db.add_all(products)
    db.commit()
    db.close()
    print("Seed data inserted!")

if __name__ == "__main__":
    seed()