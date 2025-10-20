import { BrandModule } from "./brand/brand.module";
import { CategoriesModule } from "./categories/categories.module";
import { ProductModule } from "./product/product.module";
import { PurchaseOrderModule } from "./purchase_order/purchase_order.module";
import { PurchaseRequestModule } from "./purchase_request/purchase_request.module";
import { UnitOfMeasureModule } from "./unit_of_measure/unit_of_measure.module";
import { StockMovementModule } from './stock_movement/stock_movement.module';
import { StockModule } from "./stock/stock.module";
import { StockAdjustmentModule } from './stock_adjustment/stock_adjustment.module';
import { WarehouseModule } from "./warehouse/warehouse.module";
import { PurchaseQuotationModule } from "./purchase_quotation/purchase_quotation.module";
import { GoodsReceivingNoteModule } from './goods_receiving_note/goods_receiving_note.module';
import { WarrantyModule } from './warranty/warranty.module';
import { ModuleTypeModule } from './module_type/module_type.module';
import { AttributeModule } from "./attribute/attribute.module";
import { AttributeValueModule } from "./attribute value/attribute.module";

export const procurement = [

    PurchaseOrderModule,
    CategoriesModule,
    BrandModule,
    UnitOfMeasureModule,
    WarrantyModule,
    ModuleTypeModule,
    WarehouseModule,
    ProductModule,
    StockModule,
    StockMovementModule,
    StockAdjustmentModule,
    PurchaseRequestModule,
    PurchaseQuotationModule,
    PurchaseOrderModule,
    GoodsReceivingNoteModule,
    AttributeModule,
    AttributeValueModule
]