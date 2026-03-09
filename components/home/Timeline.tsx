'use client';

import { Job } from '@/lib/types';
import { useState } from 'react';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { UnderConstruction } from '../common/UnderConstruction';

interface TimelineProps {
  jobs: Job[];
  dict: any;
}

export function Timeline({ jobs, dict }: TimelineProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex justify-center gap-8 mb-12">
        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
            activeTab === 'education'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="font-medium">{dict.home.experience.education}</span>
        </button>
        <button
          onClick={() => setActiveTab('work')}
          className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
            activeTab === 'work'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="font-medium">{dict.home.experience.work}</span>
        </button>
      </div>

      {/* Timeline */}
      {activeTab === 'education' && (
        <UnderConstruction dict={dict}/>
      )}

      <div className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 -translate-x-1/2 hidden md:block" />
        
        <div className="space-y-12">

          {activeTab === 'work' && jobs.map((job, index) => {
            const isLeft = index % 2 === 0;
            
            return (
              <div key={job.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-1/2 top-6 w-3 h-3 rounded-full bg-primary -translate-x-1/2 z-10 hidden md:block" />
                
                {/* Mobile dot */}
                <div className="absolute left-0 top-6 w-3 h-3 rounded-full bg-primary z-10 md:hidden" />
                
                {/* Content */}
                <div className={`grid md:grid-cols-2 gap-8 ${isLeft ? '' : 'md:grid-flow-dense'}`}>
                  {/* Left side */}
                  <div className={`${isLeft ? 'md:text-right' : 'md:col-start-2'} pl-6 md:pl-0`}>
                    <div className={`inline-block ${isLeft ? 'md:mr-8' : 'md:ml-8'} text-left`}>
                      <h3 className="text-xl font-semibold mb-1">{job.role}</h3>
                      <p className="text-muted-foreground mb-2">{job.company}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>{job.period}</span>
                      </div>
                      
                      {job.technologies && job.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.technologies.slice(0, 5).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right side (empty for spacing) */}
                  <div className={`hidden md:block ${isLeft ? 'md:col-start-2' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
