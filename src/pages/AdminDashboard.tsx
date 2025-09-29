import { Users, School, DollarSign, Calendar, MessageSquare, BarChart3, UserCheck, BookOpen, Bell, TrendingUp, Settings, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  const statsCards = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "bg-primary",
      trend: "up"
    },
    {
      title: "Teaching Staff",
      value: "89",
      change: "+3%", 
      icon: UserCheck,
      color: "bg-success",
      trend: "up"
    },
    {
      title: "Monthly Revenue",
      value: "₹8,45,000",
      change: "+18%",
      icon: DollarSign,
      color: "bg-warning",
      trend: "up"
    },
    {
      title: "Attendance Rate",
      value: "94.2%",
      change: "+2.1%",
      icon: BarChart3,
      color: "bg-excellent",
      trend: "up"
    }
  ];

  const recentActivities = [
    { action: "New admission registered", user: "John Smith (Class 5A)", time: "2 minutes ago", type: "admission" },
    { action: "Fee payment received", user: "Sarah Johnson (Class 8B)", time: "15 minutes ago", type: "payment" },
    { action: "Teacher leave approved", user: "Mrs. Davis (Math)", time: "1 hour ago", type: "leave" },
    { action: "Parent meeting scheduled", user: "Class 3C Parents", time: "2 hours ago", type: "meeting" },
    { action: "Circular published", user: "Summer Vacation Notice", time: "3 hours ago", type: "circular" }
  ];

  const upcomingEvents = [
    { title: "Annual Sports Day", date: "March 15, 2024", participants: "All Classes", status: "upcoming" },
    { title: "Parent-Teacher Meeting", date: "March 20, 2024", participants: "Classes 6-8", status: "scheduled" },
    { title: "Science Exhibition", date: "March 25, 2024", participants: "Classes 4-10", status: "planning" },
    { title: "Summer Break Begins", date: "April 1, 2024", participants: "All Students", status: "upcoming" }
  ];

  const quickActions = [
    { title: "Send Broadcast", description: "Send message to all users", icon: MessageSquare, color: "primary" },
    { title: "Generate Reports", description: "Create financial & academic reports", icon: FileText, color: "success" },
    { title: "Manage Users", description: "Add/edit teachers & staff", icon: Users, color: "warning" },
    { title: "School Settings", description: "Configure system preferences", icon: Settings, color: "muted" }
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <div className="bg-card border-b border-card-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, Principal Anderson</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge variant="destructive" className="ml-2">5</Badge>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary-glow">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Broadcast
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="card-hover bg-gradient-to-br from-card to-background-secondary border-card-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-success font-medium mt-1">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}/10`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color.replace('bg-', '')}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card border border-card-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="lg:col-span-1 bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Quick Actions</CardTitle>
                  <CardDescription>Frequently used admin functions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 bg-background/50 hover:bg-primary/5 border-card-border"
                    >
                      <action.icon className="h-5 w-5 mr-3 text-primary" />
                      <div className="text-left">
                        <div className="font-medium text-foreground">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Activities</CardTitle>
                  <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border">
                        <div className="flex items-center space-x-3">
                          <div className={`h-2 w-2 rounded-full ${
                            activity.type === 'admission' ? 'bg-primary' :
                            activity.type === 'payment' ? 'bg-success' :
                            activity.type === 'leave' ? 'bg-warning' :
                            activity.type === 'meeting' ? 'bg-excellent' : 'bg-muted-foreground'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.user}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>School calendar and important dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-4 rounded-lg bg-background/50 border border-card-border hover:bg-primary/5 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'} className="text-xs">
                          {event.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                      <p className="text-xs text-muted-foreground">{event.participants}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Staff Management</CardTitle>
                  <CardDescription>Manage teachers and administrative staff</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border">
                    <span className="text-foreground">Total Teaching Staff</span>
                    <Badge variant="secondary">89 Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border">
                    <span className="text-foreground">Administrative Staff</span>
                    <Badge variant="secondary">24 Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border">
                    <span className="text-foreground">On Leave Today</span>
                    <Badge variant="outline">3 Staff</Badge>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-primary to-primary-glow">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Staff
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Student Enrollment</CardTitle>
                  <CardDescription>Current enrollment statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Primary (1-5)</span>
                      <span className="text-foreground font-medium">425 students</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Middle (6-8)</span>
                      <span className="text-foreground font-medium">387 students</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">High School (9-12)</span>
                      <span className="text-foreground font-medium">435 students</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-card-border">
                    <School className="h-4 w-4 mr-2" />
                    View All Students
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Revenue Overview</CardTitle>
                  <CardDescription>Monthly financial summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">₹8,45,000</p>
                    <p className="text-muted-foreground">Total Revenue (March)</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tuition Fees</span>
                      <span className="text-foreground">₹6,20,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transport Fees</span>
                      <span className="text-foreground">₹1,45,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Other Charges</span>
                      <span className="text-foreground">₹80,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Pending Payments</CardTitle>
                  <CardDescription>Outstanding fee collections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-warning">₹2,15,000</p>
                    <p className="text-muted-foreground">Total Outstanding</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">This Month</span>
                      <span className="text-warning">₹85,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overdue</span>
                      <span className="text-destructive">₹1,30,000</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-warning text-warning hover:bg-warning hover:text-warning-foreground">
                    Send Reminders
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Payment Methods</CardTitle>
                  <CardDescription>Collection breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Online Payment</span>
                      <div className="text-right">
                        <span className="text-foreground font-medium">65%</span>
                        <Progress value={65} className="w-16 h-2 mt-1" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bank Transfer</span>
                      <div className="text-right">
                        <span className="text-foreground font-medium">25%</span>
                        <Progress value={25} className="w-16 h-2 mt-1" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cash/Cheque</span>
                      <div className="text-right">
                        <span className="text-foreground font-medium">10%</span>
                        <Progress value={10} className="w-16 h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Academic Performance</CardTitle>
                  <CardDescription>School-wide performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Overall Pass Rate</span>
                      <div className="text-right">
                        <span className="text-excellent font-medium">94.2%</span>
                        <Progress value={94.2} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Attendance</span>
                      <div className="text-right">
                        <span className="text-good font-medium">91.8%</span>
                        <Progress value={91.8} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Parent Engagement</span>
                      <div className="text-right">
                        <span className="text-primary font-medium">87.5%</span>
                        <Progress value={87.5} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-primary to-primary-glow">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Detailed Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Subject Performance</CardTitle>
                  <CardDescription>Performance by subject areas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { subject: "Mathematics", score: 88 },
                      { subject: "English", score: 92 },
                      { subject: "Science", score: 85 },
                      { subject: "Social Studies", score: 90 },
                      { subject: "Languages", score: 87 }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{item.subject}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={item.score} className="w-24 h-2" />
                          <span className="text-foreground font-medium w-12 text-right">{item.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Generate Reports</CardTitle>
                  <CardDescription>Create comprehensive school reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Attendance Report", description: "Student & staff attendance analysis" },
                    { title: "Financial Report", description: "Revenue, expenses & outstanding dues" },
                    { title: "Academic Report", description: "Performance metrics & analytics" },
                    { title: "Parent Engagement", description: "Communication & meeting statistics" }
                  ].map((report, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 bg-background/50 hover:bg-primary/5 border-card-border"
                    >
                      <FileText className="h-5 w-5 mr-3 text-primary" />
                      <div className="text-left">
                        <div className="font-medium text-foreground">{report.title}</div>
                        <div className="text-xs text-muted-foreground">{report.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">System Analytics</CardTitle>
                  <CardDescription>Platform usage and engagement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Users (Today)</span>
                      <span className="text-foreground font-medium">1,156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Messages Sent</span>
                      <span className="text-foreground font-medium">2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Notifications Delivered</span>
                      <span className="text-foreground font-medium">8,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">App Downloads</span>
                      <span className="text-foreground font-medium">432</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-card-border">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;