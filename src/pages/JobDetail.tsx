import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  Building2,
  Globe,
  Mail,
} from "lucide-react";

const JobDetail = () => {
  const job = {
    id: 1,
    title: "Waiters",
    company: "Norwegian Cruise Line",
    department: "Hotel Department",
    location: "International Waters",
    type: "Full-time",
    salary: "$2,000 - $3,500",
    postedDate: "2 days ago",
    expiryDate: "30 days",
    positions: "5",
    urgent: true,
    description: `We are seeking professional and customer-oriented Waiters to join our Hotel Department aboard our luxury cruise ships. This is an excellent opportunity for individuals passionate about hospitality and eager to work in an international environment.

As a Waiter, you will be responsible for providing exceptional dining experiences to our guests, ensuring their comfort and satisfaction throughout their journey with us.`,
    responsibilities: [
      "Provide excellent customer service to all guests",
      "Take orders and serve food and beverages efficiently",
      "Maintain cleanliness and organization of dining areas",
      "Work collaboratively with kitchen and service staff",
      "Handle guest requests and resolve issues professionally",
      "Follow health and safety regulations",
    ],
    requirements: [
      "Minimum 1 year experience in hospitality or food service",
      "Excellent communication and interpersonal skills",
      "Ability to work in a fast-paced environment",
      "Physical stamina to stand for extended periods",
      "Basic English proficiency (additional languages a plus)",
      "Customer service oriented with positive attitude",
      "Willingness to work flexible hours including weekends",
    ],
    benefits: [
      "Competitive salary with tips",
      "Free accommodation and meals",
      "Travel opportunities worldwide",
      "Health and accident insurance",
      "Training and career development",
      "International work experience",
    ],
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/jobs" className="text-blue-200 hover:text-white transition-colors">
              Jobs
            </Link>
            <span className="text-blue-200">/</span>
            <span>Job Details</span>
          </div>
        </div>
      </div>

      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-ocean-light to-ocean-blue rounded-lg flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {job.company.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                        <p className="text-lg text-muted-foreground">{job.company}</p>
                      </div>
                      {job.urgent && (
                        <Badge className="bg-gold text-ocean-deep hover:bg-gold/90">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-secondary font-medium">{job.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{job.positions} positions</span>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Job Description</h2>
                    <p className="text-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Responsibilities</h2>
                    <ul className="space-y-2">
                      {job.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Requirements</h2>
                    <ul className="space-y-2">
                      {job.requirements.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Benefits</h2>
                    <ul className="space-y-2">
                      {job.benefits.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Apply for this position</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Posted: {job.postedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Expires in: {job.expiryDate}</span>
                  </div>
                </div>
                <Link to="/login">
                  <Button className="w-full bg-primary hover:bg-primary/90 mb-3">Apply Now</Button>
                </Link>
                <Button variant="outline" className="w-full">Save Job</Button>
              </Card>

              {/* Company Info */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">About Company</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Building2 className="w-4 h-4" />
                      <span>Company</span>
                    </div>
                    <p className="font-medium text-foreground">{job.company}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Globe className="w-4 h-4" />
                      <span>Industry</span>
                    </div>
                    <p className="font-medium text-foreground">Cruise Lines & Maritime</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Mail className="w-4 h-4" />
                      <span>Contact</span>
                    </div>
                    <p className="font-medium text-foreground">careers@ncl.com</p>
                  </div>
                  <Link to={`/companies/${job.id}`}>
                    <Button variant="outline" className="w-full mt-4">
                      View Company Profile
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Similar Jobs */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Similar Jobs</h3>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Link
                      key={i}
                      to={`/jobs/${i + 2}`}
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <h4 className="font-medium text-foreground mb-1">Chef de Partie</h4>
                      <p className="text-sm text-muted-foreground">Norwegian Cruise Line</p>
                      <p className="text-sm text-secondary font-medium mt-1">$2,500 - $4,000</p>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JobDetail;
