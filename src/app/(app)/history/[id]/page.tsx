"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { AnalysisRecord } from "@/lib/types";
import { AnalysisReport } from "@/components/dashboard/analysis-report";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";

export default function HistoryDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { firestore } = initializeFirebase();

  useEffect(() => {
    function fetchAnalysis() {
      if (!user) return;
      setLoading(true);

      const docRef = doc(firestore, "analyses", params.id);
      
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data() as AnalysisRecord;
          // Client-side check remains a good practice as a fallback.
          if (data.userId === user.uid) {
            setAnalysis(data);
          } else {
            setError("You do not have permission to view this analysis.");
          }
        } else {
          setError("Analysis not found.");
        }
      }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError("Failed to fetch the analysis."); // Keep setting local error for UI feedback
      }).finally(() => {
        setLoading(false);
      });
    }
    fetchAnalysis();
  }, [user, params.id, firestore]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  if (analysis) {
    return (
        <AnalysisReport 
            data={analysis} 
            ideaText={analysis.ideaText}
            onReset={() => router.push('/dashboard')}
        />
    )
  }

  return null;
}
