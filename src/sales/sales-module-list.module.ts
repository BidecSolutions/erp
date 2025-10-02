import { TaxTypeModule } from "src/sales/tax-type/tax-type.module";
import { SalesOrderModule } from "./sales-order/sales-order.module";
import { TaxSlabsModule } from "./tax-slabs/tax-slabs.module";

export const sales = [
    SalesOrderModule,
    TaxTypeModule,
    TaxSlabsModule
]