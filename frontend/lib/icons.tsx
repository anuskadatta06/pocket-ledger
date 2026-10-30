import React from "react";
import {
  Utensils,
  Home,
  Car,
  ShoppingCart,
  Film,
  Zap,
  Briefcase,
  Activity,
  Tag,
  TrendingUp,
  CreditCard,
  PieChart,
  HelpCircle,
  LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  utensils: Utensils,
  home: Home,
  car: Car,
  "shopping-cart": ShoppingCart,
  film: Film,
  zap: Zap,
  briefcase: Briefcase,
  activity: Activity,
  tag: Tag,
  "trending-up": TrendingUp,
  "credit-card": CreditCard,
  "pie-chart": PieChart,
};

export function getCategoryIcon(name: string, props?: LucideProps) {
  const IconComponent = ICON_MAP[name.toLowerCase()] || Tag;
  return <IconComponent {...props} />;
}
