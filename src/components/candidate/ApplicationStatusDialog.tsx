import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Check, Clock } from "lucide-react";
import { Application } from "@/pages/candidate/Applications";

interface ApplicationStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    application: Application | null;
}

const steps = [
    { label: "Lamaran Terkirim", id: "applied" },
    { label: "Psikotes", id: "psychotest" },
    { label: "Wawancara", id: "interview" },
    { label: "Kesehatan", id: "health" },
    { label: "Status", id: "status" },
];

const getStepStatus = (stepIndex: number, currentStatus: string) => {
    // Defines which step we are currently AT or PAST
    // 0: Applied, 1: Psychotest, 2: Interview, 3: Health, 4: Status

    let currentStepProgress = 0;

    // Map application status to progress in the stepper
    if (["shortlisted"].includes(currentStatus)) currentStepProgress = 1;
    else if (["interview"].includes(currentStatus)) currentStepProgress = 2;
    else if (["offered", "rejected", "withdrawn"].includes(currentStatus)) currentStepProgress = 4;
    // Note: 'reviewed' and 'pending' stay at 0

    if (stepIndex <= currentStepProgress) {
        // Special case: If we are 'at' step 1 (Psikotes), it might be 'pending' (waiting for user/admin) 
        // or 'completed' (done). 
        // For this UI, we'll assume:
        // - Step 0 (Applied) is always COMPLETED.
        // - Future steps are PENDING (Waiting).
        // - Current step logic depends on more detailed state we don't have, 
        //   so we'll simulate "Passed" for previous steps and "Waiting" for current/future.

        if (stepIndex < currentStepProgress) return 'completed';
        if (stepIndex === 0) return 'completed'; // Applied is always done

        // Use 'pending' visual for the current active step to match "Menunggu" (Waiting) from screenshot
        // unless it's the final info.
        return 'pending';
    }

    return 'pending';
};

export const ApplicationStatusDialog = ({ isOpen, onClose, application }: ApplicationStatusDialogProps) => {
    if (!application) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white sm:rounded-xl">
                <DialogHeader className="p-0" /> {/* Default Close button is sufficient */}

                <div className="p-8 pb-10">
                    {/* Header Section */}
                    <div className="flex flex-col items-center justify-center text-center space-y-4 mb-10">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-blue-400 shadow-md">
                            <span className="text-blue-400">
                                {application.job.company_name.substring(0, 1).toUpperCase()}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-gray-900">
                                {application.job.title} | {application.job.company_name}
                            </h2>
                            <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
                                {application.job.location}
                            </p>
                        </div>
                    </div>

                    {/* Stepper Section */}
                    <div className="relative flex justify-between items-start w-full px-8 mb-12">
                        {/* Connecting Line */}
                        <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 -z-10 translate-y-0" />

                        {steps.map((step, index) => {
                            const status = getStepStatus(index, application.status);
                            const isCompleted = status === 'completed';
                            // We treat everything else as 'pending' visual (Orange) per the screenshot style for incomplete steps
                            // But technically 'waiting' vs 'upcoming' might differ. Screenshot shows 'Menunggu' for all future steps.

                            const isFirst = index === 0;

                            return (
                                <div key={index} className="flex flex-col items-center bg-white px-4 z-10 min-w-[100px]">
                                    {/* Icon Circle */}
                                    <div className={`
                                w-14 h-14 rounded-full flex items-center justify-center mb-3 border-[3px] shadow-sm transition-colors duration-200
                                ${isCompleted ? 'bg-green-500 border-green-200 text-white' : 'bg-orange-500 border-orange-200 text-white'}
                            `}>
                                        {isCompleted ? <Check className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                                    </div>

                                    {/* Label */}
                                    <div className="text-center">
                                        <p className="font-bold text-sm text-gray-900 mb-1">{step.label}</p>
                                        <p className="text-xs text-gray-400 font-medium">
                                            {isFirst ? new Date(application.applied_at).toLocaleDateString() : 'Menunggu'}
                                        </p>
                                        {isFirst && (
                                            <p className="text-xs text-gray-400">
                                                {new Date(application.applied_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <hr className="border-gray-100 my-8" />

                    {/* Call to Test Section */}
                    <div className="space-y-6">
                        <h3 className="text-orange-500 font-bold text-lg">Panggilan Test Terkait</h3>

                        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl min-h-[250px] border border-dashed border-gray-200">
                            <div className="mb-4 opacity-70">
                                {/* Simple Illustration */}
                                <svg width="120" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <path d="M12 18v-4" />
                                    <path d="M16 16l-4 2-4-2" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-lg font-medium">Belum Ada Panggilan Tes</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
