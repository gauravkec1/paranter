import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Receipt, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  Building,
  Wallet,
  Target,
  BarChart3,
  PieChart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FinancePortal = () => {
  const financeStats = [
    {
      title: "Total Revenue",
      value: "₹12,45,680",
      change: "+15.2%",
      icon: DollarSign,
      color: "success",
      trend: "up"
    },
    {
      title: "Outstanding Dues",
      value: "₹3,25,400",
      change: "-8.3%",
      icon: AlertTriangle,
      color: "warning",
      trend: "down"
    },
    {
      title: "Monthly Expenses",
      value: "₹8,75,200",
      change: "+12.1%",
      icon: CreditCard,
      color: "primary",
      trend: "up"
    },
    {
      title: "Collection Rate",
      value: "92.5%",
      change: "+3.2%",
      icon: Target,
      color: "excellent",
      trend: "up"
    }
  ];

  const recentTransactions = [
    { id: "TXN001", student: "Arjun Sharma (5A)", type: "Tuition Fee", amount: "₹12,000", status: "completed", date: "2024-03-15", method: "Online" },
    { id: "TXN002", student: "Priya Singh (8B)", type: "Transport Fee", amount: "₹3,500", status: "pending", date: "2024-03-15", method: "Cash" },
    { id: "TXN003", student: "Rohan Kumar (10C)", type: "Activity Fee", amount: "₹2,000", status: "completed", date: "2024-03-14", method: "UPI" },
    { id: "TXN004", student: "Ananya Gupta (6A)", type: "Library Fee", amount: "₹500", status: "failed", date: "2024-03-14", method: "Online" },
    { id: "TXN005", student: "Vikram Patel (9B)", type: "Exam Fee", amount: "₹1,500", status: "completed", date: "2024-03-13", method: "Card" }
  ];

  const expenses = [
    { category: "Staff Salaries", amount: "₹4,50,000", budget: "₹4,50,000", percentage: 100, status: "on-track" },
    { category: "Utilities", amount: "₹85,000", budget: "₹90,000", percentage: 94, status: "on-track" },
    { category: "Maintenance", amount: "₹1,20,000", budget: "₹1,00,000", percentage: 120, status: "over-budget" },
    { category: "Supplies", amount: "₹75,000", budget: "₹80,000", percentage: 94, status: "on-track" },
    { category: "Transportation", amount: "₹95,000", budget: "₹1,00,000", percentage: 95, status: "on-track" }
  ];

  const paymentMethods = [
    { method: "Online Banking", transactions: 156, amount: "₹6,75,000", percentage: 54 },
    { method: "UPI", transactions: 89, amount: "₹2,85,000", percentage: 23 },
    { method: "Credit/Debit Card", transactions: 67, amount: "₹2,15,000", percentage: 17 },
    { method: "Cash", transactions: 23, amount: "₹70,000", percentage: 6 }
  ];

  const overduePayments = [
    { student: "Rajesh Khanna (7A)", amount: "₹15,000", daysOverdue: 15, contact: "+91 98765 43210" },
    { student: "Sunita Verma (4B)", amount: "₹8,500", daysOverdue: 8, contact: "+91 98765 43211" },
    { student: "Amit Singh (9C)", amount: "₹12,000", daysOverdue: 22, contact: "+91 98765 43212" },
    { student: "Kavita Sharma (6A)", amount: "₹6,000", daysOverdue: 5, contact: "+91 98765 43213" }
  ];

  const quickActions = [
    { title: "Record Payment", description: "Add new payment entry", icon: Plus, color: "success" },
    { title: "Send Reminders", description: "Payment due notifications", icon: Send, color: "primary" },
    { title: "Generate Report", description: "Create financial reports", icon: FileText, color: "warning" },
    { title: "Manage Expenses", description: "Track school expenses", icon: Building, color: "muted" }
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <div className="bg-card border-b border-card-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Finance Portal</h1>
              <p className="text-muted-foreground mt-1">Financial Management & Accounting</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-success to-excellent">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financeStats.map((stat, index) => (
            <Card key={index} className="card-hover bg-gradient-to-br from-card to-background-secondary border-card-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-xs font-medium mt-1 ${
                      stat.trend === 'up' ? 'text-success' : 'text-warning'
                    }`}>
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card border border-card-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="dues">Outstanding</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="lg:col-span-1 bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Quick Actions</CardTitle>
                  <CardDescription>Frequently used financial functions</CardDescription>
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

              {/* Recent Transactions */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Transactions</CardTitle>
                  <CardDescription>Latest payment activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.slice(0, 5).map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border">
                        <div className="flex items-center space-x-3">
                          <div className={`h-2 w-2 rounded-full ${
                            transaction.status === 'completed' ? 'bg-success' :
                            transaction.status === 'pending' ? 'bg-warning' : 'bg-destructive'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{transaction.student}</p>
                            <p className="text-xs text-muted-foreground">{transaction.type} • {transaction.method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{transaction.amount}</p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 
                            transaction.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods Breakdown */}
            <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-primary" />
                  Payment Methods Analysis
                </CardTitle>
                <CardDescription>Payment preferences and transaction distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="p-4 rounded-lg bg-background/50 border border-card-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{method.method}</span>
                        <Badge variant="secondary">{method.percentage}%</Badge>
                      </div>
                      <p className="text-lg font-bold text-foreground">{method.amount}</p>
                      <p className="text-xs text-muted-foreground">{method.transactions} transactions</p>
                      <Progress value={method.percentage} className="mt-2 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Payment Management</CardTitle>
                    <CardDescription>Manage student fee payments and transactions</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search payments..." className="w-64" />
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.student}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell className="font-medium">{transaction.amount}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 
                            transaction.status === 'pending' ? 'secondary' : 'destructive'}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.method}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Receipt className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
              <CardHeader>
                <CardTitle className="text-foreground">Expense Management</CardTitle>
                <CardDescription>Track school expenses and budget allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.map((expense, index) => (
                    <div key={index} className="p-4 rounded-lg bg-background/50 border border-card-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-foreground font-medium">{expense.category}</span>
                        <Badge variant={expense.status === 'on-track' ? 'default' : 'destructive'}>
                          {expense.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Spent: {expense.amount} / Budget: {expense.budget}
                        </span>
                        <span className="text-sm font-medium text-foreground">{expense.percentage}%</span>
                      </div>
                      <Progress 
                        value={expense.percentage} 
                        className="h-2" 
                        // Use a conditional color based on percentage
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dues" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Outstanding Dues</CardTitle>
                    <CardDescription>Students with pending fee payments</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-warning to-good">
                    <Send className="h-4 w-4 mr-2" />
                    Send All Reminders
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overduePayments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-card-border">
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 rounded-full bg-destructive" />
                        <div>
                          <p className="font-medium text-foreground">{payment.student}</p>
                          <p className="text-sm text-muted-foreground">{payment.contact}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-destructive">{payment.amount}</p>
                        <p className="text-xs text-muted-foreground">{payment.daysOverdue} days overdue</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Send className="h-3 w-3 mr-1" />
                          Remind
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-success">₹12,45,680</p>
                    <p className="text-muted-foreground">Total Revenue (March 2024)</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Growth Rate</span>
                      <span className="text-success font-medium">+15.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Collection Efficiency</span>
                      <span className="text-foreground font-medium">92.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average per Student</span>
                      <span className="text-foreground font-medium">₹8,950</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Expense Analysis</CardTitle>
                  <CardDescription>Monthly expense breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">₹8,75,200</p>
                    <p className="text-muted-foreground">Total Expenses (March 2024)</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">vs Budget</span>
                      <span className="text-warning font-medium">+2.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Largest Category</span>
                      <span className="text-foreground font-medium">Staff Salaries</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost per Student</span>
                      <span className="text-foreground font-medium">₹6,320</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Generate Financial Reports</CardTitle>
                  <CardDescription>Create detailed financial statements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Monthly Revenue Report", description: "Detailed income analysis with trends" },
                    { title: "Outstanding Dues Report", description: "Student-wise pending payments" },
                    { title: "Expense Analysis Report", description: "Category-wise expense breakdown" },
                    { title: "Payment Methods Report", description: "Transaction channel analysis" },
                    { title: "Budget vs Actual Report", description: "Financial performance tracking" }
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
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Export Options</CardTitle>
                  <CardDescription>Download reports in various formats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex-col border-card-border">
                      <FileText className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm">PDF Export</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col border-card-border">
                      <BarChart3 className="h-6 w-6 mb-2 text-success" />
                      <span className="text-sm">Excel Export</span>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Date Range:</p>
                    <div className="flex gap-2">
                      <Input type="date" className="flex-1" />
                      <Input type="date" className="flex-1" />
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary-glow">
                    <Download className="h-4 w-4 mr-2" />
                    Generate & Download
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

export default FinancePortal;