import { FoodParams } from "./../types/food.d";
import { buildOrQuery } from "./../utils/airtable.utils";
import { Table } from "airtable";
import { Records } from "airtable/lib/records";
import { sampleSize } from "lodash";
import moment from "moment-timezone";
import { foodTable } from "../lib/airtable";
import { Food } from "../types/food";

class FoodService {
  private foodTable: Table<Food>;
  constructor() {
    this.foodTable = foodTable;
  }

  async findAll(params?: FoodParams): Promise<Records<Food>> {
    const excludeRecent = params?.excludeRecent || false;

    const now = moment();
    const rangeInDays = 3;

    const filterByFormula = excludeRecent
      ? buildOrQuery([
          `DATETIME_DIFF({date}, "${now.toISOString()}", "days") >= ${rangeInDays}`,
          `{date} = BLANK()`,
        ])
      : "";

    const qb = this.foodTable.select({ filterByFormula });
    return await qb.all();
  }

  private async updateDate(id: string) {
    await this.foodTable.update(id, { date: moment().toISOString() });
  }

  async getRandomMenu(size = 3): Promise<string[]> {
    const foods = await this.findAll();

    const sampledFoods = sampleSize(foods, size);

    await Promise.all(sampledFoods.map((food) => this.updateDate(food.id)));

    return sampledFoods.map((food) => food.get("name")) as string[];
  }

  async getRerolledRandomMenu(): Promise<string[]> {
    return await this.getRandomMenu();
  }
}

export const foodService = new FoodService();
