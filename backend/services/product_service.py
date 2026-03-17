from sqlalchemy.orm import Session

from models.product import Product
from models.category import Category


def get_all_products(
    db: Session,
    search: str | None = None,
    category_id: int | None = None,
) -> list:
    query = db.query(Product, Category.name).outerjoin(
        Category, Product.category_id == Category.id
    )

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    if category_id is not None:
        query = query.filter(Product.category_id == category_id)

    return query.all()


def get_product_by_id(db: Session, product_id: int):
    return (
        db.query(Product, Category.name)
        .outerjoin(Category, Product.category_id == Category.id)
        .filter(Product.id == product_id)
        .first()
    )


def get_all_categories(db: Session) -> list:
    return db.query(Category).all()
