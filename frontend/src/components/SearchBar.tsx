import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (studentId: string) => void;
  isLoading?: boolean;
}

const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [studentId, setStudentId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.trim()) {
      onSearch(studentId.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter Student ID (e.g., STU001, STU002...)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="pl-10 h-12 text-base bg-card border-2 focus:border-primary transition-colors"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!studentId.trim() || isLoading}
          className="h-12 px-8 bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;