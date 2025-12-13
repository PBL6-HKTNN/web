import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useGetCategories } from "@/hooks/queries/course/category-hooks";
import { Level, type GetCoursesFilterReq } from "@/types/db/course";

interface CourseTableFiltersProps {
  filters: GetCoursesFilterReq;
  onFiltersChange: (filters: GetCoursesFilterReq) => void;
  totalResults?: number;
}

const SORT_OPTIONS = [
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
] as const;

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: Level.BEGINNER, label: "Beginner" },
  { value: Level.INTERMEDIATE, label: "Intermediate" },
  { value: Level.ADVANCED, label: "Advanced" },
];

export function CourseTableFilters({ filters, onFiltersChange, totalResults }: CourseTableFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { data: categoriesData } = useGetCategories();

  const handleCategoryChange = (categoryId: string) => {
    const value = categoryId === "all" ? undefined : categoryId;
    onFiltersChange({ ...filters, CategoryId: value, Page: 1 });
  };

  const handleLevelChange = (level: string) => {
    const value = level === "all" ? undefined : (parseInt(level) as Level);
    onFiltersChange({ ...filters, Level: value, Page: 1 });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      SortBy: sortBy as GetCoursesFilterReq['SortBy'],
      Page: 1
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      SortBy: 'price',
      Page: 1,
      PageSize: 12
    });
  };

  const activeFiltersCount = [
    filters.CategoryId,
    filters.Level
  ].filter(Boolean).length;

  const getSortValue = () => {
    return filters.SortBy || 'name';
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {totalResults !== undefined ? `${totalResults} courses found` : "Loading..."}
          </p>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <Select value={getSortValue()} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.CategoryId || "all"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoriesData?.data?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Level Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <Select
                    value={filters.Level?.toString() || "all"}
                    onValueChange={handleLevelChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {LEVEL_OPTIONS.map((level) => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
