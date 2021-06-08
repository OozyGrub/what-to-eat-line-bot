import Airtable from "airtable";
const airtable = new Airtable();
const base = airtable.base("appUSJ2EPqxCvkyMv");

export const foodTable = base("food");
