import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

type CurrencyRecord = {
  amount: number;
  currency: string;
  id: string;
  date: string;
};

export default class Currency {
  private filePath: string;
  private id: string;
  private records: CurrencyRecord[] = [];
  private basePath: string;
  private pre_create: boolean;

  constructor(basePath: string, id?: string) {
    this.basePath = basePath;

    if (id) {
      this.id = id;
      this.pre_create = true;
    } else {
      this.pre_create = false;
      this.id = uuidv4();
    }

    this.filePath = path.join(this.basePath, `${this.id}.json`);

    this.loadRecords();
  }

  private loadRecords() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      this.records = JSON.parse(data);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        if (this.pre_create) {
          throw new Error("Currency file not found.");
        }
      }
    }
  }

  exportRecords(): void {
    try {
      fs.mkdirSync(this.basePath, { recursive: true });
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.records, null, 2),
        "utf8"
      );
    } catch (error) {}
  }

  importRecords(newRecords: CurrencyRecord[]): void {
    this.records = newRecords;
  }

  addRecord(amount: number, currency: string, date: string, id?: string) {
    this.records.push({
      amount,
      currency,
      date,
      id: id || `${currency}-${Date.now()}-${Math.random()}`,
    });
  }

  getByCurrency(currency: string): CurrencyRecord[] {
    return this.records.filter((rec) => rec.currency === currency);
  }

  sortByCurrency(): CurrencyRecord[] {
    return [...this.records].sort((a, b) => a.currency.localeCompare(b.currency));
  }

  filterByAmountRange(min: number, max: number): CurrencyRecord[] {
    return this.records.filter((rec) => rec.amount >= min && rec.amount <= max);
  }

  filterByCurrencyAndRange(currency: string, min: number, max: number): CurrencyRecord[] {
    return this.records.filter(
      (rec) => rec.currency === currency && rec.amount >= min && rec.amount <= max
    );
  }

  getAll(): CurrencyRecord[] {
    return this.records;
  }

  getId(): string {
    return this.id;
  }
  // Might need to add interactivity between this and transactions, I'll ask about it Friday unless we switch up our datastorage. 
}