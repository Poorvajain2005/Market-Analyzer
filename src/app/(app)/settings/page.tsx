"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { initializeFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const { auth } = initializeFirebase();

    const [risk, setRisk] = useState("medium");
    const [focus, setFocus] = useState("global");
    const [depth, setDepth] = useState("fast");

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast({ title: "Signed Out", description: "You have been successfully signed out." });
            // AuthProvider will handle redirect
        } catch (error) {
            console.error("Error signing out: ", error);
            toast({ title: "Error", description: "Failed to sign out. Please try again.", variant: "destructive" });
        }
    };
    
    return (
        <div className="flex h-full flex-col">
            <header className="w-full border-b border-border/40 bg-card/40 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-6 py-5">
                    <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
                <Card className="border-border/40 bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-lg">System Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm text-muted-foreground">Risk appetite</label>
                            <Select value={risk} onValueChange={setRisk}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select risk" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm text-muted-foreground">Market focus</label>
                            <Select value={focus} onValueChange={setFocus}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select market" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="india">India</SelectItem>
                                    <SelectItem value="us">US</SelectItem>
                                    <SelectItem value="global">Global</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm text-muted-foreground">Agent depth</label>
                            <Select value={depth} onValueChange={setDepth}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Agent depth" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fast">Fast</SelectItem>
                                    <SelectItem value="deep">Deep</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6">
                    <Button>Save Settings</Button>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">Adjust system behavior to match your team’s workflow.</div>

                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Manage your account settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>
                         <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                                <p className="font-medium">Sign Out</p>
                                <p className="text-sm text-muted-foreground">End your current session.</p>
                            </div>
                             <Button variant="destructive" onClick={handleSignOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
