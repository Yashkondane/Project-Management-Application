
import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Check, 
  Mail, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash2, 
  UserPlus, 
  X
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  projects: string[];
}

// Sample team members data
const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Project Manager",
    avatar: "https://i.pravatar.cc/150?img=1",
    projects: ["Website Redesign", "Marketing Campaign"]
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Developer",
    avatar: "https://i.pravatar.cc/150?img=2",
    projects: ["Mobile App Development", "Website Redesign"]
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Designer",
    avatar: "https://i.pravatar.cc/150?img=3",
    projects: ["Website Redesign"]
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Content Writer",
    avatar: "https://i.pravatar.cc/150?img=4",
    projects: ["Marketing Campaign"]
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "Developer",
    avatar: "https://i.pravatar.cc/150?img=5",
    projects: ["Mobile App Development"]
  }
];

// Available roles
const roles = [
  "Project Manager",
  "Developer",
  "Designer",
  "Content Writer",
  "QA Tester",
  "DevOps Engineer",
  "Business Analyst"
];

// Available projects
const projects = [
  "Website Redesign",
  "Mobile App Development",
  "Marketing Campaign",
  "Database Migration",
  "API Development"
];

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    email: "",
    role: "",
    projects: []
  });
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  // Filter team members based on search query
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const memberWithSameEmail = teamMembers.find(
      member => member.email.toLowerCase() === newMember.email?.toLowerCase()
    );
    
    if (memberWithSameEmail) {
      toast.error("A team member with this email already exists");
      return;
    }
    
    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      projects: selectedProjects
    };
    
    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: "", email: "", role: "", projects: [] });
    setSelectedProjects([]);
    setIsAddMemberOpen(false);
    toast.success("Team member added successfully");
  };
  
  const handleUpdateMember = () => {
    if (!editingMember) return;
    
    setTeamMembers(teamMembers.map(member => 
      member.id === editingMember.id ? editingMember : member
    ));
    
    setEditingMember(null);
    toast.success("Team member updated successfully");
  };
  
  const handleDeleteMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast.success("Team member removed successfully");
  };
  
  const toggleProjectSelection = (project: string) => {
    if (selectedProjects.includes(project)) {
      setSelectedProjects(selectedProjects.filter(p => p !== project));
    } else {
      setSelectedProjects([...selectedProjects, project]);
    }
  };
  
  const toggleEditingMemberProject = (project: string) => {
    if (!editingMember) return;
    
    if (editingMember.projects.includes(project)) {
      setEditingMember({
        ...editingMember,
        projects: editingMember.projects.filter(p => p !== project)
      });
    } else {
      setEditingMember({
        ...editingMember,
        projects: [...editingMember.projects, project]
      });
    }
  };
  
  const inviteMember = (email: string) => {
    toast.success(`Invitation sent to ${email}`);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team Members</h1>
            <p className="text-muted-foreground">Manage your team and their project assignments</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsAddMemberOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>
        
        {/* Members list */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.projects.map((project) => (
                          <span 
                            key={project}
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                          >
                            {project}
                          </span>
                        ))}
                        {member.projects.length === 0 && (
                          <span className="text-sm text-muted-foreground">No projects assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setEditingMember(member)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => inviteMember(member.email)}>
                            Send invite
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No team members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Add Member Dialog */}
        <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Add a new member to your team and assign them to projects.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Full name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Role <span className="text-red-500">*</span>
                </label>
                <Select 
                  onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Roles</SelectLabel>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Assign to Projects
                </label>
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  {projects.map((project) => (
                    <div key={project} className="flex items-center space-x-2 py-1">
                      <button
                        type="button"
                        className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                          selectedProjects.includes(project)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-transparent'
                        }`}
                        onClick={() => toggleProjectSelection(project)}
                      >
                        {selectedProjects.includes(project) && <Check className="h-3 w-3" />}
                      </button>
                      <span>{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddMember}>
                Add Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Member Dialog */}
        <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>
                Update member details and project assignments.
              </DialogDescription>
            </DialogHeader>
            
            {editingMember && (
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Role</label>
                  <Select 
                    defaultValue={editingMember.role}
                    onValueChange={(value) => setEditingMember({ ...editingMember, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Roles</SelectLabel>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Assigned Projects
                  </label>
                  <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                    {projects.map((project) => (
                      <div key={project} className="flex items-center space-x-2 py-1">
                        <button
                          type="button"
                          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                            editingMember.projects.includes(project)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-transparent'
                          }`}
                          onClick={() => toggleEditingMemberProject(project)}
                        >
                          {editingMember.projects.includes(project) && <Check className="h-3 w-3" />}
                        </button>
                        <span>{project}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter className="sm:justify-end">
              <Button variant="outline" onClick={() => setEditingMember(null)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdateMember}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TeamMembers;
