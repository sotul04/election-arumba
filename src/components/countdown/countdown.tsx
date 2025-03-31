"use client"

import { useState, useEffect } from "react"
import { api } from "~/trpc/react"
import { Clock } from "lucide-react"

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

export function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [status, setStatus] = useState<"starts in" | "ends in" | "finished">("starts in");

    const { data: timeline } = api.timeline.getTimeline.useQuery();

    useEffect(() => {
        if (!timeline?.start || !timeline?.end) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const start = new Date(timeline.start).getTime();
            const end = new Date(timeline.end).getTime();

            let difference = 0;
            let newStatus: "starts in" | "ends in" | "finished" = "starts in";

            if (now < start) {
                difference = start - now;
                newStatus = "starts in";
            } else if (now >= start && now < end) {
                difference = end - now;
                newStatus = "ends in";
            } else {
                newStatus = "finished";
            }

            setStatus(newStatus);

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [timeline]);

    return (
        <div className="flex flex-col items-center text-center">
            <div className="text-lg font-semibold mb-2 flex gap-2 items-center"><Clock className="text-green-600" />Voting {status}</div>
            {status !== "finished" ? (
                <div className="flex justify-center gap-4 text-center">
                    <div className="flex flex-col">
                        <div className="text-3xl font-bold">{timeLeft.days}</div>
                        <div className="text-xs text-muted-foreground uppercase">Days</div>
                    </div>
                    <div className="text-xl font-bold self-center">:</div>
                    <div className="flex flex-col">
                        <div className="text-3xl font-bold">{timeLeft.hours.toString().padStart(2, "0")}</div>
                        <div className="text-xs text-muted-foreground uppercase">Hours</div>
                    </div>
                    <div className="text-xl font-bold self-center">:</div>
                    <div className="flex flex-col">
                        <div className="text-3xl font-bold">{timeLeft.minutes.toString().padStart(2, "0")}</div>
                        <div className="text-xs text-muted-foreground uppercase">Minutes</div>
                    </div>
                    <div className="text-xl font-bold self-center">:</div>
                    <div className="flex flex-col">
                        <div className="text-3xl font-bold">{timeLeft.seconds.toString().padStart(2, "0")}</div>
                        <div className="text-xs text-muted-foreground uppercase">Seconds</div>
                    </div>
                </div>
            ) : (
                <div className="text-xl font-bold text-red-600">Voting has ended</div>
            )}
        </div>
    );
}