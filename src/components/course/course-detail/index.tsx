
import { Star, Clock, Users, Award, CheckCircle, Play, BookOpen, Video, FileText, HelpCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useCourseById } from "@/hooks/queries";
import type { CurriculumSection, CourseReview } from "@/types/db/course/course";

interface CourseDetailProps {
  courseId: string;
}

export function CourseDetail({ courseId }: CourseDetailProps) {
  const { data: course, isLoading, error } = useCourseById(courseId);
  // const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300 dark:bg-gray-700"></div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The course you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getLectureIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      case 'assignment': return <FileText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // const toggleSection = (sectionId: string) => {
  //   const newExpanded = new Set(expandedSections);
  //   if (newExpanded.has(sectionId)) {
  //     newExpanded.delete(sectionId);
  //   } else {
  //     newExpanded.add(sectionId);
  //   }
  //   setExpandedSections(newExpanded);
  // };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header with Video/Thumbnail */}
      <div className="relative bg-black">
        <div className="aspect-video max-w-4xl mx-auto relative">
          {course.trailerVideo ? (
            <video
              className="w-full h-full object-cover"
              poster={course.thumbnail}
              controls
              preload="metadata"
            >
              <source src={course.trailerVideo} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-75" />
                <p className="text-lg">Preview not available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Course Title and Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  {course.subtitle}
                </p>
              )}

              {/* Rating and Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-lg">{course.averageRating}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    ({formatNumber(course.numberOfReviews)} ratings)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{formatNumber(course.totalStudents || 0)} students</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(course.duration)} of content</span>
                </div>
                <Badge variant="secondary">{course.level}</Badge>
                <Badge variant="secondary">{course.language}</Badge>
                {course.lastUpdated && (
                  <span className="text-gray-600 dark:text-gray-400">
                    Last updated {course.lastUpdated}
                  </span>
                )}
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={course.instructor?.profilePicture} />
                  <AvatarFallback>
                    {course.instructor?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Created by {course.instructor?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.instructor?.coursesCount} courses • {formatNumber(course.instructor?.studentsCount || 0)} students
                  </p>
                </div>
              </div>
            </div>

            {/* Course Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About this course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>

                {/* What you'll learn */}
                {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>What you'll learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.whatYouWillLearn.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {course.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Target Audience */}
                {course.targetAudience && course.targetAudience.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Who this course is for</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {course.targetAudience.map((audience, index) => (
                          <li key={index}>{audience}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Course content
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {course.curriculum?.length || 0} sections • {course.curriculum?.reduce((total, section) => total + section.lectures.length, 0) || 0} lectures
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                      {course.curriculum?.map((section: CurriculumSection) => (
                        <AccordionItem key={section.id} value={section.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full text-left">
                              <div>
                                <h3 className="font-medium">{section.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {section.lectures.length} lectures • {formatDuration(section.duration)}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pt-2">
                              {section.lectures.map((lecture) => (
                                <div key={lecture.id} className="flex items-center justify-between py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                                  <div className="flex items-center gap-3">
                                    {getLectureIcon(lecture.type)}
                                    <span className="text-sm">{lecture.title}</span>
                                    {lecture.preview && (
                                      <Badge variant="outline" className="text-xs">Preview</Badge>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDuration(lecture.duration)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={course.instructor?.profilePicture} />
                        <AvatarFallback className="text-lg">
                          {course.instructor?.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{course.instructor?.name}</h3>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{course.instructor?.rating}</span>
                            <span className="text-gray-600 dark:text-gray-400">Instructor Rating</span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {formatNumber(course.instructor?.studentsCount || 0)} students
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {course.instructor?.coursesCount} courses
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {course.instructor?.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student feedback</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{course.averageRating}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          course rating • {formatNumber(course.numberOfReviews)} ratings
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {course.reviews?.map((review: CourseReview) => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={review.user?.avatar} />
                              <AvatarFallback>
                                {review.user?.name?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{review.user?.name}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Video Preview */}
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="w-12 h-12 text-gray-500" />
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(course.price)}
                  </div>
                  {course.price > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      30-day money-back guarantee
                    </div>
                  )}
                </div>

                {/* Enroll Button */}
                <Button className="w-full mb-4" size="lg">
                  {course.price === 0 ? 'Enroll for Free' : 'Add to Cart'}
                </Button>

                {/* Course includes */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white">This course includes:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-gray-600" />
                      <span>{formatDuration(course.duration)} on-demand video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span>Downloadable resources</span>
                    </div>
                    {course.certificate && (
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-600" />
                        <span>Certificate of completion</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gray-600" />
                      <span>Full lifetime access</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Share */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Share this course
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm">Share</Button>
                    <Button variant="outline" size="sm">Gift</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
