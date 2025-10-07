"use client";

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Download, 
  Share2, 
  ArrowLeft,
  CheckCircle,
  Trophy,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';

interface CertificatePageClientProps {
  certificate: any;
  examResult: any;
}

export default function CertificatePageClient({
  certificate,
  examResult,
}: CertificatePageClientProps) {
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      // Dynamic import of html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = certificateRef.current;
      const opt = {
        margin: 0,
        filename: `certificate-${certificate.course.title.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Certificate of Completion - ${certificate.course.title}`,
      text: `I've completed ${certificate.course.title} and earned a certificate with a score of ${certificate.examScore}/1000!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-600" />
              Certificate of Completion
            </h1>
            <p className="text-muted-foreground mt-1">
              Awarded for successfully completing {certificate.course.title}
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
              <div className="text-3xl font-bold">{certificate.examScore}/1000</div>
              <div className="text-sm text-muted-foreground mt-1">Exam Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-lg font-semibold">{formatDate(certificate.issuedAt)}</div>
              <div className="text-sm text-muted-foreground mt-1">Issue Date</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-lg font-semibold">Verified</div>
              <div className="text-sm text-muted-foreground mt-1">Authentic Certificate</div>
            </CardContent>
          </Card>
        </div>

        {/* Certificate */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div
              ref={certificateRef}
              className="bg-white p-12 md:p-16"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #f0f9ff 25%, transparent 25%),
                  linear-gradient(-45deg, #f0f9ff 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f0f9ff 75%),
                  linear-gradient(-45deg, transparent 75%, #f0f9ff 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            >
              {/* Border */}
              <div className="border-8 border-blue-600 p-8 md:p-12 relative">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-500"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-500"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-500"></div>

                <div className="text-center space-y-6">
                  {/* Logo/Icon */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                      Certificate of Completion
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-yellow-500 mx-auto"></div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-lg text-gray-600">
                    This is to certify that
                  </p>

                  {/* Recipient Name */}
                  <div>
                    <h3 className="text-5xl md:text-6xl font-serif font-bold text-blue-900 mb-2">
                      {certificate.user.name || 'Student'}
                    </h3>
                    <div className="w-48 h-0.5 bg-gray-400 mx-auto"></div>
                  </div>

                  {/* Achievement */}
                  <div className="space-y-2">
                    <p className="text-lg text-gray-600">
                      has successfully completed the course
                    </p>
                    <h4 className="text-3xl md:text-4xl font-bold text-gray-800">
                      {certificate.course.title}
                    </h4>
                    <div className="flex justify-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-base px-4 py-1">
                        {certificate.course.category.name}
                      </Badge>
                      <Badge variant="outline" className="text-base px-4 py-1">
                        {certificate.course.level}
                      </Badge>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 inline-block">
                    <p className="text-sm text-gray-600 mb-1">Final Exam Score</p>
                    <p className="text-4xl font-bold text-blue-600">
                      {certificate.examScore}/1000
                    </p>
                    {examResult && (
                      <p className="text-sm text-gray-600 mt-1">
                        {examResult.correctAnswers}/{examResult.totalQuestions} Correct ({Math.round((examResult.correctAnswers / examResult.totalQuestions) * 100)}%)
                      </p>
                    )}
                  </div>

                  {/* Date and Signature */}
                  <div className="flex justify-between items-end pt-8 mt-8 border-t border-gray-300">
                    <div className="text-left">
                      <p className="text-sm text-gray-600 mb-2">Date of Completion</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatDate(certificate.issuedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-2">Instructor</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {certificate.course.instructor.name}
                      </p>
                      <div className="w-32 h-0.5 bg-gray-400 mt-2"></div>
                    </div>
                  </div>

                  {/* Certificate ID */}
                  <div className="pt-4">
                    <p className="text-xs text-gray-500">
                      Certificate ID: {certificate.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ghana Tech Online - www.ghanatech.online
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownload} size="lg" className="gap-2">
            <Download className="w-5 h-5" />
            Download PDF
          </Button>
          <Button onClick={handleShare} size="lg" variant="outline" className="gap-2">
            <Share2 className="w-5 h-5" />
            Share Achievement
          </Button>
        </div>

        {/* Additional Info */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">About This Certificate</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This certificate verifies that {certificate.user.name || 'the student'} has successfully completed 
                  all course requirements and passed the final examination with a score of {certificate.examScore}/1000.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Completed all course lessons</li>
                  <li>✓ Passed final examination (minimum 800/1000 required)</li>
                  <li>✓ Demonstrated mastery of course material</li>
                  <li>✓ Certificate is verifiable via unique ID</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
