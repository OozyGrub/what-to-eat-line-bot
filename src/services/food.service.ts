import { sampleSize } from "lodash";

export class FoodService {
  menus = [
    "ข้าวมันไก่ทอด",
    "ข้าวขาหมู",
    "เย็นตาโฟ",
    "สุกี้แห้ง",
    "บะหมี่แห้ง",
    "เล็กแห้ง",
    "หมูกระเทียมไข่ดาว"
  ];

  randomMenu = (size = 3) => {
    return sampleSize(this.menus, size).join(" ไม่ก็ ");
  };
}
