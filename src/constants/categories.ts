import type { CategoryData } from "@/lib/types";

export const CATEGORIES: Record<string, CategoryData> = {
  commercial: {
    label: "Commercial",
    subtitle: "Select a category to explore",
    description: "Build your facility with robust, high-performance equipment designed for heavy daily use.",
    subcategories: [
      { id: "treadmills", label: "Treadmills", subtitle: "Heavy duty cardio machines", iconName: "Activity" },
      { id: "elliptical-trainers", label: "Elliptical Trainers", subtitle: "Low-impact total body", iconName: "Activity" },
      { id: "bikes", label: "Bikes", subtitle: "Upright and recumbent", iconName: "Bike" },
      { id: "air-rowers-ski", label: "Air Rowers / Ski", subtitle: "High-intensity endurance", iconName: "Activity" },
      { id: "step-mill", label: "Step Mill", subtitle: "Vertical cardio climbing", iconName: "TrendingUp" },
      { id: "unique-products", label: "Unique Products", subtitle: "Specialty training equipment", iconName: "Star" },
      { id: "strength-training", label: "Strength Training", subtitle: "Free weights and machines", iconName: "Dumbbell" },
      {
        id: "crossfit-rigs",
        label: "Multi Functional Rigs / Crossfit Training",
        subtitle: "Versatile training stations",
        iconName: "Target"
      },
      { id: "pilates", label: "Pilates", subtitle: "Core and flexibility", iconName: "Heart" },
    ],
  },
  domestic: {
    label: "Domestic",
    subtitle: "Select a category to explore",
    description: "Perfect your home gym with space-saving, versatile fitness solutions for personal training.",
    subcategories: [
      { id: "treadmills", label: "Treadmills", subtitle: "Cardio essentials", iconName: "Activity" },
      { id: "elliptical-trainers", label: "Elliptical Trainers", subtitle: "Full body cardio", iconName: "Activity" },
      { id: "bikes", label: "Bikes", subtitle: "Spin & upright", iconName: "Bike" },
      { id: "strength-training", label: "Strength Training", subtitle: "Home gym essentials", iconName: "Dumbbell" },
      { id: "x-series", label: "X Series – Light Commercial", subtitle: "Semi-professional gear", iconName: "Star" },
    ],
  },
};
