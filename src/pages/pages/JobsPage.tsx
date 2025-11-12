import React, { useState } from 'react';
import { Search, Filter, Ship, MapPin, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import type { Job, Department } from '../../App';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'all'>('all');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Combined jobs data from both previous files
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Mermaid Man and Barnacle Boy',
      department: 'deck',
      company: 'Norwegian Cruise Line',
      location: 'International Waters',
      urgent: true,
      datePosted: '25/06/2023',
      expirationDate: '01/01/2030',
      experience: 'Fresh',
      gender: 'male',
      requirements: [
        'Valid certificates as per STCW 2010',
        'Min 1 Year Experience in the same position',
        'Good English communication',
        'Fully vaccination C-19'
      ]
    },
    {
      id: '2',
      title: 'Chief Engineer Officer',
      department: 'engine',
      company: 'NYK Shipmanagement',
      location: 'Southeast Asia',
      urgent: false,
      datePosted: '20/06/2023',
      expirationDate: '15/12/2023',
      experience: '5+ Years',
      gender: 'any',
      requirements: [
        'Chief Engineer COC',
        'Minimum 3 years experience as 2nd Engineer',
        'STCW Basic Safety Training',
        'Good communication skills'
      ]
    },
    {
      id: '3',
      title: 'Hotel Manager',
      department: 'hotel',
      company: 'Fred Olsen Cruise Lines',
      location: 'Caribbean Route',
      urgent: true,
      datePosted: '22/06/2023',
      expirationDate: '30/11/2023',
      experience: '3+ Years',
      gender: 'any',
      requirements: [
        'Hotel management degree',
        'Cruise ship experience preferred',
        'Fluent in English',
        'Leadership skills'
      ]
    },
    {
      id: '4',
      title: 'Waiters',
      department: 'hotel',
      company: 'Norwegian Cruise Line',
      location: 'Mediterranean Route',
      urgent: true,
      datePosted: '24/06/2023',
      expirationDate: '20/12/2023',
      experience: '1+ Years',
      gender: 'any',
      requirements: [
        'Previous restaurant experience',
        'Good communication skills',
        'Team player',
        'Physical fitness'
      ]
    },
    {
      id: '5',
      title: 'Lifeguard',
      department: 'deck',
      company: 'Norwegian Cruise Line',
      location: 'Caribbean Route',
      urgent: false,
      datePosted: '23/06/2023',
      expirationDate: '15/01/2024',
      experience: '2+ Years',
      gender: 'any',
      requirements: [
        'Lifeguard certification',
        'Swimming proficiency',
        'First aid training',
        'Good physical condition'
      ]
    },
    {
      id: '6',
      title: 'Motorman',
      department: 'engine',
      company: 'Norwegian Cruise Line',
      location: 'Alaska Route',
      urgent: true,
      datePosted: '21/06/2023',
      expirationDate: '10/12/2023',
      experience: '3+ Years',
      gender: 'male',
      requirements: [
        'Engine room experience',
        'Basic mechanical knowledge',
        'STCW certificates',
        'Team collaboration skills'
      ]
    },
    {
      id: '7',
      title: '2nd Electrician',
      department: 'engine',
      company: 'Norwegian Cruise Line',
      location: 'Baltic Sea Route',
      urgent: true,
      datePosted: '19/06/2023',
      expirationDate: '05/12/2023',
      experience: '4+ Years',
      gender: 'any',
      requirements: [
        'Electrical engineering background',
        'Ship electrical systems knowledge',
        'Troubleshooting skills',
        'Safety protocols awareness'
      ]
    }
  ];

  const otherPositions = [
    {
      id: '8',
      title: 'Stock Manager',
      department: 'deck' as Department,
      company: 'Alpha Adriatic'
    },
    {
      id: '9',
      title: 'Safety Manager',
      department: 'engine' as Department,
      company: 'SeaQuest'
    },
    {
      id: '10',
      title: 'Position Manager',
      department: 'hotel' as Department,
      company: 'FredOlsen'
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentColor = (department: Department) => {
    switch (department) {
      case 'hotel': return 'text-green-600';
      case 'deck': return 'text-blue-600';
      case 'engine': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleApplyNow = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleJobSelect = (job: Job) => {
    // For now, just trigger apply flow
    handleApplyNow();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Maritime Career Portal</h1>
            <p className="text-xl text-gray-600">Find your next adventure at sea</p>
            
            {isAuthenticated && (
              <div className="mt-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Job title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value as Department | 'all')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Department</option>
                    <option value="deck">Deck Department</option>
                    <option value="engine">Engine Department</option>
                    <option value="hotel">Hotel Department</option>
                  </select>
                </div>

                <div>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Principal Ship</option>
                    <option>Norwegian Cruise Line</option>
                    <option>Fred Olsen</option>
                    <option>Alpha Adriatic</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Find Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Department Filter */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Filter by Department</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {['all', 'deck', 'engine', 'hotel'].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept as Department | 'all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept === 'all' ? 'All Departments' : `${dept.charAt(0).toUpperCase()}${dept.slice(1)} Department`}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">Showing 1-{filteredJobs.length} of {filteredJobs.length} jobs</p>
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Sort by (Default)</option>
                <option>Date Posted</option>
                <option>Salary</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Show 15</option>
                <option>Show 30</option>
                <option>Show 50</option>
              </select>
            </div>
          </div>

          {/* Main Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleJobSelect(job)}
              >
                <div className="p-6">
                  {job.urgent && (
                    <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded-full mb-4">
                      Urgent
                    </span>
                  )}
                  
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg mr-4 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">NCL</span>
                    </div>
                    <div className="flex-1">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                        {job.company.includes('Norwegian') ? 'NCL' : job.company.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className={`text-sm font-medium ${getDepartmentColor(job.department)}`}>
                      {job.department.charAt(0).toUpperCase()}{job.department.slice(1)} Department
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">{job.title}</h3>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Posted: {job.datePosted}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Expires: {job.expirationDate}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyNow();
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Other Positions Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Other Positions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherPositions.map((position) => (
                <div key={position.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="mb-4">
                      <span className={`text-sm font-medium ${getDepartmentColor(position.department)}`}>
                        {position.department.charAt(0).toUpperCase()}{position.department.slice(1)} Department
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mt-1">{position.title}</h3>
                    </div>

                    <button
                      onClick={handleApplyNow}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs found for the selected department.</p>
            </div>
          )}
        </div>
      </section>
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default JobsPage;