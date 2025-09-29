"use client";

import React from "react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, MessageSquare, AlertCircle } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CourseReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  courseId: string;
  canReview: boolean;
}

export function CourseReviews({ 
  reviews, 
  averageRating, 
  totalReviews, 
  courseId, 
  canReview 
}: CourseReviewsProps) {
  const { user, isSignedIn } = useUser();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          rating,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      // Reset form and hide it
      setComment("");
      setRating(5);
      setShowReviewForm(false);
      
      // Refresh page to show new review
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onStarClick?.(star) : undefined}
            className={interactive ? "hover:scale-110 transition-transform" : ""}
            disabled={!interactive}
          >
            <Star
              className={`w-4 h-4 ${
                star <= rating 
                  ? "text-yellow-400 fill-current" 
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Check if user has already reviewed
  const userHasReviewed = user?.id && reviews.some(r => r.user.id === user.id);

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reviews & Ratings</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(Math.round(averageRating))}
                <span className="font-medium">
                  {averageRating > 0 ? averageRating.toFixed(1) : "No ratings yet"}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({totalReviews} reviews)
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {canReview && !userHasReviewed && (
            <div className="mb-6">
              <Button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant="outline"
                className="w-full"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="space-y-4 p-4 border rounded-lg mb-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Rating
                </label>
                {renderStars(rating, true, setRating)}
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-2">
                  Your Review (Optional)
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this course..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={review.user.image || ""} />
                      <AvatarFallback>
                        {review.user.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">
                            {review.user.name || "Anonymous"}
                          </p>
                          <div className="flex items-center space-x-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No reviews yet. Be the first to review this course!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}