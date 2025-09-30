import { Users, GraduationCap, Shield, DollarSign, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const portals = [
  {
    id: "parent",
    title: "Parent Portal",
    description: "Track student progress, fees, and communicate with teachers",
    icon: Users,
    color: "bg-blue-500",
    route: "/"
  },
  {
    id: "teacher", 
    title: "Teacher Portal",
    description: "Manage classes, assignments, and student assessments",
    icon: GraduationCap,
    color: "bg-green-500",
    route: "/teacher"
  },
  {
    id: "admin",
    title: "Admin Portal", 
    description: "Complete school administration and management",
    icon: Shield,
    color: "bg-purple-500",
    route: "/admin"
  },
  {
    id: "finance",
    title: "Finance Portal",
    description: "Financial management, fees, and accounting", 
    icon: DollarSign,
    color: "bg-orange-500",
    route: "/finance"
  },
  {
    id: "driver",
    title: "Driver Portal",
    description: "Transport management and route tracking",
    icon: Truck,
    color: "bg-green-600",
    route: "/driver"
  }
];

const LandingPage = () => {
  const navigate = useNavigate();

  const handlePortalClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">School Connect</h1>
            <p className="text-sm text-muted-foreground">Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>🌐</span>
          <span>ಕನ್ನಡ</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">welcome.title</h2>
          <p className="text-lg text-muted-foreground">welcome.subtitle</p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal) => {
            const IconComponent = portal.icon;
            
            return (
              <Card 
                key={portal.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-border"
                onClick={() => handlePortalClick(portal.route)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${portal.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {portal.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {portal.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;