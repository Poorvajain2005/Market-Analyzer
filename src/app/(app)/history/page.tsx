"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import Link from "next/link";
import { format } from "date-fns";
import { initializeFirebase } from "@/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { AnalysisRecord } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function HistoryPage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<(AnalysisRecord & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const { firestore } = initializeFirebase();

  useEffect(() => {
    function fetchAnalyses() {
      if (!user) return;
      setLoading(true);
      const q = query(
        collection(firestore, "analyses"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      
      getDocs(q).then(querySnapshot => {
        const fetchedAnalyses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as AnalysisRecord & { id: string }));
        setAnalyses(fetchedAnalyses);
      }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: 'analyses',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
      }).finally(() => {
        setLoading(false);
      });
    }
    fetchAnalyses();
  }, [user, firestore]);

  const items = analyses.map(analysis => ({
    id: analysis.id,
    type: analysis.verdict,
    title: analysis.ideaText,
    date: analysis.createdAt ? format(analysis.createdAt.toDate(), "PPP") : 'N/A'
  }));

  if (loading) {
    return (
        <div>
            <h1 className="font-headline text-3xl font-bold mb-6">Analysis History</h1>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-headline text-3xl font-bold mb-6">Analysis History</h1>
      <div className="mb-4 flex gap-3">
        <div>
          <label className="text-sm text-muted-foreground">Type</label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="mt-1 w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Positive">Positive</SelectItem>
              <SelectItem value="Negative">Negative</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items
            .filter(i => filter === "all" || i.type === filter)
            .map(i => (
              <Link href={`/history/${i.id}`} key={i.id} className="block">
                <Card className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{i.title}</CardTitle>
                        <div className="text-xs text-muted-foreground">{i.type} • {i.date}</div>
                      </div>
                      <Badge variant={i.type === 'Positive' ? 'default' : 'destructive'}>{i.type}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
        </div>
      ) : (
        <Card className="text-center py-12">
            <CardHeader>
                <CardTitle>No History Found</CardTitle>
                <CardDescription>You haven&apos;t analyzed any ideas yet. Go to the dashboard to get started!</CardDescription>
            </CardHeader>
        </Card>
      )}
    </div>
  );
}
