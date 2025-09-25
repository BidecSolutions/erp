import { BrandModule } from "./brand/brand.module";
import { CategoriesModule } from "./categories/categories.module";
import { ProductModule } from "./product/product.module";
import { PurchaseOrderModule } from "./purchase_order/purchase_order.module";
import { PurchaseRequestModule } from "./purchase_request/purchase_request.module";
import { PurchaseRequestItemsModule } from "./purchase_request_items/purchase_request_items.module";
import { UnitOfMeasureModule } from "./unit_of_measure/unit_of_measure.module";

export const procurement = [
    ProductModule,
    PurchaseRequestModule,
    PurchaseRequestItemsModule,
    PurchaseOrderModule,
    CategoriesModule,
    BrandModule,
    UnitOfMeasureModule,
]