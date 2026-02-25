import { LinkedInPost } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

interface LinkedInPostCardProps {
  post: LinkedInPost;
}

export function LinkedInPostCard({ post }: LinkedInPostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-all duration-200 hover:scale-[1.02]"
    >
      <Card className="p-6 h-full hover:shadow-lg hover:bg-accent transition-all duration-200">
        <p className="text-foreground mb-4 line-clamp-3">
          {post.content}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span>{post.shares.toLocaleString()}</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          {formatDate(post.date)}
        </p>
      </Card>
    </a>
  );
}
