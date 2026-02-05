"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Loader2,Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { analyzeIdea } from "@/lib/actions";
import type { MarketAnalysisOutput } from "@/ai/flows/generate-market-analysis-report";
import { useAuth } from "@/hooks/use-auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const FormSchema = z.object({
  idea: z
    .string()
    .min(15, {
      message: "Please enter a more detailed idea (at least 15 characters).",
    }),
});

interface IdeaInputFormProps {
  onAnalysis: (ideaText: string, analysisData: MarketAnalysisOutput) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loading: boolean;
}

export function IdeaInputForm({ onAnalysis, setLoading, setError, loading }: IdeaInputFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { firestore } = initializeFirebase();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      idea: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setError(null);

    const result = await analyzeIdea(data.idea);

    if (result.success && result.data) {
      onAnalysis(data.idea, result.data);
      if (user) {
        const analysesCollection = collection(firestore, "analyses");
        const newAnalysisData = {
          userId: user.uid,
          ideaText: data.idea,
          ...result.data,
          createdAt: serverTimestamp(),
        };

        addDoc(analysesCollection, newAnalysisData)
          .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: analysesCollection.path,
              operation: 'create',
              requestResourceData: newAnalysisData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
      }
      form.reset(); // Clear form on success
    } else {
      const raw = result.error || "An unknown error occurred.";
      const lowered = raw.toLowerCase();

      const friendly =
        lowered.includes('429') || lowered.includes('quota') || lowered.includes('rate limit')
          ? 'API quota exceeded. Please wait and try again later.'
          : (lowered.includes('404') || lowered.includes('not found')) && lowered.includes('model')
          ? 'The AI model is temporarily unavailable. Please try again shortly.'
          : 'Something went wrong. Please try again.';

      setError(friendly);
      toast({
        title: "Analysis Failed",
        description: friendly,
        variant: "destructive",
        duration: 6000,
      });
    }

    setLoading(false);
  }

  return (
    <div className="p-4">
      <div className="mx-auto max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Textarea
                  placeholder="Ask MarketMind to simulate, analyze, or predict..."
                  className="resize-none min-h-[60px] rounded-2xl border-border/60 bg-background/60 px-6 py-4 text-base focus:border-primary/50 focus-visible:ring-primary/20"
                  rows={2}
                  {...form.register("idea")}
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="h-[60px] rounded-2xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            {form.formState.errors.idea && (
              <p className="mt-2 text-sm text-destructive">
                {form.formState.errors.idea.message}
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
