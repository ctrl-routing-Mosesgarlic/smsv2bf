"use client";

import { useState, useEffect } from "react";
import { SchoolGroup, Permission } from "@/types";
import { API_ROUTES } from "@/config/routes";
import { fetcher, fetcherWithAuth, http } from "@/lib/fetcher";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tree,
  TreeItem,
  TreeItemContent,
  TreeItemTrigger,
} from "@/components/ui/tree";
import {
  LayoutDashboard,
  Plus,
  Pencil,
  Trash2,
  Search,
  Shield,
  Users,
  ArrowRight,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  useContextualPermissions,
  PermissionMap,
  ScopeType,
} from "@/contexts/PermissionContext";
import {
  checkPermissions,
  PermissionAction,
  PermissionModule,
} from "@/lib/permission";

type PermissionDetails = {
  id: number;
  module: PermissionModule;
  resource: string;
  action: PermissionAction;
  description: string;
};

export default function SchoolGroupsPage() {
  const { userPermissions } = useContextualPermissions();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [schoolGroups, setSchoolGroups] = useState<SchoolGroup[]>([]);
  const [permissions, setPermissions] = useState<PermissionDetails[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<SchoolGroup | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignPermissionsModalOpen, setIsAssignPermissionsModalOpen] = useState(false);

  // Form states
  const [parentGroup, setParentGroup] = useState<string>("");
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [assignedPermissions, setAssignedPermissions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Permissions management state
  const [availablePermissions, setAvailablePermissions] = useState<PermissionDetails[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  // Permission calculations
  const canViewGroups = checkPermissions(
    userPermissions,
    "school_group",
    "school_group",
    "view"
  );
  const canCreateGroups = checkPermissions(
    userPermissions,
    "school_group",
    "school_group",
    "create"
  );
  const canUpdateGroups = checkPermissions(
    userPermissions,
    "school_group",
    "school_group",
    "update"
  );
  const canDeleteGroups = checkPermissions(
    userPermissions,
    "school_group",
    "school_group",
    "delete"
  );
  const canAssignPermissions = checkPermissions(
    userPermissions,
    "access_control",
    "school_group_permissions",
    "assign"
  );

  // Fetch all school groups
  useEffect(() => {
    const fetchSchoolGroups = async () => {
      try {
        setIsLoading(true);
        const data = await fetcherWithAuth(API_ROUTES.schoolGroups);
        setSchoolGroups(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching school groups:", error);
        toast({
          title: "Error",
          description: "Failed to fetch school groups.",
          variant: "destructive",
        });
        setSchoolGroups([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolGroups();
  }, [toast]);

  // Fetch all permissions
  const fetchAvailablePermissions = async () => {
    try {
      setIsLoadingPermissions(true);
      const data = await fetcherWithAuth(API_ROUTES.permissions);
      setAvailablePermissions(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setAvailablePermissions([]);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  // Handle create modal
  const handleCreateModalOpen = () => {
    setParentGroup("");
    setGroupName("");
    setGroupCode("");
    setStatus("active");
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  // Handle create group
  const handleCreateGroup = async () => {
    if (!groupName || !groupCode) {
      toast({
        title: "Error",
        description: "Group name and code are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        parent_group_id: parentGroup || null,
        name: groupName,
        code: groupCode,
        status: status,
      };
      const data = await http.post(API_ROUTES.schoolGroups, payload);
      setSchoolGroups([...schoolGroups, data.data]);
      toast({
        title: "Success",
        description: "School group created successfully.",
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create school group.",
        variant: "destructive",
      });
    }
  };

  // Handle edit modal
  const handleEditModalOpen = (group: SchoolGroup) => {
    setSelectedGroup(group);
    setParentGroup(group.parent_group_id || "");
    setGroupName(group.name);
    setGroupCode(group.code);
    setStatus(group.status);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  // Handle edit group
  const handleEditGroup = async () => {
    if (!selectedGroup || !groupName || !groupCode) return;

    try {
      const payload = {
        parent_group_id: parentGroup || null,
        name: groupName,
        code: groupCode,
        status: status,
      };
      await http.put(
        `${API_ROUTES.schoolGroups}/${selectedGroup.id}`,
        payload
      );
      const updatedGroups = schoolGroups.map((g) =>
        g.id === selectedGroup.id ? { ...g, ...payload } : g
      );
      setSchoolGroups(updatedGroups);
      toast({
        title: "Success",
        description: "School group updated successfully.",
      });
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update school group.",
        variant: "destructive",
      });
    }
  };

  // Handle delete group
  const handleDeleteGroup = async (groupId: number) => {
    if (
      !canDeleteGroups ||
      !confirm("Are you sure you want to delete this school group?")
    ) {
      return;
    }

    try {
      await http.delete(`${API_ROUTES.schoolGroups}/${groupId}`);
      const updatedGroups = schoolGroups.filter((g) => g.id !== groupId);
      setSchoolGroups(updatedGroups);
      toast({
        title: "Success",
        description: "School group deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete school group.",
        variant: "destructive",
      });
    }
  };

  // Handle assign permissions modal
  const handleAssignPermissionsModalOpen = (group: SchoolGroup) => {
    setSelectedGroup(group);
    setAssignedPermissions(
      group.permissions?.map((p) => p.id) || []
    );
    setIsAssignPermissionsModalOpen(true);
  };

  const handleAssignPermissionsModalClose = () => {
    setIsAssignPermissionsModalOpen(false);
  };

  // Handle assign permissions
  const handleAssignPermissions = async () => {
    if (!selectedGroup) return;

    try {
      const payload = {
        school_group_id: selectedGroup.id,
        permissions: assignedPermissions,
      };
      await http.post(
        `${API_ROUTES.schoolGroups}/${selectedGroup.id}/assign-permissions`,
        payload
      );
      const updatedGroups = schoolGroups.map((g) =>
        g.id === selectedGroup.id
          ? {
            ...g,
            permissions: availablePermissions.filter((p) =>
              assignedPermissions.includes(p.id)
            ),
          }
          : g
      );
      setSchoolGroups(updatedGroups);
      toast({
        title: "Success",
        description: "Permissions assigned successfully.",
      });
      setIsAssignPermissionsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign permissions.",
        variant: "destructive",
      });
    }
  };

  // Filter groups by search term
  const filteredGroups = schoolGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canViewGroups) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Insufficient Permissions</h2>
          <p className="text-gray-600">You don't have permission to view school groups.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Groups</h1>
          <p className="text-gray-600 mt-1">
            Organize schools into groups for regional management and role-based access control
          </p>
        </div>
        {canCreateGroups && (
          <Button onClick={handleCreateModalOpen}>
            <Plus className="mr-2 h-5 w-5" />
            Create School Group
          </Button>
        )}
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search school groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Groups Tree */}
      <Card>
        <CardHeader>
          <CardTitle>School Group Hierarchy</CardTitle>
          <CardDescription>
            View and manage your school group structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No school groups found.</p>
            </div>
          ) : (
            <Tree
              variant="default"
              className="max-w-4xl"
              defaultOpen={Object.fromEntries(
                filteredGroups.map((group) => [group.id.toString(), true])
              )}
            >
              {filteredGroups.map((group) => (
                <TreeItem key={group.id} value={group.id.toString()}>
                  <TreeItemContent>
                    <TreeItemTrigger asChild>
                      <div className="flex items-center justify-between flex-1 py-2">
                        <div className="flex items-center gap-3">
                          <LayoutDashboard className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {group.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {group.code} • {group.schools_count || 0} schools
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {group.status === "active" ? (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                              Inactive
                            </span>
                          )}
                          {canAssignPermissions && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAssignPermissionsModalOpen(group)}
                              title="Assign Permissions"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                          {canUpdateGroups && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditModalOpen(group)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {canDeleteGroups && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGroup(group.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </TreeItemTrigger>
                  </TreeItemContent>
                </TreeItem>
              ))}
            </Tree>
          )}
        </CardContent>
      </Card>

      {/* Create School Group Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2
        </DialogContent>
      </Dialog>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      
