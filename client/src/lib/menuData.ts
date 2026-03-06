export interface MenuItem {
  id: string;
  nameKey: string;       // translation key for name
  descKey: string;       // translation key for description
  name: string;          // fallback name (Russian)
  description: string;   // fallback description (Russian)
  price: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  images: string[];
}

export const menuItems: MenuItem[] = [
  {
    id: "plov",
    nameKey: "plov",
    descKey: "plovDesc",
    name: "Плов",
    description: "Настоящий ташкентский плов с нежной бараниной, сочной морковью и ароматным рисом. Понравится с традиционным салатом ачичук.",
    price: 12,
    minQuantity: 2,
    maxQuantity: 10,
    unit: "порция",
    images: [
      "/assets/плов.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/VbggHoMFBLsJGQoR.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/yFZUsntKFJNmsfjU.jpg"
    ]
  },
  {
    id: "shurpa",
    nameKey: "shurpa",
    descKey: "shurpaDesc",
    name: "Шурпа (суп)",
    description: "Наваристый узбекский суп с мягкой бараниной, овощами и нутом. Отличный выбор для теплых дней.",
    price: 12,
    minQuantity: 2,
    maxQuantity: 10,
    unit: "порция",
    images: [
      "/assets/shurpa.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/NElhrkCeUOHTdnRY.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/SsRfrwIjzjyPTsnu.jpg"
    ]
  },
  {
    id: "kazan-kabob",
    nameKey: "kazanKabob",
    descKey: "kazanKabobDesc",
    name: "Казан Кабоб",
    description: "Нежные ребрышки ягненка, жареные в казане с сочным картофелем и волшебными приправами. Насыщающее и ароматное блюдо.",
    price: 14,
    minQuantity: 2,
    maxQuantity: 6,
    unit: "порция",
    images: [
      "/assets/kaza-kabob.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/UUiWKlXXHBwgjYKt.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/WfElpWeYCGRCRkql.jpg"
    ]
  },
  {
    id: "manty",
    nameKey: "manty",
    descKey: "mantyDesc",
    name: "Манты",
    description: "Мясные манты с сочным рубленым мясом и ароматным жиром. Первые блюда всех узбекских трапез. Доставляются замороженные в виде полуфабрикатов.",
    price: 3,
    minQuantity: 15,
    maxQuantity: 25,
    unit: "шт",
    images: [
      "/assets/manty.webp",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/foCnxUpehwQbattK.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/ItwmZaklcpsxpPuD.jpeg"
    ]
  },
  {
    id: "lyulya-kebab",
    nameKey: "lulya",
    descKey: "lulyaDesc",
    name: "Люля Кебаб",
    description: "Сочные шашлыки из фарша баранины/говядины с луком и специями. Две палочки люля + запеченные овощи.",
    price: 20,
    minQuantity: 1,
    maxQuantity: 3,
    unit: "порция",
    images: [
      "/assets/люля.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/cQUpyjrcEarjLTKK.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/WogXtZbPuytpKcBK.jpg"
    ]
  },
  {
    id: "samsa",
    nameKey: "samsa",
    descKey: "samsaDesc",
    name: "Самса",
    description: "Хрустящее слоеное тесто с рубленым мясом. Классические узбекские перекусы.",
    price: 4,
    minQuantity: 5,
    maxQuantity: 30,
    unit: "шт",
    images: [
      "/assets/samsa.png",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/udWsdqIqYolSTYil.webp",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/qLYKUhyWIyZNFhpl.jpg"
    ]
  }
];

export const deliveryFee = 10;
