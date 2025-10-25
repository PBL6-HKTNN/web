import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useCategories } from "@/hooks/queries";
import { Level, type GetCoursesRequest } from "@/types/db/course/course";

interface CourseFiltersProps {
  filters: GetCoursesRequest;
  onFiltersChange: (filters: GetCoursesRequest) => void;
  totalResults?: number;
}

const SORT_OPTIONS = [
  { value: "title", label: "Title A-Z" },
  { value: "price", label: "Price: Low to High" },
  { value: "rating", label: "Highest Rated" },
  { value: "createdAt", label: "Newest" },
  { value: "numberOfReviews", label: "Most Reviews" },
] as const;

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: Level.Beginner, label: "Beginner" },
  { value: Level.Intermediate, label: "Intermediate" },
  { value: Level.Advanced, label: "Advanced" },
];

export function CourseFilters({ filters, onFiltersChange, totalResults }: CourseFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { data: categoriesData } = useCategories();

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined, page: 1 });
  };

  const handleCategoryChange = (categoryId: string) => {
    const value = categoryId === "all" ? undefined : categoryId;
    onFiltersChange({ ...filters, categoryId: value, page: 1 });
  };

  const handleLevelChange = (level: string) => {
    const value = level === "all" ? undefined : level as Level;
    onFiltersChange({ ...filters, level: value, page: 1 });
  };

  const handlePriceRangeChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: values[0] === 0 ? undefined : values[0],
      maxPrice: values[1] === 200 ? undefined : values[1],
      page: 1
    });
  };

  const handleSortChange = (sortBy: string) => {
    const [field, order] = sortBy.split("-");
    onFiltersChange({
      ...filters,
      sortBy: field as GetCoursesRequest['sortBy'],
      sortOrder: (order as 'asc' | 'desc') || 'desc',
      page: 1
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: undefined,
      categoryId: undefined,
      level: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      pageSize: 12
    });
  };

  const activeFiltersCount = [
    filters.search,
    filters.categoryId,
    filters.level,
    filters.minPrice || filters.maxPrice
  ].filter(Boolean).length;

  const getSortValue = () => {
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    return `${sortBy}-${sortOrder}`;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search courses..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.categoryId || "all"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoriesData?.categories?.map((category) => (
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
                    value={filters.level || "all"}
                    onValueChange={handleLevelChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {LEVEL_OPTIONS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="px-2">
                    <Slider
                      value={[
                        filters.minPrice || 0,
                        filters.maxPrice || 200
                      ]}
                      onValueChange={handlePriceRangeChange}
                      max={200}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>${filters.minPrice || 0}</span>
                      <span>${filters.maxPrice || 200}{filters.maxPrice === 200 ? '+' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
