import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchHealthReports } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { foodImages } from "../data/foodImages.js";

const mealData = {
  veg: {
    normal: [
      {
        day: "Monday",
        meals: {
          Breakfast: "Oats with fruits & almonds",
          Lunch: "Vegetable curry with brown rice",
          Snacks: "Mixed nuts & yogurt",
          Dinner: "Lentil soup with whole wheat roti",
        },
      },
      {
        day: "Tuesday",
        meals: {
          Breakfast: "Sprouts Salad & Green Tea",
          Lunch: "Spinach Dal with Brown Rice",
          Snacks: "Fruit Salad with Honey",
          Dinner: "Paneer Bhurji with Roti",
        },
      },
      {
        day: "Wednesday",
        meals: {
          Breakfast: "Banana Smoothie & Whole Grain Toast",
          Lunch: "Rajma with Jeera Rice",
          Snacks: "Roasted Chickpeas",
          Dinner: "Mixed Veg Soup with Khichdi",
        },
      },
      {
        day: "Thursday",
        meals: {
          Breakfast: "Methi Paratha with Curd",
          Lunch: "Chickpea Salad & Vegetable Stir Fry",
          Snacks: "Carrot & Cucumber Sticks with Hummus",
          Dinner: "Dal Tadka with Roti",
        },
      },
      {
        day: "Friday",
        meals: {
          Breakfast: "Poha with Peanuts & Lemon",
          Lunch: "Vegetable Pulao with Raita",
          Snacks: "Handful of Walnuts & Herbal Tea",
          Dinner: "Stuffed Capsicum with Multigrain Roti",
        },
      },
      {
        day: "Saturday",
        meals: {
          Breakfast: "Dhokla with Mint Chutney",
          Lunch: "Soya Chunk Curry with Rice",
          Snacks: "Masala Buttermilk",
          Dinner: "Baingan Bharta with Roti",
        },
      },
      {
        day: "Sunday",
        meals: {
          Breakfast: "Chia Pudding with Nuts",
          Lunch: "Matar Paneer with Brown Rice",
          Snacks: "Baked Sweet Potato Fries",
          Dinner: "Khichdi with Kadhi",
        },
      },
    ],
    lowCalorie: [
      {
        day: "Monday",
        meals: {
          Breakfast: "Oatmeal with berries",
          Lunch: "Quinoa salad with grilled vegetables",
          Snacks: "Cucumber and carrot sticks",
          Dinner: "Steamed vegetables with tofu",
        },
      },
      {
        day: "Tuesday",
        meals: {
          Breakfast: "Green smoothie bowl",
          Lunch: "Mixed greens salad with chickpeas",
          Snacks: "Apple slices with cinnamon",
          Dinner: "Cauliflower rice stir-fry",
        },
      },
      {
        day: "Wednesday",
        meals: {
          Breakfast: "Sugar-free muesli with almond milk",
          Lunch: "Zucchini noodles with tomato sauce",
          Snacks: "Celery sticks with hummus",
          Dinner: "Vegetable soup with lentils",
        },
      },
      {
        day: "Thursday",
        meals: {
          Breakfast: "Protein smoothie with spinach",
          Lunch: "Buddha bowl with roasted vegetables",
          Snacks: "Mixed berries",
          Dinner: "Grilled mushroom caps with herbs",
        },
      },
      {
        day: "Friday",
        meals: {
          Breakfast: "Chia seed pudding with coconut",
          Lunch: "Mediterranean salad with falafel",
          Snacks: "Roasted chickpeas",
          Dinner: "Vegetable curry with cauliflower rice",
        },
      },
      {
        day: "Saturday",
        meals: {
          Breakfast: "Avocado toast on ezekiel bread",
          Lunch: "Spiralized vegetable pasta",
          Snacks: "Kale chips",
          Dinner: "Stuffed bell peppers with quinoa",
        },
      },
      {
        day: "Sunday",
        meals: {
          Breakfast: "Protein pancakes with berries",
          Lunch: "Asian-style lettuce wraps",
          Snacks: "Green smoothie",
          Dinner: "Roasted vegetable medley",
        },
      },
    ],
    highCalorie: [
      {
        day: "Monday",
        meals: {
          Breakfast: "Protein smoothie with banana and peanut butter",
          Lunch: "Chickpea curry with brown rice and avocado",
          Snacks: "Trail mix with dried fruits and nuts",
          Dinner: "Quinoa bowl with roasted vegetables and tahini",
        },
      },
      {
        day: "Tuesday",
        meals: {
          Breakfast: "Overnight oats with nuts and seeds",
          Lunch: "Buddha bowl with sweet potato and tempeh",
          Snacks: "Protein bars and banana",
          Dinner: "Lentil pasta with rich tomato sauce",
        },
      },
      {
        day: "Wednesday",
        meals: {
          Breakfast: "Whole grain toast with avocado and seeds",
          Lunch: "Black bean burrito bowl with guacamole",
          Snacks: "Smoothie with protein powder",
          Dinner: "Stir-fried tofu with noodles",
        },
      },
      {
        day: "Thursday",
        meals: {
          Breakfast: "Protein pancakes with maple syrup",
          Lunch: "Chickpea pasta with pesto sauce",
          Snacks: "Nuts and dried fruit mix",
          Dinner: "Vegetable curry with coconut milk",
        },
      },
      {
        day: "Friday",
        meals: {
          Breakfast: "Granola with yogurt and honey",
          Lunch: "Quinoa power bowl with nuts",
          Snacks: "Energy balls with dates",
          Dinner: "Bean and cheese enchiladas",
        },
      },
      {
        day: "Saturday",
        meals: {
          Breakfast: "Bagel with cream cheese and avocado",
          Lunch: "Vegetable lasagna with cheese",
          Snacks: "Protein smoothie bowl",
          Dinner: "Rich mushroom risotto",
        },
      },
      {
        day: "Sunday",
        meals: {
          Breakfast: "French toast with fruit compote",
          Lunch: "Stuffed sweet potato with beans",
          Snacks: "Protein shake with banana",
          Dinner: "Paneer tikka masala with naan",
        },
      },
    ],
  },
  nonVeg: {
    normal: [
      {
        day: "Monday",
        meals: {
          Breakfast: "Boiled Eggs with Brown Bread",
          Lunch: "Grilled Chicken with Quinoa",
          Snacks: "Greek Yogurt with Berries",
          Dinner: "Fish Curry with Rice",
        },
      },
      {
        day: "Tuesday",
        meals: {
          Breakfast: "Omelet with Whole Wheat Toast",
          Lunch: "Chicken Biryani with Raita",
          Snacks: "Roasted Peanuts",
          Dinner: "Lemon Garlic Fish with Vegetables",
        },
      },
      {
        day: "Wednesday",
        meals: {
          Breakfast: "Scrambled Eggs with Avocado Toast",
          Lunch: "Mutton Curry with Brown Rice",
          Snacks: "Protein Bar",
          Dinner: "Tandoori Chicken with Stir-fried Veggies",
        },
      },
      {
        day: "Thursday",
        meals: {
          Breakfast: "Chicken Sausages with Toast",
          Lunch: "Egg Curry with Chapati",
          Snacks: "Handful of Almonds & Herbal Tea",
          Dinner: "Grilled Fish with Sweet Potato",
        },
      },
      {
        day: "Friday",
        meals: {
          Breakfast: "Salmon Omelet with Whole Wheat Bread",
          Lunch: "Chicken Soup & Salad",
          Snacks: "Boiled Chickpeas with Lemon",
          Dinner: "Baked Chicken with Roasted Veggies",
        },
      },
      {
        day: "Saturday",
        meals: {
          Breakfast: "Paneer-Egg Bhurji with Toast",
          Lunch: "Grilled Prawns with Brown Rice",
          Snacks: "Banana Shake",
          Dinner: "Mutton Keema with Chapati",
        },
      },
      {
        day: "Sunday",
        meals: {
          Breakfast: "Omelet with Spinach & Cheese",
          Lunch: "Fish Fry with Vegetable Pulao",
          Snacks: "Homemade Protein Smoothie",
          Dinner: "Grilled Chicken with Quinoa Salad",
        },
      },
    ],
    lowCalorie: [
      {
        day: "Monday",
        meals: {
          Breakfast: "Egg white omelet with whole grain toast",
          Lunch: "Grilled chicken breast with steamed vegetables",
          Snacks: "Low-fat Greek yogurt",
          Dinner: "Steamed fish with quinoa",
        },
      },
      {
        day: "Tuesday",
        meals: {
          Breakfast: "Turkey bacon with scrambled egg whites",
          Lunch: "Tuna salad with mixed greens",
          Snacks: "Protein shake",
          Dinner: "Baked chicken with asparagus",
        },
      },
      {
        day: "Wednesday",
        meals: {
          Breakfast: "Smoked salmon with cucumber",
          Lunch: "Grilled fish with zucchini noodles",
          Snacks: "Boiled egg whites",
          Dinner: "Chicken soup with vegetables",
        },
      },
      {
        day: "Thursday",
        meals: {
          Breakfast: "Protein smoothie with berries",
          Lunch: "Shredded chicken salad",
          Snacks: "Turkey slices with lettuce",
          Dinner: "Baked fish with broccoli",
        },
      },
      {
        day: "Friday",
        meals: {
          Breakfast: "Egg white wrap with spinach",
          Lunch: "Grilled shrimp with cauliflower rice",
          Snacks: "Celery with sugar-free peanut butter",
          Dinner: "Lean turkey meatballs with vegetables",
        },
      },
      {
        day: "Saturday",
        meals: {
          Breakfast: "Chicken sausage with egg whites",
          Lunch: "Baked cod with green beans",
          Snacks: "Protein bar",
          Dinner: "Turkey stir-fry with bell peppers",
        },
      },
      {
        day: "Sunday",
        meals: {
          Breakfast: "Smoked turkey with egg white omelet",
          Lunch: "Grilled chicken Caesar salad (no croutons)",
          Snacks: "Tuna with cucumber slices",
          Dinner: "Baked salmon with asparagus",
        },
      },
    ],
    highCalorie: [
      {
        day: "Monday",
        meals: {
          Breakfast: "Protein pancakes with eggs and bacon",
          Lunch: "Double chicken breast with rice and avocado",
          Snacks: "Protein shake with banana and peanut butter",
          Dinner: "Salmon with sweet potato and nuts",
        },
      },
      {
        day: "Tuesday",
        meals: {
          Breakfast: "Chicken sausages with whole eggs and cheese",
          Lunch: "Beef stir-fry with brown rice",
          Snacks: "Trail mix with dried fruits and nuts",
          Dinner: "Large portion fish curry with rice",
        },
      },
      {
        day: "Wednesday",
        meals: {
          Breakfast: "Protein smoothie with oats and eggs",
          Lunch: "Chicken biryani with boiled eggs",
          Snacks: "Protein bar and milk",
          Dinner: "Mutton curry with paratha",
        },
      },
      {
        day: "Thursday",
        meals: {
          Breakfast: "Full English breakfast",
          Lunch: "Grilled chicken with pasta",
          Snacks: "Protein shake with nuts",
          Dinner: "Fish fry with mashed potatoes",
        },
      },
      {
        day: "Friday",
        meals: {
          Breakfast: "Eggs Benedict with salmon",
          Lunch: "Chicken wrap with cheese and avocado",
          Snacks: "Protein balls and banana shake",
          Dinner: "Grilled fish with rice and curry",
        },
      },
      {
        day: "Saturday",
        meals: {
          Breakfast: "Protein waffles with eggs and sausage",
          Lunch: "Large portion biryani with kebabs",
          Snacks: "Mass gainer shake",
          Dinner: "Grilled chicken with potato wedges",
        },
      },
      {
        day: "Sunday",
        meals: {
          Breakfast: "Loaded omelet with cheese and meat",
          Lunch: "Mixed grill platter",
          Snacks: "Protein smoothie with oats",
          Dinner: "Fish curry with coconut rice",
        },
      },
    ],
  },
};

const healthConditionFoodSuggestions = {
  "Diabetes": ["Leafy greens", "Whole grains", "Lean proteins", "Berries", "Sweet potatoes", "Greek yogurt"],
  "Hypertension": ["Bananas", "Leafy greens", "Berries", "Beets", "Fatty fish", "Oats"],
  "Obesity": ["Lean proteins", "Whole grains", "Leafy vegetables", "Fruits", "Legumes", "Low-fat dairy"],
  "Anemia": ["Spinach", "Lean red meat", "Beans", "Eggs", "Fish", "Fortified cereals"],
  "Anxiety": ["Turkey", "Chamomile tea", "Blueberries", "Yogurt", "Dark chocolate", "Almonds"],
  "Depression": ["Fatty fish", "Dark leafy greens", "Nuts", "Berries", "Whole grains", "Fermented foods"],
  "Insomnia": ["Cherries", "Bananas", "Almonds", "Warm milk", "Turkey", "Chamomile tea"],
  "Allergies": ["Citrus fruits", "Turmeric", "Ginger", "Leafy greens", "Berries", "Garlic"],
  "Stress": ["Dark chocolate", "Avocados", "Nuts", "Berries", "Green tea", "Yogurt"],
  "Iron Deficiency": ["Lean red meat", "Spinach", "Lentils", "Quinoa", "Tofu", "Pumpkin seeds"]
};

const MealPlan = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("veg");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedMealType, setSelectedMealType] = useState("Breakfast");
  const [healthReport, setHealthReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update calorieData object with comprehensive meal calorie information
const calorieData = {
  // Additional meal items
  "Protein smoothie with spinach": 180,
  "Buddha bowl with roasted vegetables": 350,
  "Mixed berries": 85,
  "Grilled mushroom caps with herbs": 120,
  "Chia seed pudding with coconut": 250,
  "Mediterranean salad with falafel": 400,
  "Roasted chickpeas": 120,
  "Vegetable curry with cauliflower rice": 280,
  "Avocado toast on ezekiel bread": 320,
  "Spiralized vegetable pasta": 200,
  "Kale chips": 50,
  "Stuffed bell peppers with quinoa": 350,
  "Protein pancakes with berries": 280,
  "Asian-style lettuce wraps": 220,
  "Green smoothie": 120,
  "Roasted vegetable medley": 180,
  "Whole grain toast with avocado and seeds": 380,
  "Smoothie with protein powder": 200,
  "Protein pancakes with maple syrup": 420,
  "Nuts and dried fruit mix": 250,
  "Vegetable curry with coconut milk": 450,
  "Quinoa power bowl with nuts": 480,
  "Bagel with cream cheese and avocado": 420,
  "Vegetable lasagna with cheese": 550,
  "Protein smoothie bowl": 300,
  "French toast with fruit compote": 450,
  "Stuffed sweet potato with beans": 380,
  "Protein shake with banana": 250,
  "Paneer tikka masala with naan": 650,
  "Protein smoothie with oats and eggs": 400,
  "Chicken biryani with boiled eggs": 750,
  "Protein bar and milk": 300,
  "Mutton curry with paratha": 800,
  "Full English breakfast": 850,
  "Grilled chicken with pasta": 650,
  "Protein shake with nuts": 350,
  "Fish fry with mashed potatoes": 600,
  "Eggs Benedict with salmon": 550,
  "Chicken wrap with cheese and avocado": 580,
  "Protein balls and banana shake": 400,
  "Grilled fish with rice and curry": 550,
  "Protein waffles with eggs and sausage": 700,
  "Large portion biryani with kebabs": 900,
  "Mass gainer shake": 800,
  "Grilled chicken with potato wedges": 650,
  "Loaded omelet with cheese and meat": 550,
  "Mixed grill platter": 850,
  "Protein smoothie with oats": 350,
  "Fish curry with coconut rice": 600,
  "Large portion fish curry with rice": 700,
  "Smoked salmon with cucumber": 250,
  "Grilled fish with zucchini noodles": 300,
  "Boiled egg whites": 70,
  "Chicken soup with vegetables": 220,
  "Shredded chicken salad": 280,
  "Turkey slices with lettuce": 150,
  "Baked fish with broccoli": 300,
  "Egg white wrap with spinach": 200,
  "Grilled shrimp with cauliflower rice": 250,
  "Celery with sugar-free peanut butter": 120,
  "Lean turkey meatballs with vegetables": 350,
  "Chicken sausage with egg whites": 250,
  "Baked cod with green beans": 280,
  "Turkey stir-fry with bell peppers": 320,
  "Smoked turkey with egg white omelet": 280,
  "Grilled chicken Caesar salad (no croutons)": 300,
  "Tuna with cucumber slices": 180,
  "Baked salmon with asparagus": 350,
  "Baked chicken with asparagus": 320,
  "Protein shake": 150,
  // Vegetarian Normal Diet
  "Oats with fruits & almonds": 350,
  "Vegetable curry with brown rice": 450,
  "Mixed nuts & yogurt": 200,
  "Lentil soup with whole wheat roti": 400,
  "Sprouts Salad & Green Tea": 150,
  "Spinach Dal with Brown Rice": 400,
  "Fruit Salad with Honey": 180,
  "Paneer Bhurji with Roti": 450,
  "Banana Smoothie & Whole Grain Toast": 300,
  "Rajma with Jeera Rice": 420,
  "Roasted Chickpeas": 150,
  "Mixed Veg Soup with Khichdi": 380,
  "Methi Paratha with Curd": 320,
  "Chickpea Salad & Vegetable Stir Fry": 280,
  "Carrot & Cucumber Sticks with Hummus": 150,
  "Dal Tadka with Roti": 380,
  "Poha with Peanuts & Lemon": 250,
  "Vegetable Pulao with Raita": 400,
  "Handful of Walnuts & Herbal Tea": 200,
  "Stuffed Capsicum with Multigrain Roti": 350,
  "Dhokla with Mint Chutney": 220,
  "Soya Chunk Curry with Rice": 420,
  "Masala Buttermilk": 100,
  "Baingan Bharta with Roti": 320,
  "Chia Pudding with Nuts": 280,
  "Matar Paneer with Brown Rice": 450,
  "Baked Sweet Potato Fries": 180,
  "Khichdi with Kadhi": 380,

  // Vegetarian Low Calorie Diet
  "Oatmeal with berries": 200,
  "Quinoa salad with grilled vegetables": 280,
  "Cucumber and carrot sticks": 50,
  "Steamed vegetables with tofu": 250,
  "Green smoothie bowl": 180,
  "Mixed greens salad with chickpeas": 220,
  "Apple slices with cinnamon": 80,
  "Cauliflower rice stir-fry": 150,
  "Sugar-free muesli with almond milk": 180,
  "Zucchini noodles with tomato sauce": 120,
  "Celery sticks with hummus": 100,
  "Vegetable soup with lentils": 200,

  // Vegetarian High Calorie Diet
  "Protein smoothie with banana and peanut butter": 450,
  "Chickpea curry with brown rice and avocado": 650,
  "Trail mix with dried fruits and nuts": 350,
  "Quinoa bowl with roasted vegetables and tahini": 550,
  "Overnight oats with nuts and seeds": 400,
  "Buddha bowl with sweet potato and tempeh": 600,

  // Non-Vegetarian Normal Diet
  "Boiled Eggs with Brown Bread": 300,
  "Grilled Chicken with Quinoa": 450,
  "Greek Yogurt with Berries": 150,
  "Fish Curry with Rice": 420,
  "Omelet with Whole Wheat Toast": 350,
  "Chicken Biryani with Raita": 550,
  "Roasted Peanuts": 180,
  "Lemon Garlic Fish with Vegetables": 380,

  // Non-Vegetarian Low Calorie Diet
  "Egg white omelet with whole grain toast": 220,
  "Grilled chicken breast with steamed vegetables": 280,
  "Low-fat Greek yogurt": 100,
  "Steamed fish with quinoa": 300,

  // Non-Vegetarian High Calorie Diet
  "Protein pancakes with eggs and bacon": 650,
  "Double chicken breast with rice and avocado": 750,
  "Protein shake with banana and peanut butter": 400,
  "Salmon with sweet potato and nuts": 600
};

  const getCalories = (mealItem) => {
    return calorieData[mealItem] || "N/A";
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const getMealSuggestions = (healthReport) => {
  if (!healthReport) {
    return mealData.veg.normal; // Default to normal veg diet if no health data
  }

  const { reportData } = healthReport;
  const parsedData = typeof reportData === 'string' ? JSON.parse(reportData) : reportData;
  const { weight, height, healthIssue } = parsedData;

  // Calculate BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // Get dietary preference (veg/nonVeg)
  const dietType = selectedPlan;

  // Determine meal plan based on BMI and health conditions
  if (bmi < 18.5) {
    return mealData[dietType].highCalorie; // Underweight
  } else if (bmi > 25) {
    return mealData[dietType].lowCalorie; // Overweight
  }

  // Check for specific health conditions
  if (healthIssue) {
    const healthConditionFoods = healthConditionFoodSuggestions[healthIssue];
    if (healthConditionFoods) {
      // For now, return normal diet but in future can customize based on health conditions
      return mealData[dietType].normal;
    }
  }

  return mealData[dietType].normal; // Default to normal diet
};

  const currentMealPlan = getMealSuggestions(healthReport);
  const selectedDayMeals = currentMealPlan.find(day => day.day === selectedDay)?.meals || {};

  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          setError('User not found');
          return;
        }
        const user = JSON.parse(userData);
        const reports = await fetchHealthReports(user.studentId);
        if (reports && reports.length > 0) {
          const latestReport = reports[reports.length - 1];
          const reportData = JSON.parse(latestReport.reportData);
          setHealthReport({
            ...latestReport,
            healthIssue: reportData.healthIssue || 'No health issues reported',
            description: reportData.description || 'No description provided'
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching health reports:', err);
        setError('Failed to load health data');
        setLoading(false);
      }
    };

    fetchLatestReport();
  }, []);

return (
  <div className="flex h-screen bg-gray-100 overflow-hidden">
    {/* Sidebar */}
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">💙 HealthBuzz</h2>
      <ul>
        <li className="p-2 hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate("/dashboard")}>
          🏠 Dashboard
        </li>
        <li className="p-2 bg-blue-100 text-blue-600 rounded-md mb-2 cursor-pointer" onClick={() => navigate("/meal-plan")}>
          📋 Meal Plan
        </li>
        <li className="p-2 hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate("/medicines")}>
          💊 Medicines
        </li>
        <li className="p-2 hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate("/leave-request")}>
          ✈️ Leave
        </li>
      </ul>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-4 bg-gray-50 overflow-hidden">
      <div className="h-full flex flex-col">
        <h1 className="text-2xl font-bold mb-3 text-gray-800">Your Meal Plan</h1>

        {/* Health Status and Diet Type Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3 text-gray-700">Health Status</h2>
              {loading ? (
                <p>Loading health status...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : healthReport ? (
                <div className="space-y-3">
                  {healthReport.reportData && (
                    <>
                      <p className="text-base text-gray-600">
                        <span className="font-medium">BMI:</span> {JSON.parse(healthReport.reportData).bmi}
                      </p>
                    </>
                  )}
                  <p className="text-base text-gray-600">
                    <span className="font-medium">Health Issue:</span> {healthReport.healthIssue}
                  </p>
                </div>
              ) : (
                <p>No health data available</p>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3 text-gray-700">Diet Type</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPlan("veg")}
                  className={`px-5 py-3 rounded-lg text-base font-medium transition-colors ${selectedPlan === "veg" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Vegetarian
                </button>
                <button
                  onClick={() => setSelectedPlan("nonVeg")}
                  className={`px-5 py-3 rounded-lg text-base font-medium transition-colors ${selectedPlan === "nonVeg" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Non-Vegetarian
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Days Selection */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-3 rounded-lg text-base font-medium transition-colors ${selectedDay === day ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Types */}
        <div className="grid grid-cols-4 gap-6 flex-1 overflow-hidden">
          {mealTypes.map((type) => (
            <div key={type} className="bg-white rounded-xl shadow-lg p-4 mb-4 flex flex-col transform transition-all hover:scale-105">
              <h3 className="text-lg font-bold mb-3 text-gray-800 text-center">{type}</h3>
              <div className="text-center flex-grow flex flex-col justify-between">
                {foodImages[selectedDayMeals[type]] && (
                  <div className="mb-2">
                    <img
                      src={foodImages[selectedDayMeals[type]]}
                      alt={selectedDayMeals[type]}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1635321593217-40050ad13c74';
                        e.target.alt = 'Default food image';
                      }}
                    />
                  </div>
                )}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-base font-semibold text-gray-800">{selectedDayMeals[type]}</p>
                  <p className="text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                    {getCalories(selectedDayMeals[type])} calories
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

export default MealPlan;
