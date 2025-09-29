"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationCreateData, NotificationType } from "@/types/notifications";
import { 
  Bell, 
  Users, 
  BookOpen, 
  Settings, 
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Plus,
  Trash2
} from "lucide-react";

interface AdminNotificationsProps {
  onBack?: () => void;
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

export function AdminNotifications({ onBack }: AdminNotificationsProps) {
  const { user, isSignedIn } = useUser();
  const [formData, setFormData] = useState<NotificationCreateData>({
    title: "",
    message: "",
    type: "INFO",
    userId: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sendToAll, setSendToAll] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        ...(sendToAll ? {} : { userId: formData.userId }),
      };

      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send notification");
      }

      setSuccess(
        sendToAll
          ? "Notification sent to all users successfully!"
          : "Notification sent to user successfully!"
      );
      
      // Reset form
      setFormData({
        title: "",
        message: "",
        type: "INFO",
        userId: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "ERROR":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeBadgeColor = (type: NotificationType) => {
    switch (type) {
      case "SUCCESS":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "WARNING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "ERROR":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "ADMIN";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to access this admin panel.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Notification Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Send notifications to users and manage communication
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="send" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send" className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send Notification</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Quick Templates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-6">
            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-600">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Create New Notification</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Recipients */}
                  <div className="space-y-4">
                    <Label>Recipients</Label>
                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant={sendToAll ? "default" : "outline"}
                        onClick={() => setSendToAll(true)}
                        className="flex items-center space-x-2"
                      >
                        <Users className="w-4 h-4" />
                        <span>All Users</span>
                      </Button>
                      <Button
                        type="button"
                        variant={!sendToAll ? "default" : "outline"}
                        onClick={() => setSendToAll(false)}
                        className="flex items-center space-x-2"
                      >
                        <Users className="w-4 h-4" />
                        <span>Specific User</span>
                      </Button>
                    </div>

                    {!sendToAll && (
                      <div className="space-y-2">
                        <Label htmlFor="userId">Select User</Label>
                        <Select
                          value={formData.userId || ""}
                          onValueChange={(value) =>
                            setFormData(prev => ({ ...prev, userId: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a user" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name || user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Notification Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">Notification Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: NotificationType) =>
                        setFormData(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INFO">
                          <div className="flex items-center space-x-2">
                            <Info className="w-4 h-4 text-blue-500" />
                            <span>Information</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="SUCCESS">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Success</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="WARNING">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span>Warning</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ERROR">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span>Error</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="Enter notification title"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, message: e.target.value }))
                      }
                      placeholder="Enter notification message"
                      rows={4}
                      required
                    />
                  </div>

                  {/* Preview */}
                  {(formData.title || formData.message) && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {getTypeIcon(formData.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {formData.title || "Notification title"}
                              </h4>
                              <Badge className={getTypeBadgeColor(formData.type)}>
                                {formData.type.toLowerCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formData.message || "Notification message"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading || !formData.title || !formData.message}
                    className="w-full"
                  >
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Notification
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Welcome to Ghana Tech Online!",
                    message: "Welcome to our learning platform! Start exploring courses and begin your learning journey.",
                    type: "SUCCESS" as const,
                  },
                  {
                    title: "System Maintenance Notice",
                    message: "We will be performing scheduled maintenance on [DATE] from [TIME] to [TIME]. The platform will be temporarily unavailable.",
                    type: "WARNING" as const,
                  },
                  {
                    title: "New Course Available",
                    message: "A new course '[COURSE NAME]' has been added to the platform. Check it out now!",
                    type: "INFO" as const,
                  },
                ].map((template, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {template.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {template.message}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData({
                            title: template.title,
                            message: template.message,
                            type: template.type,
                            userId: "",
                          })
                        }
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}