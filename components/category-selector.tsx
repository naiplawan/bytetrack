"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { getCategories, type FoodCategory } from "@/lib/thai-food-api"
import { buttonTap } from "@/lib/motion-variants"

interface CategorySelectorProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export default function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
  const [categories, setCategories] = useState<FoodCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  if (isLoading) {
    return (
      <div className="py-2">
        <div className="flex gap-2 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap pb-2">
      <div className="flex gap-2 py-1">
        {categories.map((category) => (
          <motion.div key={category.id} whileTap={buttonTap.tap}>
            <Badge
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 text-sm ${
                selectedCategory === category.id ? "bg-black hover:bg-gray-800" : "bg-[#c2e8d7] hover:bg-[#a5d8c1]"
              }`}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
            </Badge>
          </motion.div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
