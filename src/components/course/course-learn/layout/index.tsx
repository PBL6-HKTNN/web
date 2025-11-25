


import { useCourseLearn } from "@/contexts/course/course-learn"
import ItemsListing from "./items-listing"
import { useNavigate, useParams } from "@tanstack/react-router"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { memo, useState } from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { Menu } from "lucide-react"

type CourseLearnLayoutProps = {
    children: React.ReactNode
}

export default function CourseLearnLayout({ children }: CourseLearnLayoutProps) {
    const { courseId, moduleId, lessonId } = useParams({strict: false })
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const [drawerOpen, setDrawerOpen] = useState(false)

    const { courseData, modulesWithLessons } = useCourseLearn()

    const currentModule = modulesWithLessons.find(m => m.id === moduleId)
    const currentLesson = currentModule?.lessons?.find(l => l.id === lessonId)
    
    // Determine if we're viewing a lesson or just a module
    const isViewingLesson = !!lessonId
    
    const CourseLearnSidebar = memo(() => {
        const handleLessonSelect = (moduleId: string, lessonId: string) => {
            navigate({
                to: "/learn/$courseId/$moduleId/$lessonId",
                params: {
                    courseId: courseId as string,
                    moduleId,
                    lessonId
                }
            })
            // Close drawer on mobile after selection
            if (isMobile) {
                setDrawerOpen(false)
            }
        }

        return (
            <div className="flex flex-col h-full border-r bg-background">
                <div className="border-b px-4 py-4">
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-foreground">
                            Course Content
                        </h2>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href="#"
                                        className="text-sm font-medium"
                                        onClick={() => navigate({ to: "/learn/$courseId", params: { courseId: courseId as string } })}
                                    >
                                        {courseData?.title || 'Course'}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {currentModule && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            {isViewingLesson ? (
                                                <BreadcrumbLink
                                                    href="#"
                                                    className="text-sm"
                                                    onClick={() => navigate({
                                                        to: "/learn/$courseId/$moduleId",
                                                        params: {
                                                            courseId: courseId as string,
                                                            moduleId: moduleId as string
                                                        }
                                                    })}
                                                >
                                                    {currentModule.title}
                                                </BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage className="text-sm">
                                                    {currentModule.title}
                                                </BreadcrumbPage>
                                            )}
                                        </BreadcrumbItem>
                                    </>
                                )}
                                {currentLesson && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="text-sm">
                                                {currentLesson.title}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => navigate({ to: "/learn/$courseId", params: { courseId: courseId as string } })}
                        >
                            Back to Course page
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <ItemsListing
                            modules={modulesWithLessons}
                            onLessonSelect={handleLessonSelect}
                            defaultExpandedModuleId={moduleId}
                        />
                    </ScrollArea>
                </div>
            </div>
        )
    })

    return (
        <>
            {isMobile ? (
                <div className="flex flex-col h-screen w-full">
                    {/* Mobile Header with Menu Button */}
                    <div className="border-b px-4 py-3 flex items-center justify-between bg-background sticky top-0 z-10">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                                <DrawerTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>Course Content</DrawerTitle>
                                    </DrawerHeader>
                                    <div className="max-h-[70vh] overflow-auto">
                                        <ItemsListing
                                            modules={modulesWithLessons}
                                            onLessonSelect={(moduleId: string, lessonId: string) => {
                                                navigate({
                                                    to: "/learn/$courseId/$moduleId/$lessonId",
                                                    params: {
                                                        courseId: courseId as string,
                                                        moduleId,
                                                        lessonId
                                                    }
                                                })
                                                setDrawerOpen(false)
                                            }}
                                            defaultExpandedModuleId={moduleId}
                                        />
                                    </div>
                                </DrawerContent>
                            </Drawer>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-sm font-semibold text-foreground truncate">
                                    {courseData?.title || 'Course'}
                                </h2>
                            </div>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 overflow-auto bg-background">
                        {children}
                    </div>
                </div>
            ) : (
                <ResizablePanelGroup direction="horizontal" className="h-screen min-h-screen w-full">
                    <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                        <CourseLearnSidebar/>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={70}>
                        <div className="h-full bg-background overflow-auto">
                            {children}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            )}
        </>
    )
}