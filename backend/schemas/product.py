from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    price: float
    stock_quantity: int
    image_url: str | None
    category_id: int | None
    category_name: str | None

    @classmethod
    def from_product(cls, product, category_name: str | None = None) -> ProductResponse:
        return cls(
            id=product.id,
            name=product.name,
            description=product.description,
            price=float(product.price),
            stock_quantity=product.stock_quantity,
            image_url=product.image_url,
            category_id=product.category_id,
            category_name=category_name,
        )
