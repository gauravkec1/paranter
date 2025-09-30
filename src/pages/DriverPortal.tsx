import { 
  Navigation, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Phone, 
  Play, 
  Square, 
  Clock,
  Route,
  Bus,
  UserCheck,
  Bell,
  Send,
  Settings,
  LogOut,
  Map,
  Target,
  Timer,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Battery,
  Fuel
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

const DriverPortal = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [tripStatus, setTripStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');
  const [currentStop, setCurrentStop] = useState(0);
  const [studentsBoarded, setStudentsBoarded] = useState(0);

  // Driver profile data
  const driverProfile = {
    name: "Rajesh Kumar",
    id: "DRV001",
    phone: "+91 98765 43210",
    bus: "BUS-05",
    route: "Route A - Sector 15 to School",
    avatar: "/api/placeholder/64/64"
  };

  // Route stops data
  const routeStops = [
    { id: 1, name: "Sector 15 Bus Stop", time: "7:00 AM", students: 8, completed: tripStatus !== 'not-started' },
    { id: 2, name: "Community Center", time: "7:15 AM", students: 5, completed: currentStop > 1 },
    { id: 3, name: "Market Square", time: "7:30 AM", students: 12, completed: currentStop > 2 },
    { id: 4, name: "Residential Colony", time: "7:45 AM", students: 6, completed: currentStop > 3 },
    { id: 5, name: "Green Valley School", time: "8:00 AM", students: 0, completed: tripStatus === 'completed' }
  ];

  const totalStudents = routeStops.reduce((sum, stop) => sum + stop.students, 0);

  // Location tracking simulation
  useEffect(() => {
    let locationInterval: NodeJS.Timeout;
    
    if (isOnline && tripStatus === 'in-progress') {
      locationInterval = setInterval(async () => {
        try {
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000
          });
          
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          // Update location silently (removed console.log for security)
        } catch (error) {
          console.error('Error getting location:', error);
        }
      }, 15000); // Update every 15 seconds
    }

    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [isOnline, tripStatus]);

  const handleStartTrip = () => {
    setTripStatus('in-progress');
    setIsOnline(true);
    setCurrentStop(1);
    
    // Request location permissions and start tracking
    Geolocation.requestPermissions();
    
    // Send notification
    LocalNotifications.schedule({
      notifications: [
        {
          title: "Trip Started",
          body: "GPS tracking is now active. Drive safely!",
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) }
        }
      ]
    });
  };

  const handleCompleteStop = () => {
    if (currentStop < routeStops.length) {
      setCurrentStop(currentStop + 1);
      const studentsAtStop = routeStops[currentStop - 1].students;
      setStudentsBoarded(studentsBoarded + studentsAtStop);
      
      if (currentStop === routeStops.length) {
        setTripStatus('completed');
        setIsOnline(false);
      }
    }
  };

  const handleEmergencyAlert = (type: 'delay' | 'breakdown' | 'emergency') => {
    const alertMessages = {
      delay: "Bus is running late due to traffic",
      breakdown: "Bus has broken down. Assistance needed",
      emergency: "Emergency situation. Immediate help required"
    };

    // Alert sent silently (removed console.log for security)
    
    // Send notification to admin/parents
    LocalNotifications.schedule({
      notifications: [
        {
          title: `${type.toUpperCase()} Alert Sent`,
          body: alertMessages[type],
          id: Date.now(),
          schedule: { at: new Date(Date.now() + 1000) }
        }
      ]
    });
  };

  return (
    <div className="min-h-screen bg-background-secondary pb-20">
      {/* Header */}
      <div className="bg-card border-b border-card-border sticky top-0 z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={driverProfile.avatar} alt={driverProfile.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {driverProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{driverProfile.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Bus className="h-3 w-3 mr-1" />
                  {driverProfile.bus} • {driverProfile.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center">
                {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Trip Status */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Trip</p>
                  <p className="font-medium text-foreground">{driverProfile.route}</p>
                </div>
                <Badge variant={
                  tripStatus === 'not-started' ? 'secondary' : 
                  tripStatus === 'in-progress' ? 'default' : 'outline'
                } className="text-xs">
                  {tripStatus === 'not-started' ? 'Not Started' : 
                   tripStatus === 'in-progress' ? 'In Progress' : 'Completed'}
                </Badge>
              </div>
              {tripStatus === 'in-progress' && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{currentStop - 1}/{routeStops.length - 1} stops</span>
                  </div>
                  <Progress value={((currentStop - 1) / (routeStops.length - 1)) * 100} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        {tripStatus === 'not-started' && (
          <Card className="bg-gradient-to-br from-success/10 to-excellent/10 border-success/20">
            <CardContent className="p-6 text-center">
              <Bus className="h-12 w-12 mx-auto mb-4 text-success" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Start Trip</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tap to begin your route and start GPS tracking
              </p>
              <Button 
                onClick={handleStartTrip}
                className="bg-gradient-to-r from-success to-excellent text-white"
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Trip
              </Button>
            </CardContent>
          </Card>
        )}

        {tripStatus === 'in-progress' && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Trip in Progress</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Current Stop: {routeStops[currentStop - 1]?.name}
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCompleteStop}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
                  disabled={currentStop >= routeStops.length}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Stop
                </Button>
                <Button 
                  onClick={() => setTripStatus('completed')}
                  variant="outline"
                  size="sm"
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Route Information */}
        <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Route className="h-5 w-5 mr-2 text-primary" />
              Route Stops
            </CardTitle>
            <CardDescription>
              {studentsBoarded}/{totalStudents} students boarded
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {routeStops.map((stop, index) => (
              <div 
                key={stop.id} 
                className={`p-3 rounded-lg border transition-colors ${
                  stop.completed ? 'bg-success/10 border-success/20' :
                  currentStop === index + 1 ? 'bg-primary/10 border-primary/20' :
                  'bg-background/50 border-card-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-3 w-3 rounded-full ${
                      stop.completed ? 'bg-success' :
                      currentStop === index + 1 ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                    <div>
                      <p className="font-medium text-foreground">{stop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {stop.time} • {stop.students} students
                      </p>
                    </div>
                  </div>
                  {stop.completed && (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  {currentStop === index + 1 && tripStatus === 'in-progress' && (
                    <Timer className="h-4 w-4 text-primary animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Emergency Actions */}
        <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
              Emergency Actions
            </CardTitle>
            <CardDescription>Send alerts to admin and parents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => handleEmergencyAlert('delay')}
              variant="outline" 
              className="w-full justify-start h-auto p-4 border-warning/20 hover:bg-warning/5"
            >
              <Clock className="h-5 w-5 mr-3 text-warning" />
              <div className="text-left">
                <div className="font-medium text-foreground">Running Late</div>
                <div className="text-xs text-muted-foreground">Notify about traffic delay</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => handleEmergencyAlert('breakdown')}
              variant="outline" 
              className="w-full justify-start h-auto p-4 border-destructive/20 hover:bg-destructive/5"
            >
              <XCircle className="h-5 w-5 mr-3 text-destructive" />
              <div className="text-left">
                <div className="font-medium text-foreground">Bus Breakdown</div>
                <div className="text-xs text-muted-foreground">Request immediate assistance</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => handleEmergencyAlert('emergency')}
              variant="outline" 
              className="w-full justify-start h-auto p-4 border-destructive/20 hover:bg-destructive/5"
            >
              <AlertTriangle className="h-5 w-5 mr-3 text-destructive" />
              <div className="text-left">
                <div className="font-medium text-foreground">Emergency</div>
                <div className="text-xs text-muted-foreground">Immediate help needed</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Trip Statistics */}
        <Card className="bg-gradient-to-br from-card to-background-secondary border-card-border">
          <CardHeader>
            <CardTitle className="text-foreground">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-background/50 border border-card-border">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-lg font-bold text-foreground">{studentsBoarded}</p>
                <p className="text-xs text-muted-foreground">Students Boarded</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50 border border-card-border">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-success" />
                <p className="text-lg font-bold text-foreground">{currentStop - 1}</p>
                <p className="text-xs text-muted-foreground">Stops Completed</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50 border border-card-border">
              <div className="flex items-center space-x-2">
                <Battery className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">GPS Status</span>
              </div>
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border p-4">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Map className="h-5 w-5 mb-1" />
            <span className="text-xs">Route</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Bell className="h-5 w-5 mb-1" />
            <span className="text-xs">Alerts</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Phone className="h-5 w-5 mb-1" />
            <span className="text-xs">Contact</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <LogOut className="h-5 w-5 mb-1" />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverPortal;