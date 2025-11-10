import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter } from "lucide-react";

const mockJobs = [
  {
    id: 1,
    title: "Waiters",
    company: "Norwegian Cruise Line",
    department: "Hotel Department",
    location: "International Waters",
    type: "Full-time",
    salary: "$2,000 - $3,500",
    postedDate: "2 days ago",
    urgent: true,
  },
  {
    id: 2,
    title: "Deck Officer",
    company: "SeaChef Maritime",
    department: "Deck Department",
    location: "International Waters",
    type: "Full-time",
    salary: "$4,000 - $6,000",
    postedDate: "1 week ago",
    urgent: true,
  },
  {
    id: 3,
    title: "Engine Mechanic",
    company: "NYK Ship Management",
    department: "Engine Department",
    location: "Asia Pacific",
    type: "Full-time",
    salary: "$3,500 - $5,000",
    postedDate: "3 days ago",
    urgent: false,
  },
  {
    id: 4,
    title: "Cruise Director",
    company: "Fred Olsen Cruise Line",
    department: "Entertainment",
    location: "Europe Routes",
    type: "Full-time",
    salary: "$3,000 - $4,500",
    postedDate: "1 week ago",
    urgent: false,
  },
  {
    id: 5,
    title: "Chef de Partie",
    company: "Norwegian Cruise Line",
    department: "Culinary",
    location: "International Waters",
    type: "Full-time",
    salary: "$2,500 - $4,000",
    postedDate: "4 days ago",
    urgent: false,
  },
  {
    id: 6,
    title: "Safety Officer",
    company: "Pertamina Shipping",
    department: "Safety & Security",
    location: "Indonesia",
    type: "Full-time",
    salary: "$3,000 - $4,500",
    postedDate: "5 days ago",
    urgent: false,
  },
];

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-blue-100">
            Explore maritime job opportunities worldwide
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="international">International Waters</SelectItem>
                <SelectItem value="asia">Asia Pacific</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="indonesia">Indonesia</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fulltime">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">{mockJobs.length} jobs found</p>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {mockJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-ocean-light to-ocean-blue rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                        {job.company.substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">{job.title}</h3>
                            <p className="text-muted-foreground">{job.company}</p>
                          </div>
                          {job.urgent && (
                            <Badge className="bg-gold text-ocean-deep hover:bg-gold/90">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-sm text-secondary font-medium mb-3">{job.department}</p>

                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Briefcase className="w-4 h-4 mr-2" />
                            {job.type}
                          </div>
                          <div className="flex items-center text-sm text-foreground font-medium">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {job.salary}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />
                            {job.postedDate}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link to={`/jobs/${job.id}`} className="flex-1 sm:flex-none">
                            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                              View Details
                            </Button>
                          </Link>
                          <Button variant="outline">Save</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button variant="default">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
