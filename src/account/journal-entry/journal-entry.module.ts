import { Module } from '@nestjs/common';
import { JournalEntryController } from './journal-entry.controller';
import { JournalEntryService } from './journal-entry.service';

@Module({
  controllers: [JournalEntryController],
  providers: [JournalEntryService]
})
export class JournalEntryModule {}
