import { render, screen, fireEvent, within } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ModuleAccordion from "./index"
import { LessonType } from "@/types/db/course/lesson"

const mockModule = {
  id: "m1",
  title: "Module 1",
  order: 1,
  numberOfLessons: 2,
  duration: 3600,
  courseId: "c1",
  lessons: [
    { id: "l1", title: "Lesson 1", duration: "600", orderIndex: 1, lessonType: LessonType.VIDEO, moduleId: "m1", contentUrl: "", isPreview: false },
    { id: "l2", title: "Lesson 2", duration: "1200", orderIndex: 2, lessonType: LessonType.QUIZ, moduleId: "m1", contentUrl: "", isPreview: false },
  ]
}

describe("ModuleAccordion", () => {
  it("renders header correctly", () => {
    render(<ModuleAccordion data={mockModule} />)
    // Only get header h3
    expect(screen.getByText("Module 1", { selector: "h3" })).toBeInTheDocument()
    expect(screen.getByText("2 lessons")).toBeInTheDocument()
    // Badge existence check
    expect(screen.getByText(/Module\s*1/i, { selector: "span" })).toBeInTheDocument()
  })

  it("renders lessons and calls onLessonSelect", () => {
    const onLessonSelect = vi.fn()
    render(<ModuleAccordion data={mockModule} onLessonSelect={onLessonSelect} />)

    // Opens accordion
    const trigger = document.querySelector('[data-slot="collapsible-trigger"]') as HTMLElement
    fireEvent.click(trigger)

    // Gets content inside accordion
    const content = document.querySelector('[data-slot="collapsible-content"]') as HTMLElement

    const lesson1 = within(content).getByText("Lesson 1")
    fireEvent.click(lesson1)
    expect(onLessonSelect).toHaveBeenCalledWith("m1", "l1")

    const lesson2 = within(content).getByText("Lesson 2")
    fireEvent.click(lesson2)
    expect(onLessonSelect).toHaveBeenCalledWith("m1", "l2")
  })

  it("shows empty state if no lessons", () => {
    render(<ModuleAccordion data={{ ...mockModule, lessons: [] }} />)

    // Opens accordion
    const trigger = document.querySelector('[data-slot="collapsible-trigger"]') as HTMLElement
    fireEvent.click(trigger)

    const content = document.querySelector('[data-slot="collapsible-content"]') as HTMLElement
    expect(within(content).getByText("No lessons in this module")).toBeInTheDocument()
  })
})
