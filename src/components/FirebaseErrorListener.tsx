'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Show a user-friendly toast notification.
      toast({
        variant: 'destructive',
        title: 'Permission Error',
        description: 'You do not have permission to complete this action.',
      });

      // In development, throw the error to show the rich Next.js overlay.
      if (process.env.NODE_ENV === 'development') {
        // This will be caught by the Next.js error overlay.
        throw error;
      } else {
        // In production, you would log to a service like Sentry.
        console.error('Firestore Permission Error:', error.context);
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null; // This component does not render anything.
}
