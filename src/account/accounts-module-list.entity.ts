import { AccountModule } from "./account.module";
import { ChartOfAccountModule } from "./chart-of-account/chart-of-account.module";
import { JournalEntryModule } from "./journal-entry/journal-entry.module";

export const accounts = [
    AccountModule,
    ChartOfAccountModule,
    JournalEntryModule
]