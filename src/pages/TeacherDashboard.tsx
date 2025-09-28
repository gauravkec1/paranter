import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  Settings,
  BarChart3,
  Star,
  Award,
  Target,
  Activity,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  FileText,
  Presentation,
  GraduationCap
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function TeacherDashboard() {
  const { userProfile } = useAuth();
  const [studentCount, setStudentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentCount = async () => {
      if (!userProfile?.user_id) return;
      
      try {
        // Get teacher's classes first
        const { data: teacherClasses, error: classError } = await supabase
          .from('classes')
          .select('grade_level, section')
          .eq('teacher_id', userProfile.user_id);

        if (classError) {
          console.error('Error fetching teacher classes:', classError);
          toast.error('Failed to fetch class information');
          return;
        }

        // Count students in those classes
        let totalStudents = 0;
        if (teacherClasses && teacherClasses.length > 0) {
          for (const classInfo of teacherClasses) {
            const { count, error: countError } = await supabase
              .from('students')
              .select('*', { count: 'exact', head: true })
              .eq('grade_level', classInfo.grade_level)
              .eq('class_section', classInfo.section)
              .eq('is_active', true);

            if (countError) {
              console.error('Error counting students:', countError);
            } else {
              totalStudents += count || 0;
            }
          }
        }

        setStudentCount(totalStudents);
      } catch (error) {
        console.error('Error in fetchStudentCount:', error);
        toast.error('Failed to fetch student count');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentCount();
  }, [userProfile]);

  const stats = [
    {
      title: "Total Students",
      value: isLoading ? "..." : studentCount.toString(),
      change: "+5 this week",
      changeType: "positive",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Classes",
      value: "6",
      change: "2 today",
      changeType: "neutral",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      title: "Assignments",
      value: "18",
      change: "3 pending review",
      changeType: "pending",
      icon: FileText,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      title: "Messages",
      value: "12",
      change: "4 unread",
      changeType: "attention",
      icon: MessageSquare,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "assignment",
      title: "Math Quiz 3 submitted",
      student: "Sarah Johnson",
      time: "2 hours ago",
      status: "pending",
      avatar: "SJ",
      priority: "high"
    },
    {
      id: 2,
      type: "message",
      title: "Parent meeting request",
      student: "Alex Chen's parent",
      time: "4 hours ago",
      status: "unread",
      avatar: "AC",
      priority: "medium"
    },
    {
      id: 3,
      type: "attendance",
      title: "Perfect attendance milestone",
      student: "Grade 5A - Emma Wilson",
      time: "1 day ago",
      status: "completed",
      avatar: "EW",
      priority: "low"
    },
    {
      id: 4,
      type: "achievement",
      title: "Outstanding performance",
      student: "Michael Rodriguez",
      time: "2 days ago",
      status: "completed",
      avatar: "MR",
      priority: "high"
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      subject: "Advanced Mathematics",
      grade: "5A",
      time: "9:00 AM",
      duration: "60 min",
      students: 30,
      room: "Room 101",
      color: "bg-blue-500"
    },
    {
      id: 2,
      subject: "Physics Laboratory",
      grade: "5B",
      time: "11:00 AM",
      duration: "90 min",
      students: 28,
      room: "Lab 2",
      color: "bg-purple-500"
    },
    {
      id: 3,
      subject: "English Literature",
      grade: "5A",
      time: "2:00 PM",
      duration: "45 min",
      students: 30,
      room: "Room 101",
      color: "bg-emerald-500"
    }
  ];

  const studentPerformance = [
    { name: "Sarah Johnson", grade: "A+", progress: 95, trend: "up", subject: "Mathematics", improvement: "+8%" },
    { name: "Alex Chen", grade: "A", progress: 88, trend: "up", subject: "Physics", improvement: "+5%" },
    { name: "Emma Wilson", grade: "B+", progress: 82, trend: "stable", subject: "English", improvement: "0%" },
    { name: "Michael Rodriguez", grade: "B", progress: 75, trend: "down", subject: "Mathematics", improvement: "-3%" },
    { name: "Lisa Martinez", grade: "A-", progress: 85, trend: "up", subject: "Science", improvement: "+12%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Enhanced Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Teacher Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">Welcome back, {userProfile?.full_name || 'Teacher'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
              <Button variant="outline" size="sm" className="relative shadow-sm hover:shadow-md transition-shadow">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  3
                </Badge>
              </Button>
              <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar className="ring-2 ring-primary/20 ring-offset-2">
                <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                  {userProfile?.full_name?.split(' ').map(n => n[0]).join('') || 'T'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center space-x-1">
                      {stat.changeType === 'positive' && <ArrowUp className="h-3 w-3 text-emerald-600" />}
                      {stat.changeType === 'negative' && <ArrowDown className="h-3 w-3 text-red-600" />}
                      <p className={`text-xs font-medium ${
                        stat.changeType === 'positive' ? 'text-emerald-600' :
                        stat.changeType === 'negative' ? 'text-red-600' :
                        stat.changeType === 'attention' ? 'text-orange-600' :
                        'text-muted-foreground'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-background/80 backdrop-blur-sm shadow-sm border border-border/50 h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Classes</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Students</TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Assignments</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analytics</TabsTrigger>
          </TabsList>

          {/* Enhanced Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Upcoming Classes */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Clock className="h-6 w-6 mr-3 text-primary" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>Your upcoming classes and sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingClasses.map((class_) => (
                    <div key={class_.id} className="group p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all duration-200 border border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded-full ${class_.color} shadow-sm`}></div>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{class_.subject}</p>
                            <p className="text-sm text-muted-foreground">Grade {class_.grade} • {class_.room}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{class_.time}</p>
                          <p className="text-sm text-muted-foreground">{class_.duration} • {class_.students} students</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Enhanced Recent Activities */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Activity className="h-6 w-6 mr-3 text-primary" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>Latest updates and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="group flex items-center space-x-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all duration-200 border border-border/50">
                      <Avatar className="ring-2 ring-offset-2 ring-offset-background ring-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium">
                          {activity.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'assignment' ? 'bg-orange-100 text-orange-600' :
                        activity.type === 'message' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'attendance' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'assignment' && <FileText className="h-4 w-4" />}
                        {activity.type === 'message' && <MessageSquare className="h-4 w-4" />}
                        {activity.type === 'attendance' && <CheckCircle className="h-4 w-4" />}
                        {activity.type === 'achievement' && <Award className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.student}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={
                          activity.priority === 'high' ? 'destructive' : 
                          activity.priority === 'medium' ? 'default' : 
                          'secondary'
                        } className="text-xs">
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Student Performance Overview */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <Presentation className="h-6 w-6 mr-3 text-primary" />
                  Student Performance Overview
                </CardTitle>
                <CardDescription>Top performing students across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {studentPerformance.map((student, index) => (
                    <div key={index} className="group p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all duration-200 border border-border/50">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="ring-2 ring-offset-2 ring-offset-background ring-primary/20">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {index < 3 && (
                            <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                              {index + 1}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.subject}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="bg-background/50">{student.grade}</Badge>
                              <div className="flex items-center space-x-1">
                                {student.trend === 'up' && <ArrowUp className="h-4 w-4 text-emerald-600" />}
                                {student.trend === 'down' && <ArrowDown className="h-4 w-4 text-red-600" />}
                                {student.trend === 'stable' && <Target className="h-4 w-4 text-blue-600" />}
                                <span className={`text-sm font-medium ${
                                  student.trend === 'up' ? 'text-emerald-600' :
                                  student.trend === 'down' ? 'text-red-600' :
                                  'text-blue-600'
                                }`}>
                                  {student.improvement}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{student.progress}%</span>
                            </div>
                            <Progress value={student.progress} className="h-2 bg-muted/50" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Classes Tab */}
          <TabsContent value="classes">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">My Classes</CardTitle>
                    <CardDescription>Manage your classes and schedules</CardDescription>
                  </div>
                  <Button className="shadow-md hover:shadow-lg transition-shadow">
                    <Plus className="h-4 w-4 mr-2" />
                    New Class
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <div className="bg-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Classes Management</h3>
                  <p className="text-sm">Comprehensive class management features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Students Tab */}
          <TabsContent value="students">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Students</CardTitle>
                    <CardDescription>Monitor and manage student progress</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <div className="bg-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-12 w-12 opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Student Management</h3>
                  <p className="text-sm">Advanced student tracking and management tools coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Assignments Tab */}
          <TabsContent value="assignments">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Assignments</CardTitle>
                    <CardDescription>Create and manage student assignments</CardDescription>
                  </div>
                  <Button className="shadow-md hover:shadow-lg transition-shadow">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <div className="bg-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Calendar className="h-12 w-12 opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Assignment Center</h3>
                  <p className="text-sm">Comprehensive assignment creation and grading tools coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
              <CardHeader>
                <div>
                  <CardTitle className="text-xl">Analytics & Reports</CardTitle>
                  <CardDescription>Detailed insights into student performance and class metrics</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <div className="bg-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-sm">Comprehensive reporting and data visualization tools coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
