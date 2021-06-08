import { sampleSize } from "lodash";
import { foodTable } from "../lib/airtable";

export class FoodService {
  foodTable;
  constructor() {
    this.foodTable = foodTable;
  }

  async getMenus(): Promise<string[]> {
    try {
      const records = await foodTable.select().all();
      return records.map((record) => record.get("Name")) as string[];
    } catch {
      throw new Error("Can't get menu");
    }
  }

  async randomMenu(size = 3): Promise<string[]> {
    const menu = await this.getMenus();
    return sampleSize(menu, size);
  }
}
