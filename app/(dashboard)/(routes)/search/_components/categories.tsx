"use client";

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcFilmReel,
  FcMusic,
  FcMultipleDevices,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import CategoryItem from "./category-item";
import { IconType } from "react-icons/lib";

interface ICategories {
  items: Category[];
}

const IconMap: Record<Category["name"], IconType> = {
  Engineering: FcEngineering,
  Music: FcMusic,
  Fitness: FcSportsMode,
  Photography: FcOldTimeCamera,
  Accounting: FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  Filming: FcFilmReel,
};

const Categories = ({ items }: ICategories) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          value={item.id}
          icon={IconMap[item.name]}
        />
      ))}
    </div>
  );
};

export default Categories;
