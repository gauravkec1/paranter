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
  BarChart3
} from "lucide-react";

export default function TeacherDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "142",
      change: "+5 this week",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Classes",
      value: "6",
      change: "2 today",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Assignments",
      value: "18",
      change: "3 pending review",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Messages",
      value: "12",
      change: "4 unread",
      icon: MessageSquare,
      color: "text-purple-600"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "assignment",
      title: "Math Quiz 3 submitted",
      student: "Sarah Johnson",
      time: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      type: "message",
      title: "New message from parent",
      student: "Alex Chen's parent",
      time: "4 hours ago",
      status: "unread"
    },
    {
      id: 3,
      type: "attendance",
      title: "Attendance marked",
      student: "Grade 5A - 28/30 present",
      time: "1 day ago",
      status: "completed"
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      subject: "Mathematics",
      grade: "5A",
      time: "9:00 AM",
      students: 30,
      room: "Room 101"
    },
    {
      id: 2,
      subject: "Science",
      grade: "5B",
      time: "11:00 AM",
      students: 28,
      room: "Lab 2"
    },
    {
      id: 3,
      subject: "English",
      grade: "5A",
      time: "2:00 PM",
      students: 30,
      room: "Room 101"
    }
  ];

  const studentPerformance = [
    { name: "Sarah J.", grade: "A+", progress: 95, trend: "up" },
    { name: "Alex C.", grade: "A", progress: 88, trend: "up" },
    { name: "Emma W.", grade: "B+", progress: 82, trend: "stable" },
    { name: "Michael R.", grade: "B", progress: 75, trend: "down" },
    { name: "Lisa M.", grade: "A-", progress: 85, trend: "up" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
              <p className="text-muted-foreground">Good morning, Ms. Anderson</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="Ms. Anderson" />
                <AvatarFallback className="bg-primary text-primary-foreground">MA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-scale bg-background/60 backdrop-blur-sm border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-background/60 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Classes */}
              <Card className="bg-background/60 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingClasses.map((class_) => (
                    <div key={class_.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{class_.subject}</p>
                        <p className="text-sm text-muted-foreground">Grade {class_.grade} • {class_.room}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{class_.time}</p>
                        <p className="text-sm text-muted-foreground">{class_.students} students</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="bg-background/60 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'assignment' ? 'bg-orange-100 text-orange-600' :
                        activity.type === 'message' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {activity.type === 'assignment' && <BookOpen className="h-4 w-4" />}
                        {activity.type === 'message' && <MessageSquare className="h-4 w-4" />}
                        {activity.type === 'attendance' && <CheckCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.student}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={activity.status === 'pending' ? 'destructive' : 
                                     activity.status === 'unread' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Student Performance Overview */}
            <Card className="bg-background/60 backdrop-blur-sm border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Student Performance Overview
                </CardTitle>
                <CardDescription>Top performing students in your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentPerformance.map((student, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-foreground">{student.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{student.grade}</Badge>
                            {student.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                            {student.trend === 'down' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          </div>
                        </div>
                        <Progress value={student.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes">
            <Card className="bg-background/60 backdrop-blur-sm border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Classes</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Class
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Classes management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card className="bg-background/60 backdrop-blur-sm border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Students</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Student management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card className="bg-background/60 backdrop-blur-sm border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Assignments</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Assignment management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="bg-background/60 backdrop-blur-sm border-border/40">
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>Detailed insights into student performance and class metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}