import Airtable, { Table } from "airtable";
import { Food } from "../types/food";

const airtable = new Airtable();
const base = airtable.base("appUSJ2EPqxCvkyMv");

export const foodTable = base("food") as Table<Food>;
