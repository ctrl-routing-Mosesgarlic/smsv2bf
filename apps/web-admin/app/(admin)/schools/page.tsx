"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { School, SchoolGroup, Country, Region } from "@/types";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Filter,
  FilterCheck,
  Plus,
  Pencil,
  Trash2,
  Search,
  Download,
  Eye,
  Users,
  CheckCircle,
  XCircle,
  MapPin,
  Building2,
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

type Filters = {
  status?: string;
  countryId?: string;
  regionId?: string;
  groupId?: string;
};

type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

export default function SchoolsPage() {
  const { userPermissions } = useContextualPermissions();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolGroups, setSchoolGroups] = useState<SchoolGroup[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  // Form states
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "active",
    schoolGroupId: "",
    countryId: "",
    regionId: "",
  });
  const [filters, setFilters] = useState<Filters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Permission calculations
  const canViewSchools = checkPermissions(
    userPermissions,
    "school",
    "school",
    "view"
  );
  const canCreateSchools = checkPermissions(
    userPermissions,
    "school",
    "school",
    "create"
  );
  const canUpdateSchools = checkPermissions(
    userPermissions,
    "school",
    "school",
    "update"
  );
  const canDeleteSchools = checkPermissions(
    userPermissions,
    "school",
    "school",
    "delete"
  );
  const canManagePermissions = checkPermissions(
    userPermissions,
    "access_control",
    "school_permissions",
    "assign"
  );

  // Fetch all schools
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [schoolsData, groupsData, countriesData, regionsData] = await Promise.all([
          fetcherWithAuth(API_ROUTES.schools),
          fetcherWithAuth(API_ROUTES.schoolGroups),
          fetcherWithAuth(API_ROUTES.countries),
          fetcherWithAuth(API_ROUTES.regions),
        ]);

        setSchools(Array.isArray(schoolsData.data) ? schoolsData.data : []);
        setSchoolGroups(Array.isArray(groupsData.data) ? groupsData.data : []);
        setCountries(Array.isArray(countriesData.data) ? countriesData.data : []);
        setRegions(Array.isArray(regionsData.data) ? regionsData.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data.",
          variant: "destructive",
        });
        setSchools([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle create/edit modal
  const handleModalOpen = (school?: School) => {
    if (school) {
      setSelectedSchool(school);
      setFormData({
        name: school.name,
        code: school.code,
        status: school.status,
        schoolGroupId: school.school_group_id?.toString() || "",
        countryId: school.country_id?.toString() || "",
        regionId: school.region_id?.toString() || "",
      });
    } else {
      setSelectedSchool(null);
      setFormData({
        name: "",
        code: "",
        status: "active",
        schoolGroupId: "",
        countryId: "",
        regionId: "",
      });
    }
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSchool(null);
  };

  const handleCreateOrUpdateSchool = async () => {
    if (!formData.name || !formData.code) {
      toast({
        title: "Error",
        description: "Name and code are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        code: formData.code,
        status: formData.status,
        school_group_id: formData.schoolGroupId || null,
        country_id: formData.countryId || null,
        region_id: formData.regionId || null,
      };

      let response;
      if (selectedSchool) {
        response = await http.put(
          `${API_ROUTES.schools}/${selectedSchool.id}`,
          payload
        );
        setSchools((prev) =>
          prev.map((s) =>
            s.id === selectedSchool.id ? { ...s, ...response.data } : s
          )
        );
      } else {
        response = await http.post(API_ROUTES.schools, payload);
        setSchools((prev) => [...prev, response.data]);
      }

      toast({
        title: "Success",
        description: `School ${selectedSchool ? 'updated' : 'created'} successfully.`,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${selectedSchool ? 'update' : 'create'} school.`,
        variant: "destructive",
      });
    }
  };

  // Handle delete school
  const handleDeleteSchool = async (schoolId: number) => {
    if (!canDeleteSchools) {
      toast({
        title: "Error",
        description: "You don't have permission to delete schools.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Are you sure you want to delete this school?")) {
      return;
    }

    try {
      await http.delete(`${API_ROUTES.schools}/${schoolId}`);
      setSchools((prev
  );
}
