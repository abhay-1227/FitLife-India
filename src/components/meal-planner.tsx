'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Utensils,
  Calendar,
  ShoppingBag,
  ChefHat,
  Plus,
  X,
  Flame,
  Drumstick,
  Wheat,
  Droplets,
  Sparkles,
  Save,
  Download,
  Trash2,
  Sun,
  CloudSun,
  Moon,
  Coffee,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FoodDbItem {
  cal: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  sugar: number
  sodium: number
}

interface FoodItem {
  name: string
  qty: number
  cal: number
  protein: number
  carbs: number
  fats: number
}

interface MealSlot {
  mealType: string
  label: string
  icon: React.ElementType
  color: string
  foods: FoodItem[]
}

interface DayPlan {
  day: string
  label: string
  meals: MealSlot[]
}

// ─── Food Database (from nutrition-page.tsx) ────────────────────────────────

const FOOD_DB: Record<string, FoodDbItem> = {
  roti: { cal: 120, protein: 3.5, carbs: 20, fats: 3.7, fiber: 3.2, sugar: 1.0, sodium: 180 },
  chapati: { cal: 120, protein: 3.5, carbs: 20, fats: 3.7, fiber: 3.2, sugar: 1.0, sodium: 180 },
  rice: { cal: 206, protein: 4.3, carbs: 45, fats: 0.4, fiber: 0.6, sugar: 0.1, sodium: 2 },
  dal: { cal: 170, protein: 9.0, carbs: 24, fats: 4.0, fiber: 5.0, sugar: 2.0, sodium: 320 },
  rajma: { cal: 210, protein: 11.0, carbs: 30, fats: 4.5, fiber: 8.0, sugar: 3.0, sodium: 280 },
  paneer: { cal: 265, protein: 18.3, carbs: 1.2, fats: 20.8, fiber: 0, sugar: 1.2, sodium: 420 },
  chicken: { cal: 239, protein: 27.0, carbs: 0, fats: 14.0, fiber: 0, sugar: 0, sodium: 350 },
  egg: { cal: 155, protein: 13.0, carbs: 1.1, fats: 11.0, fiber: 0, sugar: 1.1, sodium: 170 },
  milk: { cal: 149, protein: 8.0, carbs: 12, fats: 8.0, fiber: 0, sugar: 12, sodium: 105 },
  curd: { cal: 98, protein: 11.0, carbs: 3.4, fats: 4.3, fiber: 0, sugar: 3.4, sodium: 70 },
  sabzi: { cal: 130, protein: 4.0, carbs: 12, fats: 7.0, fiber: 3.5, sugar: 4.0, sodium: 350 },
  'dal makhani': { cal: 230, protein: 9.0, carbs: 25, fats: 11.0, fiber: 6.0, sugar: 3.0, sodium: 480 },
  'palak paneer': { cal: 260, protein: 14.0, carbs: 8.0, fats: 20.0, fiber: 3.5, sugar: 2.0, sodium: 520 },
  chole: { cal: 220, protein: 12.0, carbs: 28, fats: 7.0, fiber: 8.0, sugar: 4.0, sodium: 380 },
  samosa: { cal: 262, protein: 4.0, carbs: 24, fats: 17.0, fiber: 2.5, sugar: 1.5, sodium: 540 },
  paratha: { cal: 200, protein: 5.0, carbs: 26, fats: 8.0, fiber: 3.0, sugar: 1.0, sodium: 320 },
  idli: { cal: 130, protein: 3.0, carbs: 26, fats: 1.0, fiber: 1.5, sugar: 0.5, sodium: 250 },
  dosa: { cal: 168, protein: 4.0, carbs: 24, fats: 6.0, fiber: 1.5, sugar: 1.0, sodium: 290 },
  biryani: { cal: 350, protein: 14.0, carbs: 40, fats: 13.0, fiber: 2.0, sugar: 2.0, sodium: 550 },
  lassi: { cal: 160, protein: 6.0, carbs: 22, fats: 5.0, fiber: 0, sugar: 20, sodium: 90 },
  chai: { cal: 95, protein: 3.0, carbs: 12, fats: 3.0, fiber: 0, sugar: 10, sodium: 65 },
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CALORIE_TARGET = 2000
const PROTEIN_TARGET = 150
const CARBS_TARGET = 250
const FATS_TARGET = 65

const DAYS = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' },
]

const MEAL_TYPES: { id: string; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'breakfast', label: 'Breakfast', icon: Sun, color: 'from-amber-400 to-orange-500' },
  { id: 'lunch', label: 'Lunch', icon: CloudSun, color: 'from-teal-400 to-emerald-500' },
  { id: 'snack', label: 'Snack', icon: Coffee, color: 'from-purple-400 to-pink-500' },
  { id: 'dinner', label: 'Dinner', icon: Moon, color: 'from-indigo-400 to-violet-500' },
]

// ─── Indian Meal Suggestions ────────────────────────────────────────────────

const INDIAN_MEAL_SUGGESTIONS: Record<string, { name: string; foods: { name: string; qty: number }[] }[]> = {
  breakfast: [
    { name: 'South Indian', foods: [{ name: 'idli', qty: 3 }, { name: 'chai', qty: 1 }] },
    { name: 'North Indian', foods: [{ name: 'paratha', qty: 2 }, { name: 'curd', qty: 1 }, { name: 'chai', qty: 1 }] },
    { name: 'Light & Protein', foods: [{ name: 'egg', qty: 2 }, { name: 'roti', qty: 1 }, { name: 'chai', qty: 1 }] },
    { name: 'Classic Dosa', foods: [{ name: 'dosa', qty: 2 }, { name: 'chai', qty: 1 }] },
  ],
  lunch: [
    { name: 'Dal-Chawal', foods: [{ name: 'rice', qty: 1 }, { name: 'dal', qty: 1 }, { name: 'sabzi', qty: 1 }, { name: 'roti', qty: 1 }] },
    { name: 'Paneer Meal', foods: [{ name: 'palak paneer', qty: 1 }, { name: 'rice', qty: 1 }, { name: 'roti', qty: 1 }] },
    { name: 'Chicken Biryani', foods: [{ name: 'biryani', qty: 1 }, { name: 'curd', qty: 1 }] },
    { name: 'Chole Bhature', foods: [{ name: 'chole', qty: 1 }, { name: 'roti', qty: 2 }] },
  ],
  snack: [
    { name: 'Light Snack', foods: [{ name: 'chai', qty: 1 }, { name: 'samosa', qty: 1 }] },
    { name: 'Healthy', foods: [{ name: 'lassi', qty: 1 }, { name: 'curd', qty: 1 }] },
    { name: 'Protein Snack', foods: [{ name: 'egg', qty: 1 }, { name: 'chai', qty: 1 }] },
  ],
  dinner: [
    { name: 'Dal Roti', foods: [{ name: 'roti', qty: 2 }, { name: 'dal makhani', qty: 1 }, { name: 'sabzi', qty: 1 }] },
    { name: 'Chicken Dinner', foods: [{ name: 'chicken', qty: 1 }, { name: 'rice', qty: 1 }, { name: 'sabzi', qty: 1 }] },
    { name: 'Rajma Chawal', foods: [{ name: 'rajma', qty: 1 }, { name: 'rice', qty: 1 }, { name: 'roti', qty: 1 }] },
    { name: 'Paneer Dinner', foods: [{ name: 'paneer', qty: 1 }, { name: 'roti', qty: 2 }, { name: 'dal', qty: 1 }] },
  ],
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createEmptyMeals(): MealSlot[] {
  return MEAL_TYPES.map((m) => ({
    mealType: m.id,
    label: m.label,
    icon: m.icon,
    color: m.color,
    foods: [],
  }))
}

function createEmptyWeek(): DayPlan[] {
  return DAYS.map((d) => ({
    day: d.id,
    label: d.label,
    meals: createEmptyMeals(),
  }))
}

function getDayTotals(meals: MealSlot[]) {
  return meals.reduce(
    (acc, meal) => {
      for (const food of meal.foods) {
        acc.calories += food.cal
        acc.protein += food.protein
        acc.carbs += food.carbs
        acc.fats += food.fats
      }
      return acc
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )
}

function foodItemFromDb(name: string, qty: number): FoodItem {
  const item = FOOD_DB[name]
  if (!item) {
    return { name, qty, cal: 0, protein: 0, carbs: 0, fats: 0 }
  }
  return {
    name,
    qty,
    cal: Math.round(item.cal * qty),
    protein: Math.round(item.protein * qty * 10) / 10,
    carbs: Math.round(item.carbs * qty * 10) / 10,
    fats: Math.round(item.fats * qty * 10) / 10,
  }
}

// ─── Animation Variants ──────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const cardTransition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
}

// ─── SVG Donut Chart ────────────────────────────────────────────────────────

function DonutChart({ protein, carbs, fats }: { protein: number; carbs: number; fats: number }) {
  const total = protein + carbs + fats
  const RADIUS = 60
  const STROKE = 14
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  if (total === 0) {
    return (
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle
          cx="75"
          cy="75"
          r={RADIUS}
          fill="none"
          stroke="oklch(1 0 0 / 8%)"
          strokeWidth={STROKE}
        />
        <text x="75" y="72" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-muted-foreground">
          No data
        </text>
        <text x="75" y="90" textAnchor="middle" fontSize="10" className="fill-muted-foreground/50">
          Add meals
        </text>
      </svg>
    )
  }

  const proteinPct = protein / total
  const carbsPct = carbs / total
  const fatsPct = fats / total

  const proteinLen = CIRCUMFERENCE * proteinPct
  const carbsLen = CIRCUMFERENCE * carbsPct
  const fatsLen = CIRCUMFERENCE * fatsPct

  const proteinOffset = 0
  const carbsOffset = proteinLen
  const fatsOffset = proteinLen + carbsLen

  return (
    <svg width="150" height="150" viewBox="0 0 150 150" className="transform -rotate-90">
      {/* Background ring */}
      <circle
        cx="75"
        cy="75"
        r={RADIUS}
        fill="none"
        stroke="oklch(1 0 0 / 6%)"
        strokeWidth={STROKE}
      />
      {/* Protein arc */}
      <circle
        cx="75"
        cy="75"
        r={RADIUS}
        fill="none"
        stroke="oklch(0.696 0.17 162.48)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={`${proteinLen} ${CIRCUMFERENCE - proteinLen}`}
        strokeDashoffset={-proteinOffset}
        style={{ transition: 'stroke-dasharray 0.6s ease-out, stroke-dashoffset 0.6s ease-out' }}
      />
      {/* Carbs arc */}
      <circle
        cx="75"
        cy="75"
        r={RADIUS}
        fill="none"
        stroke="oklch(0.828 0.189 84.429)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={`${carbsLen} ${CIRCUMFERENCE - carbsLen}`}
        strokeDashoffset={-carbsOffset}
        style={{ transition: 'stroke-dasharray 0.6s ease-out, stroke-dashoffset 0.6s ease-out' }}
      />
      {/* Fats arc */}
      <circle
        cx="75"
        cy="75"
        r={RADIUS}
        fill="none"
        stroke="oklch(0.705 0.213 47)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={`${fatsLen} ${CIRCUMFERENCE - fatsLen}`}
        strokeDashoffset={-fatsOffset}
        style={{ transition: 'stroke-dasharray 0.6s ease-out, stroke-dashoffset 0.6s ease-out' }}
      />
    </svg>
  )
}

// ─── Calorie Target Bar ─────────────────────────────────────────────────────

function CalorieBar({ actual, target }: { actual: number; target: number }) {
  const pct = Math.min((actual / target) * 100, 100)
  const isOver = actual > target
  const remaining = Math.max(target - actual, 0)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          <Flame className="h-4 w-4 inline mr-1 text-orange-400" />
          {Math.round(actual)} / {target} kcal
        </span>
        <span className={`text-xs font-semibold ${isOver ? 'text-red-400' : 'text-teal-400'}`}>
          {isOver ? `${Math.round(actual - target)} over` : `${Math.round(remaining)} remaining`}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isOver ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ─── Food Search Dropdown ───────────────────────────────────────────────────

function FoodSearchDropdown({
  onSelect,
  onClose,
}: {
  onSelect: (name: string) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const filtered = Object.keys(FOOD_DB).filter((k) =>
    k.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute z-30 top-full left-0 right-0 mt-1 glass-strong p-3 space-y-2"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search food..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 px-3 py-1.5 text-sm outline-none transition-all"
          autoFocus
        />
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-1">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2 text-center">No foods found</p>
        ) : (
          filtered.map((name) => (
            <button
              key={name}
              onClick={() => {
                onSelect(name)
                onClose()
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-sm transition-colors"
            >
              <span className="text-foreground capitalize">{name}</span>
              <span className="text-xs text-muted-foreground">
                {FOOD_DB[name].cal} kcal
              </span>
            </button>
          ))
        )}
      </div>
    </motion.div>
  )
}

// ─── Meal Card ──────────────────────────────────────────────────────────────

function MealCard({
  meal,
  onAddFood,
  onRemoveFood,
  onSuggestMeal,
}: {
  meal: MealSlot
  onAddFood: (food: FoodItem) => void
  onRemoveFood: (index: number) => void
  onSuggestMeal: () => void
}) {
  const [showSearch, setShowSearch] = useState(false)
  const Icon = meal.icon

  const mealTotals = meal.foods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.cal,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fats: acc.fats + f.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )

  const handleSelectFood = (name: string) => {
    const item = foodItemFromDb(name, 1)
    onAddFood(item)
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meal.color} flex items-center justify-center`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{meal.label}</h3>
            {meal.foods.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {Math.round(mealTotals.calories)} kcal &middot; P:{mealTotals.protein.toFixed(1)}g &middot; C:{mealTotals.carbs.toFixed(1)}g &middot; F:{mealTotals.fats.toFixed(1)}g
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSuggestMeal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/20 text-teal-400 hover:border-teal-500/40 transition-all"
            title="Suggest Indian Meal"
          >
            <ChefHat className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Suggest</span>
          </button>
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>

      {/* Food items list */}
      <AnimatePresence>
        {meal.foods.length > 0 && (
          <div className="space-y-1.5 mb-2">
            {meal.foods.map((food, idx) => (
              <motion.div
                key={`${food.name}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between bg-white/3 border border-white/6 rounded-lg px-3 py-2 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground capitalize truncate">
                    {food.qty}x {food.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {food.cal} kcal
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => onRemoveFood(idx)}
                    className="p-1 rounded hover:bg-red-400/10 text-muted-foreground hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    aria-label={`Remove ${food.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {meal.foods.length === 0 && !showSearch && (
        <p className="text-xs text-muted-foreground/50 text-center py-3">
          No foods added yet
        </p>
      )}

      {/* Food search dropdown */}
      <div className="relative">
        <AnimatePresence>
          {showSearch && (
            <FoodSearchDropdown
              onSelect={handleSelectFood}
              onClose={() => setShowSearch(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Meal Suggestion Dialog ─────────────────────────────────────────────────

function MealSuggestionPanel({
  mealType,
  onSelect,
  onClose,
  remainingCalories,
}: {
  mealType: string
  onSelect: (foods: FoodItem[]) => void
  onClose: () => void
  remainingCalories: number
}) {
  const suggestions = INDIAN_MEAL_SUGGESTIONS[mealType] || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-strong p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-teal-400" />
            <h3 className="text-lg font-semibold text-foreground">Indian Meal Suggestions</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Remaining calories: <span className="text-teal-400 font-semibold">{Math.round(remainingCalories)} kcal</span>
        </p>
        <div className="space-y-3">
          {suggestions.map((suggestion) => {
            const foods = suggestion.foods.map((f) => foodItemFromDb(f.name, f.qty))
            const totalCal = foods.reduce((s, f) => s + f.cal, 0)
            const totalProtein = foods.reduce((s, f) => s + f.protein, 0)
            const totalCarbs = foods.reduce((s, f) => s + f.carbs, 0)
            const totalFats = foods.reduce((s, f) => s + f.fats, 0)
            const fits = totalCal <= remainingCalories

            return (
              <button
                key={suggestion.name}
                onClick={() => onSelect(foods)}
                className={`w-full text-left glass-card p-4 transition-all ${
                  fits ? 'hover:border-teal-500/40' : 'opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{suggestion.name}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    fits ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {totalCal} kcal {fits ? '✓' : '⚠'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {suggestion.foods.map((f) => (
                    <span key={f.name} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground capitalize">
                      {f.qty}x {f.name}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 text-[10px] text-muted-foreground">
                  <span>P: {totalProtein.toFixed(1)}g</span>
                  <span>C: {totalCarbs.toFixed(1)}g</span>
                  <span>F: {totalFats.toFixed(1)}g</span>
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Grocery List ────────────────────────────────────────────────────────────

function GroceryListPanel({
  weekPlan,
  onClose,
}: {
  weekPlan: DayPlan[]
  onClose: () => void
}) {
  const groceryMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const day of weekPlan) {
      for (const meal of day.meals) {
        for (const food of meal.foods) {
          map[food.name] = (map[food.name] || 0) + food.qty
        }
      }
    }
    return map
  }, [weekPlan])

  const entries = Object.entries(groceryMap).sort((a, b) => b[1] - a[1])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-strong p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-foreground">Grocery List</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No meals planned yet. Add foods to see your grocery list.
          </p>
        ) : (
          <div className="space-y-2">
            {entries.map(([name, qty]) => (
              <div
                key={name}
                className="flex items-center justify-between bg-white/3 border border-white/6 rounded-lg px-4 py-2.5"
              >
                <span className="text-sm font-medium text-foreground capitalize">{name}</span>
                <span className="text-sm text-teal-400 font-semibold">{qty}x</span>
              </div>
            ))}
            <div className="pt-3 border-t border-white/10 text-xs text-muted-foreground">
              Total items: {entries.length} &middot; Total servings: {entries.reduce((s, [, q]) => s + q, 0)}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MealPlanner() {
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(createEmptyWeek)
  const [selectedDay, setSelectedDay] = useState<string>('monday')
  const [suggestingMeal, setSuggestingMeal] = useState<string | null>(null)
  const [showGrocery, setShowGrocery] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load meal plans from database
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch('/api/meals?userId=guest')
        if (res.ok) {
          const plans = await res.json() as {
            id: string
            day: string
            mealType: string
            foods: string
            calories: number
            protein: number
            carbs: number
            fats: number
          }[]

          if (plans.length > 0) {
            const newWeek = createEmptyWeek()
            for (const plan of plans) {
              const dayIdx = newWeek.findIndex((d) => d.day === plan.day)
              const mealIdx = dayIdx >= 0 ? newWeek[dayIdx].meals.findIndex((m) => m.mealType === plan.mealType) : -1
              if (dayIdx >= 0 && mealIdx >= 0) {
                try {
                  const foods = JSON.parse(plan.foods) as { name: string; qty: number; cal: number; protein: number; carbs: number; fats: number }[]
                  newWeek[dayIdx].meals[mealIdx].foods = foods
                } catch {
                  // Invalid JSON, skip
                }
              }
            }
            setWeekPlan(newWeek)
          }
        }
      } catch (err) {
        console.error('Failed to load meal plans:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMeals()
  }, [])

  // Current day data
  const currentDayIdx = DAYS.findIndex((d) => d.id === selectedDay)
  const currentDay = weekPlan[currentDayIdx] || weekPlan[0]
  const dayTotals = useMemo(() => getDayTotals(currentDay.meals), [currentDay.meals])

  // Week totals
  const weekTotals = useMemo(() => {
    return weekPlan.reduce(
      (acc, day) => {
        const dt = getDayTotals(day.meals)
        acc.calories += dt.calories
        acc.protein += dt.protein
        acc.carbs += dt.carbs
        acc.fats += dt.fats
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )
  }, [weekPlan])

  // Add food to a meal
  const handleAddFood = useCallback((dayIdx: number, mealIdx: number, food: FoodItem) => {
    setWeekPlan((prev) => {
      const newPlan = [...prev]
      newPlan[dayIdx] = {
        ...newPlan[dayIdx],
        meals: newPlan[dayIdx].meals.map((m, i) =>
          i === mealIdx ? { ...m, foods: [...m.foods, food] } : m
        ),
      }
      return newPlan
    })
  }, [])

  // Remove food from a meal
  const handleRemoveFood = useCallback((dayIdx: number, mealIdx: number, foodIdx: number) => {
    setWeekPlan((prev) => {
      const newPlan = [...prev]
      newPlan[dayIdx] = {
        ...newPlan[dayIdx],
        meals: newPlan[dayIdx].meals.map((m, i) =>
          i === mealIdx
            ? { ...m, foods: m.foods.filter((_, fi) => fi !== foodIdx) }
            : m
        ),
      }
      return newPlan
    })
  }, [])

  // Suggest meal: auto-fill balanced Indian meal
  const handleSuggestMeal = useCallback((mealType: string) => {
    setSuggestingMeal(mealType)
  }, [])

  const handleSelectSuggestion = useCallback((foods: FoodItem[]) => {
    if (!suggestingMeal) return
    const dayIdx = DAYS.findIndex((d) => d.id === selectedDay)
    const mealIdx = MEAL_TYPES.findIndex((m) => m.id === suggestingMeal)
    if (dayIdx < 0 || mealIdx < 0) return

    setWeekPlan((prev) => {
      const newPlan = [...prev]
      newPlan[dayIdx] = {
        ...newPlan[dayIdx],
        meals: newPlan[dayIdx].meals.map((m, i) =>
          i === mealIdx ? { ...m, foods: [...m.foods, ...foods] } : m
        ),
      }
      return newPlan
    })

    setSuggestingMeal(null)
    toast({
      title: 'Meal suggested!',
      description: `Added ${foods.map((f) => f.name).join(', ')} to ${MEAL_TYPES[mealIdx].label}`,
    })
  }, [suggestingMeal, selectedDay])

  // Auto-suggest balanced Indian meal based on remaining calories
  const handleAutoSuggest = useCallback(() => {
    const remaining = CALORIE_TARGET - dayTotals.calories
    if (remaining <= 0) {
      toast({ title: 'Calorie target reached', description: 'No remaining calories for suggestions.' })
      return
    }

    // Find empty or least-filled meals for the current day
    const emptyMeals = currentDay.meals
      .filter((m) => m.foods.length === 0)
      .map((m) => m.mealType)

    if (emptyMeals.length === 0) {
      toast({ title: 'All meals filled', description: 'Remove some foods to get suggestions.' })
      return
    }

    // Auto-fill each empty meal with the best suggestion
    const dayIdx = DAYS.findIndex((d) => d.id === selectedDay)
    setWeekPlan((prev) => {
      const newPlan = [...prev]
      let calRemaining = remaining

      for (const mealType of emptyMeals) {
        if (calRemaining <= 0) break
        const mealIdx = MEAL_TYPES.findIndex((m) => m.id === mealType)
        if (mealIdx < 0) continue

        const suggestions = INDIAN_MEAL_SUGGESTIONS[mealType] || []
        // Pick the suggestion that fits within remaining calories
        const best = suggestions.find((s) => {
          const totalCal = s.foods.reduce((sum, f) => {
            const item = FOOD_DB[f.name]
            return sum + (item ? item.cal * f.qty : 0)
          }, 0)
          return totalCal <= calRemaining
        })

        if (best) {
          const foods = best.foods.map((f) => foodItemFromDb(f.name, f.qty))
          const mealCal = foods.reduce((s, f) => s + f.cal, 0)
          newPlan[dayIdx] = {
            ...newPlan[dayIdx],
            meals: newPlan[dayIdx].meals.map((m, i) =>
              i === mealIdx ? { ...m, foods: [...m.foods, ...foods] } : m
            ),
          }
          calRemaining -= mealCal
        }
      }
      return newPlan
    })

    toast({
      title: 'Auto-suggested meals!',
      description: `Filled empty meals with balanced Indian options`,
    })
  }, [selectedDay, currentDay, dayTotals.calories])

  // Save meal plans to database
  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      for (const day of weekPlan) {
        for (const meal of day.meals) {
          const totalCal = meal.foods.reduce((s, f) => s + f.cal, 0)
          const totalProtein = meal.foods.reduce((s, f) => s + f.protein, 0)
          const totalCarbs = meal.foods.reduce((s, f) => s + f.carbs, 0)
          const totalFats = meal.foods.reduce((s, f) => s + f.fats, 0)

          await fetch('/api/meals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              day: day.day,
              mealType: meal.mealType,
              foods: JSON.stringify(meal.foods),
              calories: Math.round(totalCal),
              protein: Math.round(totalProtein * 10) / 10,
              carbs: Math.round(totalCarbs * 10) / 10,
              fats: Math.round(totalFats * 10) / 10,
              userId: 'guest',
            }),
          })
        }
      }
      toast({ title: 'Meal plan saved!', description: 'Your weekly meal plan has been saved.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to save meal plan.' })
    } finally {
      setSaving(false)
    }
  }, [weekPlan])

  // Clear all meals
  const handleClear = useCallback(() => {
    setWeekPlan(createEmptyWeek())
    toast({ title: 'Cleared', description: 'All meal plans have been reset.' })
  }, [])

  // Input style
  const inputCls =
    'bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 px-3 py-2 text-sm w-full outline-none transition-all'

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your meal plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Background decorative orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="floating-orb"
          style={{
            width: '500px',
            height: '500px',
            background: 'oklch(0.5 0.12 162 / 8%)',
            top: '-10%',
            left: '-5%',
          }}
        />
        <div
          className="floating-orb"
          style={{
            width: '400px',
            height: '400px',
            background: 'oklch(0.7 0.15 84 / 6%)',
            bottom: '-5%',
            right: '-5%',
            animationDelay: '-7s',
          }}
        />
      </div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
            Meal Planner
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Plan your weekly meals with balanced Indian nutrition
        </p>
      </motion.div>

      {/* Action Buttons Row */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={cardTransition}
        className="flex flex-wrap gap-2 mb-6"
      >
        <button
          onClick={handleAutoSuggest}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-emerald-600 text-background hover:from-teal-400 hover:to-emerald-500 transition-all shadow-lg shadow-teal-500/25"
        >
          <Sparkles className="h-4 w-4" />
          Auto-Suggest Day
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-all disabled:opacity-50"
        >
          {saving ? (
            <div className="h-4 w-4 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Plan
        </button>
        <button
          onClick={() => setShowGrocery(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-all"
        >
          <ShoppingBag className="h-4 w-4" />
          Grocery List
        </button>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-400/20 transition-all"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </motion.div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left: Day Tabs + Meal Cards */}
        <div className="space-y-6">
          {/* Day Selector Tabs */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.1 }}
            className="glass-card p-2"
          >
            <div className="flex gap-1 overflow-x-auto">
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`relative flex-1 min-w-[48px] px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedDay === day.id
                      ? 'text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {selectedDay === day.id && (
                    <motion.div
                      layoutId="activeDayTab"
                      className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">{day.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Meal Cards for Selected Day */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {currentDay.meals.map((meal, mealIdx) => (
                <MealCard
                  key={meal.mealType}
                  meal={meal}
                  onAddFood={(food) => handleAddFood(currentDayIdx, mealIdx, food)}
                  onRemoveFood={(foodIdx) => handleRemoveFood(currentDayIdx, mealIdx, foodIdx)}
                  onSuggestMeal={() => handleSuggestMeal(meal.mealType)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Quick Add Custom Food */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.2 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Plus className="h-4 w-4 text-teal-400" />
              <h3 className="text-sm font-semibold text-foreground">Quick Add Custom Food</h3>
            </div>
            <QuickAddForm
              onAdd={(food) => {
                // Add to first empty meal of current day, or breakfast
                const emptyMealIdx = currentDay.meals.findIndex((m) => m.foods.length === 0)
                const targetMealIdx = emptyMealIdx >= 0 ? emptyMealIdx : 0
                handleAddFood(currentDayIdx, targetMealIdx, food)
              }}
              inputCls={inputCls}
            />
          </motion.div>
        </div>

        {/* Right: Summary Sidebar */}
        <div className="space-y-6">
          {/* Calorie Target Bar */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.15 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-semibold text-foreground">Daily Calories</h2>
            </div>
            <CalorieBar actual={dayTotals.calories} target={CALORIE_TARGET} />
          </motion.div>

          {/* Plate Composition Donut */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.25 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="h-5 w-5 text-teal-400" />
              <h2 className="text-lg font-semibold text-foreground">Plate Composition</h2>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <DonutChart
                  protein={dayTotals.protein}
                  carbs={dayTotals.carbs}
                  fats={dayTotals.fats}
                />
                {/* Center overlay text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-bold text-foreground">
                    {dayTotals.calories > 0 ? Math.round(dayTotals.calories) : '—'}
                  </span>
                  <span className="text-[10px] text-muted-foreground">kcal</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-teal-500" />
                <span className="text-xs text-muted-foreground">
                  Protein {dayTotals.protein > 0 ? `${Math.round((dayTotals.protein / (dayTotals.protein + dayTotals.carbs + dayTotals.fats)) * 100)}%` : '0%'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-xs text-muted-foreground">
                  Carbs {dayTotals.carbs > 0 ? `${Math.round((dayTotals.carbs / (dayTotals.protein + dayTotals.carbs + dayTotals.fats)) * 100)}%` : '0%'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs text-muted-foreground">
                  Fats {dayTotals.fats > 0 ? `${Math.round((dayTotals.fats / (dayTotals.protein + dayTotals.carbs + dayTotals.fats)) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Macro Summary */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.35 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Drumstick className="h-5 w-5 text-teal-400" />
              <h2 className="text-lg font-semibold text-foreground">Macro Summary</h2>
            </div>
            <div className="space-y-4">
              {/* Protein */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Drumstick className="h-3.5 w-3.5" />
                    <span className="font-medium">Protein</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {dayTotals.protein.toFixed(1)}g / {PROTEIN_TARGET}g
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((dayTotals.protein / PROTEIN_TARGET) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
              {/* Carbs */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Wheat className="h-3.5 w-3.5" />
                    <span className="font-medium">Carbs</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {dayTotals.carbs.toFixed(1)}g / {CARBS_TARGET}g
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((dayTotals.carbs / CARBS_TARGET) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
              {/* Fats */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Droplets className="h-3.5 w-3.5" />
                    <span className="font-medium">Fats</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {dayTotals.fats.toFixed(1)}g / {FATS_TARGET}g
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((dayTotals.fats / FATS_TARGET) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Weekly Overview */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.45 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-foreground">Week Overview</h2>
            </div>
            <div className="space-y-2">
              {weekPlan.map((day) => {
                const dt = getDayTotals(day.meals)
                const pct = Math.min((dt.calories / CALORIE_TARGET) * 100, 100)
                const isSelected = day.day === selectedDay

                return (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      isSelected ? 'bg-teal-500/10 border border-teal-500/20' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-xs font-medium w-8 ${isSelected ? 'text-teal-400' : 'text-muted-foreground'}`}>
                      {day.label}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          dt.calories > CALORIE_TARGET
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-14 text-right">
                      {Math.round(dt.calories)}/{CALORIE_TARGET}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
              <span>Weekly avg: {weekTotals.calories > 0 ? Math.round(weekTotals.calories / 7) : 0} kcal/day</span>
              <span>Total: {Math.round(weekTotals.calories)} kcal</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Suggestion Panel Modal */}
      <AnimatePresence>
        {suggestingMeal && (
          <MealSuggestionPanel
            mealType={suggestingMeal}
            onSelect={handleSelectSuggestion}
            onClose={() => setSuggestingMeal(null)}
            remainingCalories={CALORIE_TARGET - dayTotals.calories}
          />
        )}
      </AnimatePresence>

      {/* Grocery List Modal */}
      <AnimatePresence>
        {showGrocery && (
          <GroceryListPanel
            weekPlan={weekPlan}
            onClose={() => setShowGrocery(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Quick Add Form (sub-component) ─────────────────────────────────────────

function QuickAddForm({
  onAdd,
  inputCls,
}: {
  onAdd: (food: FoodItem) => void
  inputCls: string
}) {
  const [name, setName] = useState('')
  const [cal, setCal] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast({ title: 'Food name required', description: 'Please enter a food name.' })
      return
    }

    onAdd({
      name: name.trim().toLowerCase(),
      qty: 1,
      cal: parseFloat(cal) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fats: parseFloat(fats) || 0,
    })

    toast({ title: `Added: ${name.trim()}`, description: `${cal || 0} kcal added to your meal plan.` })
    setName('')
    setCal('')
    setProtein('')
    setCarbs('')
    setFats('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Food name"
          className={`${inputCls} col-span-2 sm:col-span-1`}
        />
        <input
          type="number"
          value={cal}
          onChange={(e) => setCal(e.target.value)}
          placeholder="Calories"
          min="0"
          className={inputCls}
        />
        <input
          type="number"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          placeholder="Protein (g)"
          min="0"
          step="0.1"
          className={inputCls}
        />
        <input
          type="number"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
          placeholder="Carbs (g)"
          min="0"
          step="0.1"
          className={inputCls}
        />
        <input
          type="number"
          value={fats}
          onChange={(e) => setFats(e.target.value)}
          placeholder="Fats (g)"
          min="0"
          step="0.1"
          className={inputCls}
        />
      </div>
      <button
        type="submit"
        className="mt-3 flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-background hover:from-teal-400 hover:to-emerald-500 transition-all"
      >
        <Plus className="h-4 w-4" />
        Add Custom Food
      </button>
    </form>
  )
}
