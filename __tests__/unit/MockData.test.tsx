import {
  profile,
  highlights,
  statistics,
  videos,
  youtubeChannels,
  contentTopics,
  githubProjects,
  linkedinPosts,
  jobs,
  thesis,
  socialLinks,
} from '@/lib/data/mockData';

describe('Mock Data Validation', () => {
  it('should have all required data arrays defined and non-empty', () => {
    // Profile data
    expect(profile).toBeDefined();
    expect(profile.name).toBeTruthy();
    expect(profile.title).toBeTruthy();
    
    // Highlights array
    expect(highlights).toBeDefined();
    expect(Array.isArray(highlights)).toBe(true);
    expect(highlights.length).toBeGreaterThan(0);
    
    // Statistics array
    expect(statistics).toBeDefined();
    expect(Array.isArray(statistics)).toBe(true);
    expect(statistics.length).toBeGreaterThan(0);
    
    // Videos array
    expect(videos).toBeDefined();
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBeGreaterThan(0);
    
    // YouTube channels array
    expect(youtubeChannels).toBeDefined();
    expect(Array.isArray(youtubeChannels)).toBe(true);
    expect(youtubeChannels.length).toBeGreaterThan(0);
    
    // Content topics array
    expect(contentTopics).toBeDefined();
    expect(Array.isArray(contentTopics)).toBe(true);
    expect(contentTopics.length).toBeGreaterThan(0);
    
    // GitHub projects array
    expect(githubProjects).toBeDefined();
    expect(Array.isArray(githubProjects)).toBe(true);
    expect(githubProjects.length).toBeGreaterThan(0);
    
    // LinkedIn posts array
    expect(linkedinPosts).toBeDefined();
    expect(Array.isArray(linkedinPosts)).toBe(true);
    expect(linkedinPosts.length).toBeGreaterThan(0);
    
    // Jobs array
    expect(jobs).toBeDefined();
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.length).toBeGreaterThan(0);
    
    // Thesis data
    expect(thesis).toBeDefined();
    expect(thesis.title).toBeTruthy();
    
    // Social links array
    expect(socialLinks).toBeDefined();
    expect(Array.isArray(socialLinks)).toBe(true);
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  it('should have valid data structure for highlights', () => {
    highlights.forEach(highlight => {
      expect(highlight.id).toBeDefined();
      expect(highlight.icon).toBeDefined();
      expect(highlight.text).toBeDefined();
      expect(typeof highlight.text).toBe('string');
      expect(highlight.text.length).toBeGreaterThan(0);
    });
  });

  it('should have valid data structure for statistics', () => {
    statistics.forEach(stat => {
      expect(stat.id).toBeDefined();
      expect(stat.label).toBeDefined();
      expect(stat.value).toBeDefined();
      expect(stat.icon).toBeDefined();
      expect(typeof stat.label).toBe('string');
      expect(typeof stat.value).toBe('string');
    });
  });

  it('should have valid data structure for videos', () => {
    videos.forEach(video => {
      expect(video.id).toBeDefined();
      expect(video.title).toBeDefined();
      expect(video.thumbnail).toBeDefined();
      expect(video.url).toBeDefined();
      expect(typeof video.title).toBe('string');
      expect(video.title.length).toBeGreaterThan(0);
    });
  });

  it('should have valid data structure for GitHub projects', () => {
    githubProjects.forEach(project => {
      expect(project.id).toBeDefined();
      expect(project.name).toBeDefined();
      expect(project.description).toBeDefined();
      expect(project.stars).toBeDefined();
      expect(project.url).toBeDefined();
      expect(project.technologies).toBeDefined();
      expect(Array.isArray(project.technologies)).toBe(true);
      expect(typeof project.stars).toBe('number');
    });
  });

  it('should have valid data structure for LinkedIn posts', () => {
    linkedinPosts.forEach(post => {
      expect(post.id).toBeDefined();
      expect(post.content).toBeDefined();
      expect(post.likes).toBeDefined();
      expect(post.comments).toBeDefined();
      expect(post.shares).toBeDefined();
      expect(post.url).toBeDefined();
      expect(post.date).toBeDefined();
      expect(typeof post.likes).toBe('number');
      expect(typeof post.comments).toBe('number');
      expect(typeof post.shares).toBe('number');
    });
  });
});
