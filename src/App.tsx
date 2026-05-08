// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import React, { useState, useEffect } from 'react';
// import { 
//   LayoutDashboard, 
//   PlusCircle, 
//   History, 
//   Target, 
//   AlertTriangle, 
//   CheckCircle2, 
//   ChevronRight, 
//   Info,
//   Wallet,
//   Calendar,
//   User,
//   ArrowRight,
//   Home,
//   PieChart,
//   TrendingUp,
//   BookOpen,
//   Download
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'motion/react';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

// // --- Types ---

// type Step = 
//   | 'disclaimer' 
//   | 'profile' 
//   | 'recall-2024' 
//   | 'recall-2025' 
//   | 'planning-1' 
//   | 'planning-2' 
//   | 'training-story' 
//   | 'training-quiz' 
//   | 'training-prioritize' 
//   | 'training-staying-gauri'
//   | 'training-staying-jagdish'
//   | 'transition' 
//   | 'dashboard' 
//   | 'add-installment';

// interface Profile {
//   name: string;
//   location: string;
// }

// interface YearRecall {
//   pendingStart: number;
//   advanceTaken: number;
//   monthsWorked: number;
//   arrearsRemaining: number;
// }

// interface PlanningData {
//   plannedAdvance: number;
//   usePriorityPlan: boolean;
//   priorityNeeds: { item: string; amount: number }[];
// }

// interface Installment {
//   id: string;
//   amount: number;
//   purpose: string;
//   date: string;
// }

// // --- TTS Helper ---
// import { GoogleGenAI, Modality } from "@google/genai";

// const speakText = async (text: string) => {
//   try {
//     // Try to get API key from multiple sources
//     const apiKey = process.env.GEMINI_API_KEY || (window as any).process?.env?.GEMINI_API_KEY || (window as any).GEMINI_API_KEY;
    
//     if (!apiKey) {
//       console.warn("Gemini API Key not found for TTS. Falling back to browser speech.");
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 0.8;
//       window.speechSynthesis.speak(utterance);
//       return;
//     }

//     const ai = new GoogleGenAI({ apiKey });
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-preview-tts",
//       contents: [{ parts: [{ text: `Say clearly and slowly in a helpful tone: ${text}` }] }],
//       config: {
//         responseModalities: [Modality.AUDIO],
//         speechConfig: {
//           voiceConfig: {
//             prebuiltVoiceConfig: { voiceName: 'Kore' },
//           },
//         },
//       },
//     });

//     const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
//     if (base64Audio) {
//       const audioContent = `data:audio/mp3;base64,${base64Audio}`;
//       const audio = new Audio(audioContent);
//       await audio.play();
//     } else {
//       throw new Error("No audio data in response");
//     }
//   } catch (error) {
//     console.error("TTS Error:", error);
//     // Fallback to browser TTS if Gemini fails
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.8;
//     window.speechSynthesis.speak(utterance);
//   }
// };

// const VoiceButton = ({ text }: { text: string }) => (
//   <button 
//     onClick={() => speakText(text)}
//     className="p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
//     title="Read aloud"
//   >
//     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
//   </button>
// );

// const Banner = ({ type }: { type: 'past' | 'planning' | 'training' | 'transition' }) => {
//   const configs = {
//     past: {
//       color: 'from-amber-400 to-orange-500',
//       icon: <History className="w-12 h-12 text-white/80" />,
//       label: 'Season History'
//     },
//     planning: {
//       color: 'from-emerald-400 to-teal-600',
//       icon: <TrendingUp className="w-12 h-12 text-white/80" />,
//       label: 'Future Planning'
//     },
//     training: {
//       color: 'from-blue-400 to-indigo-600',
//       icon: <BookOpen className="w-12 h-12 text-white/80" />,
//       label: 'Learning Module'
//     },
//     transition: {
//       color: 'from-purple-400 to-pink-600',
//       icon: <CheckCircle2 className="w-12 h-12 text-white/80" />,
//       label: 'Ready to Track'
//     }
//   };

//   const config = configs[type];

//   return (
//     <div className={`w-full h-32 bg-gradient-to-br ${config.color} rounded-[32px] shadow-lg flex items-center justify-center relative overflow-hidden`}>
//       <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
//         {config.icon}
//       </div>
//       <div className="absolute -left-4 -top-4 opacity-10 transform -rotate-12 scale-150">
//         {config.icon}
//       </div>
//       <div className="flex flex-col items-center gap-1 z-10">
//         <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
//           {config.icon}
//         </div>
//         <span className="text-white/90 text-xs font-bold uppercase tracking-widest">{config.label}</span>
//       </div>
//     </div>
//   );
// };

// // --- Components ---

// const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
//   <div className={`bg-white rounded-[32px] shadow-sm border border-stone-200 p-6 ${className}`}>
//     {children}
//   </div>
// );

// const Button = ({ 
//   children, 
//   onClick, 
//   variant = 'primary', 
//   className = "",
//   disabled = false
// }: { 
//   children: React.ReactNode; 
//   onClick?: () => void; 
//   variant?: 'primary' | 'secondary' | 'outline' | 'danger';
//   className?: string;
//   disabled?: boolean;
// }) => {
//   const variants = {
//     primary: 'bg-[#5A5A40] text-white hover:bg-[#4A4A30]',
//     secondary: 'bg-stone-800 text-white hover:bg-stone-900',
//     outline: 'border-2 border-stone-200 text-stone-600 hover:bg-stone-50',
//     danger: 'bg-rose-500 text-white hover:bg-rose-600',
//   };

//   return (
//     <button 
//       onClick={onClick}
//       disabled={disabled}
//       className={`px-6 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// const Header = ({ onBack, title }: { onBack?: () => void; title?: string }) => (
//   <div className="flex items-center justify-between p-4 sticky top-0 bg-stone-50/80 backdrop-blur-md z-40">
//     {onBack ? (
//       <button 
//         onClick={onBack}
//         className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
//       </button>
//     ) : <div className="w-10" />}
//     <h1 className="font-serif italic text-xl text-stone-800">{title || 'Koyta-Sathi'}</h1>
//     <div className="w-10" />
//   </div>
// );

// const ProgressBar = ({ current, total }: { current: number; total: number }) => (
//   <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
//     <div 
//       className="h-full bg-emerald-500 transition-all duration-500" 
//       style={{ width: `${(current / total) * 100}%` }}
//     />
//   </div>
// );

// // --- Views ---

// interface DisclaimerViewProps {
//   onNext: () => void;
//   key?: string;
// }

// const DisclaimerView = ({ onNext }: DisclaimerViewProps) => (
//   <motion.div 
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     className="max-w-md mx-auto space-y-8 p-4"
//   >
//     <div className="text-center space-y-4">
//       <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
//         <Info className="w-10 h-10 text-emerald-600" />
//       </div>
//       <h1 className="text-3xl font-bold text-stone-900">Welcome</h1>
//       <p className="text-stone-500">Please read these important notes before we begin.</p>
//     </div>

//     <Card className="space-y-6 border-l-4 border-l-emerald-500">
//       <div className="space-y-4">
//         <div className="flex gap-3">
//           <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
//           <p className="text-sm text-stone-600 leading-relaxed">
//             <strong>Research Study:</strong> We are inviting you to use this app over the next few months as part of a research initiative with SOPPECOM being led by Professor Eliana La Ferrara and Aditi Bhowmick, at Harvard University. The purpose of the research is to develop and assess tools that can potentially improve the financial well-being of sugarcane cutters in Maharashtra. Any information you provide on the app will only be available to the researchers mentioned for analysis purposes only. All of your data provided on the app will be deleted from app storage by the end of the agricultural cycle (i.e. April 2027).
//             <br /><br />
//             Please feel free to contact xyz at xyz if you have any questions.
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
//           <p className="text-sm text-stone-600 leading-relaxed">
//             <strong>Not Financial Advice:</strong> This is a tool to help you track debt and plan. It does not give professional financial advice or tell you what to do.
//           </p>
//         </div>
//       </div>
//     </Card>

//     <Button onClick={onNext} className="w-full">
//       I Understand & Agree <ArrowRight className="w-5 h-5" />
//     </Button>
//   </motion.div>
// );

// interface ProfileViewProps {
//   profile: Profile;
//   setProfile: React.Dispatch<React.SetStateAction<Profile>>;
//   onNext: () => void;
//   key?: string;
// }

// const ProfileView = ({ profile, setProfile, onNext }: ProfileViewProps) => (
//   <motion.div 
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     className="max-w-md mx-auto space-y-6 p-4"
//   >
//     <div className="space-y-2">
//       <h2 className="text-2xl font-bold">Your Profile</h2>
//       <p className="text-stone-500">Let's start with your basic info.</p>
//     </div>

//     <Card className="space-y-4">
//       <div className="space-y-2">
//         <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
//           <User className="w-4 h-4" /> Your Name
//         </label>
//         <input 
//           type="text" 
//           placeholder="Enter your name"
//           className="w-full p-4 rounded-xl border-2 border-stone-100 focus:border-emerald-500 outline-none transition-all"
//           value={profile.name}
//           onChange={(e) => setProfile({ ...profile, name: e.target.value })}
//         />
//       </div>
//       <div className="space-y-2">
//         <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
//           <Calendar className="w-4 h-4" /> Village/Location
//         </label>
//         <input 
//           type="text" 
//           placeholder="Enter your village"
//           className="w-full p-4 rounded-xl border-2 border-stone-100 focus:border-emerald-500 outline-none transition-all"
//           value={profile.location}
//           onChange={(e) => setProfile({ ...profile, location: e.target.value })}
//         />
//       </div>
//     </Card>

//     <Button onClick={onNext} className="w-full" disabled={!profile.name}>
//       Continue <ArrowRight className="w-5 h-5" />
//     </Button>
//   </motion.div>
// );

// interface RecallViewProps {
//   year: string;
//   recall: YearRecall;
//   setRecall: React.Dispatch<React.SetStateAction<YearRecall>>;
//   onNext: () => void;
//   key?: string;
// }

// const RecallView = ({ year, recall, setRecall, onNext }: RecallViewProps) => {
//   const title = `Past Season: ${year}`;
//   const instruction = `Think back to your ${year} season. How much advance did you start with, how much did you take, how many months did you work, and what was left?`;
  
//   const imageSrc = year === "2024-2025" ? "/input_file_0.png" : "/input_file_1.png";

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-md mx-auto space-y-6 p-4"
//     >
//       <div className="space-y-2">
//         <div className="flex justify-between items-start">
//           <h2 className="text-2xl font-serif italic font-bold flex items-center gap-2">
//             <History className="w-6 h-6 text-amber-500" /> {title}
//           </h2>
//           <VoiceButton text={instruction} />
//         </div>
//         <p className="text-stone-500 text-sm">{instruction}</p>
//       </div>

//       <Banner type="past" />

//       <Card className="space-y-6">
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-stone-700">Advance pending at start (₹)</label>
//           <input 
//             type="number" 
//             className="w-full p-4 rounded-xl border-2 border-stone-100 focus:border-amber-500 outline-none text-2xl font-bold"
//             value={recall.pendingStart || ''}
//             onChange={(e) => setRecall({ ...recall, pendingStart: Number(e.target.value) })}
//           />
//         </div>
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-stone-700">Total advance taken in {year.split('-')[0]} (₹)</label>
//           <input 
//             type="number" 
//             className="w-full p-4 rounded-xl border-2 border-stone-100 focus:border-amber-500 outline-none text-2xl font-bold"
//             value={recall.advanceTaken || ''}
//             onChange={(e) => setRecall({ ...recall, advanceTaken: Number(e.target.value) })}
//           />
//         </div>
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-stone-700">Months Worked</label>
//           <input 
//             type="number" 
//             className="w-full p-4 rounded-xl border-2 border-stone-100 focus:border-amber-500 outline-none text-2xl font-bold"
//             value={recall.monthsWorked || ''}
//             onChange={(e) => setRecall({ ...recall, monthsWorked: Number(e.target.value) })}
//           />
//         </div>
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-stone-700">Arrears Remaining (₹)</label>
//           <input 
//             type="number" 
//             className="w-full p-4 rounded-xl border-2 border-stone-100 focus:border-amber-500 outline-none text-2xl font-bold"
//             value={recall.arrearsRemaining || ''}
//             onChange={(e) => setRecall({ ...recall, arrearsRemaining: Number(e.target.value) })}
//           />
//         </div>
//       </Card>

//       <Button onClick={onNext} className="w-full" variant="secondary">
//         Save & Continue <ArrowRight className="w-5 h-5" />
//       </Button>
//     </motion.div>
//   );
// };

// interface Planning1ViewProps {
//   planning: PlanningData;
//   setPlanning: React.Dispatch<React.SetStateAction<PlanningData>>;
//   onNext: () => void;
//   estimatedMonths: number;
//   estimatedMonthsWithArrears: number;
//   arrears: number;
//   key?: string;
// }

// const Planning1View = ({ planning, setPlanning, onNext, estimatedMonths, estimatedMonthsWithArrears, arrears }: Planning1ViewProps) => {
//   const [showRevisionPrompt, setShowRevisionPrompt] = useState(false);
//   const inputRef = React.useRef<HTMLInputElement>(null);

//   const instruction = `What is your planned advance amount as a koyta for this season? Based on your past work, we approximate it will take about ${estimatedMonths} months of work to pay off an advance of ₹${planning.plannedAdvance}. Including your arrears of ₹${arrears}, it will take about ${estimatedMonthsWithArrears} months to pay off the total debt.`;

//   const handleContinue = () => {
//     if (!showRevisionPrompt && planning.plannedAdvance > 0) {
//       setShowRevisionPrompt(true);
//     } else {
//       onNext();
//     }
//   };

//   const handleYes = () => {
//     setShowRevisionPrompt(false);
//     inputRef.current?.focus();
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-md mx-auto space-y-6 p-4"
//     >
//       <div className="space-y-2">
//         <div className="flex justify-between items-start">
//           <h2 className="text-2xl font-serif italic font-bold flex items-center gap-2">
//             <Target className="w-6 h-6 text-emerald-500" /> Advance Plan 2026
//           </h2>
//           <VoiceButton text={instruction} />
//         </div>
//         <p className="text-stone-500 text-sm">What is your planned advance amount as a koyta for this season?</p>
//       </div>

//       <Banner type="planning" />

//       <Card className="space-y-6">
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-stone-700">Planned Advance Amount (₹)</label>
//           <input 
//             ref={inputRef}
//             type="number" 
//             className="w-full p-4 rounded-xl border-2 border-stone-100 focus:border-emerald-500 outline-none text-3xl font-black text-emerald-600"
//             value={planning.plannedAdvance || ''}
//             onChange={(e) => setPlanning({ ...planning, plannedAdvance: Number(e.target.value) })}
//           />
//         </div>

//         {planning.plannedAdvance > 0 && (
//           <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
//             <div className="space-y-2">
//               <p className="text-sm text-emerald-800 leading-relaxed">
//                 <span className="font-bold">Repayment Estimate:</span> It will take about <span className="font-bold text-lg">{estimatedMonths} months</span> to pay off this advance of ₹{planning.plannedAdvance}.
//               </p>
//               {arrears > 0 && (
//                 <p className="text-sm text-emerald-800 leading-relaxed border-t border-emerald-100 pt-2">
//                   <span className="font-bold">Total Debt:</span> Including ₹{arrears} arrears, it will take about <span className="font-bold text-lg">{estimatedMonthsWithArrears} months</span> to pay off the total ₹{planning.plannedAdvance + arrears}.
//                 </p>
//               )}
//             </div>
            
//             <div className="pt-2 border-t border-emerald-100">
//               <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Would you like to change this amount?</p>
//               <div className="flex gap-2">
//                 <button 
//                   onClick={handleYes}
//                   className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors"
//                 >
//                   Yes, Change
//                 </button>
//                 <button 
//                   onClick={onNext}
//                   className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors"
//                 >
//                   No, Keep It
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </Card>

//       {!showRevisionPrompt && (
//         <Button onClick={handleContinue} className="w-full" disabled={!planning.plannedAdvance}>
//           Continue <ArrowRight className="w-5 h-5" />
//         </Button>
//       )}
//     </motion.div>
//   );
// };

// interface Planning2ViewProps {
//   planning: PlanningData;
//   setPlanning: React.Dispatch<React.SetStateAction<PlanningData>>;
//   onNext: () => void;
//   priorityTotal: number;
//   key?: string;
// }

// const Planning2View = ({ planning, setPlanning, onNext, priorityTotal }: Planning2ViewProps) => {
//   const [newItem, setNewItem] = useState('');
//   const [newAmount, setNewAmount] = useState('');

//   const instruction = "Would you like to create a priority advance plan with us? You can identify your priority expenses for the year ahead and decide on a priority advance amount accordingly. If you would like, you can plan to take this amount as initial priority advance and take on additional advances only if needed later.";

//   const addPriority = () => {
//     if (newItem && newAmount && planning.priorityNeeds.length < 10) {
//       setPlanning({
//         ...planning,
//         priorityNeeds: [...planning.priorityNeeds, { item: newItem, amount: Number(newAmount) }]
//       });
//       setNewItem('');
//       setNewAmount('');
//     }
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-md mx-auto space-y-6 p-4"
//     >
//       <div className="space-y-2">
//         <div className="flex justify-between items-start">
//           <h2 className="text-2xl font-serif italic font-bold flex items-center gap-2">
//             <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Priority Plan 2026
//           </h2>
//           <VoiceButton text={instruction} />
//         </div>
//         <p className="text-stone-500">Identify your absolute priority expenditures for the year ahead.</p>
//       </div>

//       <Banner type="planning" />

//       {!planning.usePriorityPlan ? (
//         <Card className="space-y-6 text-center py-8">
//           <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Target className="w-8 h-8 text-emerald-600" />
//           </div>
//           <p className="text-stone-600 font-medium">Would you like to create a priority advance plan with us?</p>
//           <div className="flex gap-3">
//             <Button onClick={() => setPlanning({ ...planning, usePriorityPlan: true })} className="flex-1" variant="primary">Yes, Start Plan</Button>
//             <Button onClick={onNext} className="flex-1" variant="outline">No, Skip</Button>
//           </div>
//         </Card>
//       ) : (
//         <div className="space-y-6">
//           <Card className="space-y-4">
//             <h3 className="font-bold text-stone-700 uppercase text-xs tracking-widest">Priority Items (Max 10)</h3>
//             <div className="space-y-2">
//               {planning.priorityNeeds.map((need, i) => (
//                 <div key={i} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
//                   <span className="font-medium">{need.item}</span>
//                   <span className="font-bold text-emerald-600">₹{need.amount}</span>
//                 </div>
//               ))}
//             </div>

//             {planning.priorityNeeds.length < 10 && (
//               <div className="space-y-2 pt-2 border-t border-stone-100">
//                 <div className="grid grid-cols-2 gap-2">
//                   <input 
//                     type="text" 
//                     placeholder="Category (e.g. Health)"
//                     className="p-3 rounded-xl border border-stone-200 text-sm"
//                     value={newItem}
//                     onChange={(e) => setNewItem(e.target.value)}
//                   />
//                   <input 
//                     type="number" 
//                     placeholder="Amount"
//                     className="p-3 rounded-xl border border-stone-200 text-sm"
//                     value={newAmount}
//                     onChange={(e) => setNewAmount(e.target.value)}
//                   />
//                 </div>
//                 <Button onClick={addPriority} variant="outline" className="w-full py-2 text-sm">
//                   <PlusCircle className="w-4 h-4" /> Add Category
//                 </Button>
//               </div>
//             )}
//           </Card>

//           <div className="p-5 bg-[#5A5A40] text-white rounded-[32px] shadow-lg space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="font-medium opacity-90">Priority Advance Amount:</span>
//               <span className="text-2xl font-black">₹{priorityTotal}</span>
//             </div>
//             <p className="text-xs leading-relaxed opacity-80">
//               If you would like, you can plan to take this amount as initial priority advance from mukaddam and take on additional advances <span className="font-bold underline">only if needed</span> later in season.
//             </p>
//           </div>

//           <Button onClick={onNext} className="w-full">
//             Finalize Priority Plan <ArrowRight className="w-5 h-5" />
//           </Button>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// const TrainingStoryView = ({ onNext }: { onNext: () => void; key?: string }) => {
//   const story = "Geeta Tai does not read and write very well, but she still knows how to make a budget. She remembers the family’s goals for the future and how much it will cost to reach them. She thinks about the family situation. She asks herself, 'What is happening in this family that will bring in money and what requires us to spend money for the next month?' She thinks about how much money is coming into the house weekly or monthly from the farm, business and other sources. Then she decides how much she would like to save this month. She thinks about how much they will need to spend during the same period. She asks a family member to write down what she thinks her income and spending will be in the next month or more. Then Geeta Tai checks to be sure she does not plan to spend more than the income she will receive. If her plan shows that she would spend more than her income, she looks which items she can reduce on. If her plan shows that there will be something left over at the end of the month, she can add it to the savings. She follows the income and spending closely over time to compare her plan with what really happens. She changes her estimates for the next month based on what she learns.";

//   const steps = [
//     "Set financial goals",
//     "Estimate amount of income",
//     "Decide how much to save",
//     "List all expenses",
//     "Ensure expenses are not more than income",
//     "Follow the budget"
//   ];

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-6 p-4">
//       <div className="flex justify-between items-start">
//         <h2 className="text-2xl font-serif italic font-bold text-emerald-700">Geeta Tai's Story</h2>
//         <VoiceButton text={story} />
//       </div>
//       <Card className="space-y-4">
//         <Banner type="training" />
//         <p className="text-stone-600 text-sm leading-relaxed italic">
//           "{story}"
//         </p>
        
//         <div className="space-y-2">
//           <p className="text-xs font-bold text-stone-500 uppercase">Steps to Make a Budget:</p>
//           {steps.map((step, i) => (
//             <div key={i} className="flex items-center gap-2 text-sm text-stone-700">
//               <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">{i+1}</div>
//               {step}
//             </div>
//           ))}
//         </div>

//         <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
//           <p className="text-xs text-emerald-800 font-medium">Geeta Tai knows how to plan for her family's future, even without reading or writing.</p>
//         </div>
//       </Card>
//       <Button onClick={onNext} className="w-full">Next: Quiz <ArrowRight className="w-5 h-5" /></Button>
//     </motion.div>
//   );
// };

// const TrainingQuizView = ({ onNext }: { onNext: () => void; key?: string }) => {
//   const [selected, setSelected] = useState<string[]>([]);
//   const [showResults, setShowResults] = useState(false);
  
//   const options = [
//     { id: 'goals', text: 'Review financial goals', correct: true },
//     { id: 'income', text: 'Estimate amount of income', correct: true },
//     { id: 'save', text: 'Decide how much to save', correct: true },
//     { id: 'spend_all', text: 'Spend all money immediately', correct: false },
//     { id: 'expenses', text: 'List all expenses', correct: true },
//     { id: 'ignore', text: 'Ignore the budget later', correct: false },
//     { id: 'balance', text: 'Ensure expenses are not more than income', correct: true },
//   ];

//   const toggle = (id: string) => {
//     if (showResults) return;
//     setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
//   };

//   const calculateScore = () => {
//     const correctOptions = options.filter(o => o.correct).map(o => o.id);
//     const selectedCorrect = selected.filter(id => correctOptions.includes(id)).length;
//     const selectedWrong = selected.filter(id => !correctOptions.includes(id)).length;
//     return Math.max(0, selectedCorrect - selectedWrong);
//   };

//   const totalCorrect = options.filter(o => o.correct).length;
//   const score = calculateScore();

//   const instruction = "What does Geeta Tai do to make a budget? Select all the correct steps she takes.";

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-6 p-4">
//       <div className="flex justify-between items-start">
//         <h2 className="text-2xl font-serif italic font-bold text-emerald-700">Budget Quiz</h2>
//         <VoiceButton text={instruction} />
//       </div>
      
//       {!showResults ? (
//         <>
//           <p className="text-stone-500 text-sm">{instruction}</p>
//           <div className="space-y-2">
//             {options.map(opt => (
//               <button
//                 key={opt.id}
//                 onClick={() => toggle(opt.id)}
//                 className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${selected.includes(opt.id) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-100 text-stone-600'}`}
//               >
//                 <span className="text-sm font-medium">{opt.text}</span>
//                 {selected.includes(opt.id) && <CheckCircle2 className="w-5 h-5" />}
//               </button>
//             ))}
//           </div>
//           <Button onClick={() => setShowResults(true)} className="w-full" disabled={selected.length === 0}>
//             Check Answers <ArrowRight className="w-5 h-5" />
//           </Button>
//         </>
//       ) : (
//         <Card className="space-y-6">
//           <div className="text-center space-y-2">
//             <div className="text-4xl font-black text-emerald-600">{score} / {totalCorrect}</div>
//             <p className="text-stone-500 font-medium">Your Score</p>
//           </div>

//           <div className="space-y-3">
//             {options.map(opt => {
//               const isSelected = selected.includes(opt.id);
//               const isCorrect = opt.correct;
              
//               let bgColor = 'bg-stone-50 border-stone-100';
//               let textColor = 'text-stone-400';
//               let icon = null;

//               if (isSelected && isCorrect) {
//                 bgColor = 'bg-emerald-50 border-emerald-200';
//                 textColor = 'text-emerald-700';
//                 icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
//               } else if (isSelected && !isCorrect) {
//                 bgColor = 'bg-rose-50 border-rose-200';
//                 textColor = 'text-rose-700';
//                 icon = <AlertTriangle className="w-5 h-5 text-rose-500" />;
//               } else if (!isSelected && isCorrect) {
//                 bgColor = 'bg-amber-50 border-amber-200';
//                 textColor = 'text-amber-700';
//                 icon = <Info className="w-5 h-5 text-amber-500" />;
//               }

//               return (
//                 <div key={opt.id} className={`p-4 rounded-xl border-2 flex items-center justify-between ${bgColor} ${textColor}`}>
//                   <span className="text-sm font-medium">{opt.text}</span>
//                   {icon}
//                 </div>
//               );
//             })}
//           </div>

//           <Button onClick={onNext} className="w-full">
//             Continue <ArrowRight className="w-5 h-5" />
//           </Button>
//         </Card>
//       )}
//     </motion.div>
//   );
// };

// const TrainingPrioritizeView = ({ onNext }: { onNext: () => void; key?: string }) => {
//   const [priorities, setPriorities] = useState<Record<string, 'must' | 'wait' | null>>({
//     'Food': null,
//     'Medicine': null,
//     'Jewelry': null,
//     'Restaurant': null,
//     'School Fees': null,
//     'Loan Payment': null,
//     'New Table': null,
//     'Roof Repair': null,
//   });
//   const [showResults, setShowResults] = useState(false);

//   const expertAdvice: Record<string, 'must' | 'wait'> = {
//     'Food': 'must',
//     'Medicine': 'must',
//     'Jewelry': 'wait',
//     'Restaurant': 'wait',
//     'School Fees': 'must',
//     'Loan Payment': 'must',
//     'New Table': 'wait',
//     'Roof Repair': 'must',
//   };

//   const instruction = "Help Geeta Tai prioritize her expenses. Which of these are 'Must Have' right now, and which can 'Wait for Later'?";

//   const allDone = Object.values(priorities).every(v => v !== null);
//   const completedCount = Object.values(priorities).filter(v => v !== null).length;

//   const calculateScore = () => {
//     let correct = 0;
//     Object.keys(priorities).forEach(item => {
//       if (priorities[item] === expertAdvice[item]) correct++;
//     });
//     return correct;
//   };

//   const score = calculateScore();

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-6 p-4">
//       <div className="flex justify-between items-start">
//         <h2 className="text-2xl font-serif italic font-bold text-amber-700">Prioritizing</h2>
//         <VoiceButton text={instruction} />
//       </div>
      
//       {!showResults ? (
//         <>
//           <div className="flex justify-between items-center bg-stone-100 p-2 rounded-xl">
//             <p className="text-[10px] font-bold text-stone-500 uppercase">Progress</p>
//             <p className="text-[10px] font-bold text-[#5A5A40]">{completedCount} / 8 Items</p>
//           </div>
//           <p className="text-stone-500 text-sm">{instruction}</p>
//           <div className="space-y-4">
//             {Object.keys(priorities).map(item => (
//               <div key={item} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-stone-100 shadow-sm">
//                 <span className="font-bold text-stone-700">{item}</span>
//                 <div className="flex gap-2">
//                   <button 
//                     onClick={() => setPriorities({...priorities, [item]: 'must'})}
//                     className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${priorities[item] === 'must' ? 'bg-[#5A5A40] text-white' : 'bg-stone-100 text-stone-400'}`}
//                   >
//                     Must Have
//                   </button>
//                   <button 
//                     onClick={() => setPriorities({...priorities, [item]: 'wait'})}
//                     className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${priorities[item] === 'wait' ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-400'}`}
//                   >
//                     Can Wait
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <Button onClick={() => setShowResults(true)} className="w-full" disabled={!allDone}>
//             Check Results <ArrowRight className="w-5 h-5" />
//           </Button>
//         </>
//       ) : (
//         <Card className="space-y-6">
//           <div className="text-center space-y-2">
//             <div className="text-4xl font-black text-amber-600">{score} / 8</div>
//             <p className="text-stone-500 font-medium">Prioritization Score</p>
//             <p className="text-xs text-stone-400 italic">Based on expert recommendations</p>
//           </div>

//           <div className="space-y-3">
//             {Object.keys(priorities).map(item => {
//               const isCorrect = priorities[item] === expertAdvice[item];
//               return (
//                 <div key={item} className={`p-3 rounded-xl border-2 flex items-center justify-between ${isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
//                   <div className="flex flex-col">
//                     <span className="text-sm font-bold">{item}</span>
//                     <span className="text-[10px] opacity-70">You said: {priorities[item] === 'must' ? 'Must' : 'Wait'}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-[10px] font-bold uppercase">Expert: {expertAdvice[item]}</span>
//                     {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
//             <h4 className="text-xs font-bold text-amber-800 mb-1">Expert Tip:</h4>
//             <p className="text-[10px] text-amber-700 leading-relaxed">
//               Experts recommend prioritizing: 1. Emergencies, 2. Debt payments, 3. Daily needs (Food), 4. Future goals.
//             </p>
//           </div>

//           <Button onClick={onNext} className="w-full">
//             Continue <ArrowRight className="w-5 h-5" />
//           </Button>
//         </Card>
//       )}
//     </motion.div>
//   );
// };

// const TrainingStoryGauriView = ({ onNext }: { onNext: () => void; key?: string }) => {
//   const story = {
//     title: "Gauri's Story",
//     text: "Gauri made a budget with her family. At the market, a friend offered her beautiful cloth. Gauri was tempted but remembered her budget had no money for it. She was glad her savings were in the bank and not easy to reach. Later, her stove broke, and she used the 'emergency fund' she had set aside to buy a new one.",
//     lesson: "Keep savings out of reach and set aside money for unexpected expenses."
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-6 p-4">
//       <div className="flex justify-between items-start">
//         <h2 className="text-2xl font-serif italic font-bold text-blue-700">Staying on Track (1/2)</h2>
//         <VoiceButton text={story.text} />
//       </div>

//       <Card className="space-y-4">
//         <Banner type="training" />
//         <h3 className="font-bold text-lg text-stone-800">{story.title}</h3>
//         <p className="text-stone-600 text-sm leading-relaxed italic">"{story.text}"</p>
//         <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
//           <p className="text-xs text-blue-800 font-bold">Key Lesson: {story.lesson}</p>
//         </div>
//       </Card>

//       <Button onClick={onNext} className="w-full">
//         Next: Jagdish's Story <ArrowRight className="w-5 h-5" />
//       </Button>
//     </motion.div>
//   );
// };

// const TrainingStoryJagdishView = ({ onNext }: { onNext: () => void; key?: string }) => {
//   const story = {
//     title: "Jagdish's Story",
//     text: "During the festival season, Jagdish planned for extra expenses. He tracked his spending weekly. When he realized he spent too much on gifts, he looked at his budget and decided to spend less on a new shirt he wanted, to make up for the overspending.",
//     lesson: "Track spending regularly. If you overspend on one thing, spend less on another."
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-6 p-4">
//       <div className="flex justify-between items-start">
//         <h2 className="text-2xl font-serif italic font-bold text-blue-700">Staying on Track (2/2)</h2>
//         <VoiceButton text={story.text} />
//       </div>

//       <Card className="space-y-4">
//         <Banner type="training" />
//         <h3 className="font-bold text-lg text-stone-800">{story.title}</h3>
//         <p className="text-stone-600 text-sm leading-relaxed italic">"{story.text}"</p>
//         <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
//           <p className="text-xs text-blue-800 font-bold">Key Lesson: {story.lesson}</p>
//         </div>
//       </Card>

//       <Button onClick={onNext} className="w-full">
//         Next: Prioritizing <ArrowRight className="w-5 h-5" />
//       </Button>
//     </motion.div>
//   );
// };

// const TransitionView = ({ onNext }: { onNext: () => void; key?: string }) => {
//   const text = "Now that you have planned your advance for the season, learned a little about budgeting and prioritizing, let's move to the tracking stage to track your advances from the mukaddam for the season.";
  
//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-8 p-8 text-center">
//       <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
//         <TrendingUp className="w-12 h-12 text-emerald-600" />
//       </div>
//       <Banner type="transition" />
//       <h2 className="text-3xl font-serif italic font-bold text-stone-800">Ready to Track!</h2>
//       <p className="text-stone-600 leading-relaxed">{text}</p>
//       <div className="flex justify-center">
//         <VoiceButton text={text} />
//       </div>
//       <Button onClick={onNext} className="w-full mt-8">Go to Ledger <ArrowRight className="w-5 h-5" /></Button>
//     </motion.div>
//   );
// };

// interface DashboardViewProps {
//   profile: Profile;
//   totalUsed: number;
//   limit: number;
//   usagePercent: number;
//   installments: Installment[];
//   setStep: React.Dispatch<React.SetStateAction<Step>>;
//   usePriorityPlan: boolean;
//   key?: string;
// }

// const DashboardView = ({ profile, totalUsed, limit, usagePercent, installments, setStep, usePriorityPlan }: DashboardViewProps) => {
//   const intro = "Hello, now that you have planned the advance amount for the season, you will now log in every advance installment you take for this season in this ledger and note down the broad purpose, so that you can keep track of your debt from the mukaddam. We will also show you how much your total debt so far tracks against your planned advance at start of season.";

//   const handleDownloadPDF = async () => {
//     const element = document.getElementById('pdf-content');
//     if (!element) return;
    
//     // Temporarily show the hidden content for capture
//     element.style.display = 'block';
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       logging: false,
//       backgroundColor: '#f5f5f0'
//     });
//     element.style.display = 'none';
    
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
//     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`Koyta-Sathi-Report-${profile.name || 'User'}.pdf`);
//   };

//   return (
//     <div className="max-w-md mx-auto space-y-6 p-4 pb-24">
//       <header className="flex justify-between items-center">
//         <div>
//           <h1 className="text-xl font-serif italic font-bold">Hello, {profile.name}</h1>
//           <p className="text-sm text-stone-500">{profile.location}</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button 
//             onClick={handleDownloadPDF}
//             className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors shadow-sm"
//             title="Download Report PDF"
//           >
//             <Download className="w-5 h-5" />
//           </button>
//           <VoiceButton text={intro} />
//           <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
//             <User className="w-6 h-6 text-stone-600" />
//           </div>
//         </div>
//       </header>

//       <div className="p-4 bg-emerald-50 rounded-[32px] border border-emerald-100">
//         <p className="text-xs text-emerald-800 leading-relaxed">
//           {intro}
//         </p>
//       </div>

//       {/* Progress Card */}
//       <Card className="relative overflow-hidden border-t-4 border-t-[#5A5A40]">
//         <div className="relative z-10 space-y-4">
//           <div className="flex justify-between items-end">
//             <div>
//               <p className="text-sm text-stone-500 font-medium">Total Debt So Far</p>
//               <h2 className="text-3xl font-black text-stone-900">₹{totalUsed}</h2>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-stone-400">{usePriorityPlan ? 'Priority Goal' : 'Planned Limit'}: ₹{limit}</p>
//               <p className={`text-sm font-bold ${usagePercent > 90 ? 'text-rose-500' : 'text-emerald-500'}`}>
//                 {Math.round(usagePercent)}%
//               </p>
//             </div>
//           </div>
//           <ProgressBar current={totalUsed} total={limit} />
          
//           {usagePercent > 90 && (
//             <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 rounded-xl text-sm font-medium animate-pulse">
//               <AlertTriangle className="w-4 h-4" />
//               Warning! You are near your {usePriorityPlan ? 'priority' : 'planned'} limit.
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 gap-4">
//         <Card className="p-4 flex flex-col items-center text-center gap-2">
//           <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
//             <PieChart className="w-5 h-5 text-blue-600" />
//           </div>
//           <p className="text-xs text-stone-500">{usePriorityPlan ? 'Priority Goal' : 'Planned'}</p>
//           <p className="font-bold">₹{limit}</p>
//         </Card>
//         <Card className="p-4 flex flex-col items-center text-center gap-2">
//           <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
//             <Wallet className="w-5 h-5 text-amber-600" />
//           </div>
//           <p className="text-xs text-stone-500">Remaining</p>
//           <p className="font-bold">₹{Math.max(0, limit - totalUsed)}</p>
//         </Card>
//       </div>

//       {/* Recent Ledger */}
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <h3 className="font-bold text-stone-800 font-serif italic text-lg">Advance Ledger</h3>
//           <button onClick={() => setStep('add-installment')} className="text-[#5A5A40] text-sm font-bold flex items-center gap-1">
//             <PlusCircle className="w-4 h-4" /> Add New
//           </button>
//         </div>
        
//         {installments.length === 0 ? (
//           <div className="text-center py-12 bg-stone-50 rounded-[32px] border-2 border-dashed border-stone-200">
//             <PlusCircle className="w-12 h-12 text-stone-300 mx-auto mb-2" />
//             <p className="text-stone-400 font-medium">No installments logged yet</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {installments.map((inst) => (
//               <div key={inst.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
//                     <Wallet className="w-5 h-5 text-emerald-600" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-stone-800">{inst.purpose}</p>
//                     <p className="text-xs text-stone-400">{inst.date}</p>
//                   </div>
//                 </div>
//                 <p className="font-black text-stone-900">₹{inst.amount}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Hidden PDF Content */}
//       <div id="pdf-content" style={{ display: 'none', width: '800px', padding: '40px', background: '#f5f5f0' }} className="font-sans">
//         <div className="space-y-8">
//           <div className="border-b-4 border-stone-900 pb-4">
//             <h1 className="text-4xl font-serif italic font-black">Koyta-Sathi Report</h1>
//             <p className="text-stone-500 font-bold uppercase tracking-widest">Financial Planning & Tracking</p>
//           </div>

//           <div className="grid grid-cols-2 gap-8">
//             <div className="space-y-2">
//               <p className="text-xs font-bold text-stone-400 uppercase">User Profile</p>
//               <p className="text-xl font-bold">{profile.name || 'Not specified'}</p>
//               <p className="text-stone-600">{profile.location || 'No location'}</p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-xs font-bold text-stone-400 uppercase">Report Date</p>
//               <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <h2 className="text-2xl font-serif italic font-bold border-b border-stone-200 pb-2">Season Summary</h2>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
//                 <p className="text-[10px] font-bold text-stone-400 uppercase">Total Advance</p>
//                 <p className="text-xl font-black">₹{limit}</p>
//               </div>
//               <div className="p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
//                 <p className="text-[10px] font-bold text-stone-400 uppercase">Amount Used</p>
//                 <p className="text-xl font-black">₹{totalUsed}</p>
//               </div>
//               <div className="p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
//                 <p className="text-[10px] font-bold text-stone-400 uppercase">Remaining</p>
//                 <p className="text-xl font-black">₹{limit - totalUsed}</p>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <h2 className="text-2xl font-serif italic font-bold border-b border-stone-200 pb-2">Installment History</h2>
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="text-xs font-bold text-stone-400 uppercase border-b border-stone-100">
//                   <th className="py-2">Date</th>
//                   <th className="py-2">Purpose</th>
//                   <th className="py-2 text-right">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {installments.map(inst => (
//                   <tr key={inst.id} className="border-b border-stone-50">
//                     <td className="py-3 text-sm">{inst.date}</td>
//                     <td className="py-3 text-sm font-bold">{inst.purpose}</td>
//                     <td className="py-3 text-sm font-black text-right">₹{inst.amount}</td>
//                   </tr>
//                 ))}
//                 {installments.length === 0 && (
//                   <tr>
//                     <td colSpan={3} className="py-8 text-center text-stone-400 italic">No installments logged yet.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100">
//             <p className="text-xs text-emerald-800 font-bold uppercase mb-2">Planning Insight</p>
//             <p className="text-emerald-900 text-sm italic">
//               "This report reflects the user's commitment to tracking their seasonal advance and planning for their family's future. Regular tracking helps in staying within the budget and avoiding unexpected debt."
//             </p>
//           </div>
//         </div>
//       </div>
//       <nav className="fixed bottom-6 left-4 right-4 bg-stone-900 text-white rounded-full p-4 flex justify-around items-center shadow-xl z-50">
//         <button className="flex flex-col items-center gap-1 text-emerald-400">
//           <Home className="w-6 h-6" />
//           <span className="text-[10px] font-bold uppercase">Home</span>
//         </button>
//         <button 
//           disabled={true}
//           className="flex flex-col items-center gap-1 text-stone-600 opacity-50 cursor-not-allowed"
//         >
//           <Target className="w-6 h-6" />
//           <span className="text-[10px] font-bold uppercase">Plan (Locked)</span>
//         </button>
//         <button 
//           disabled={true}
//           className="flex flex-col items-center gap-1 text-stone-600 opacity-50 cursor-not-allowed"
//         >
//           <History className="w-6 h-6" />
//           <span className="text-[10px] font-bold uppercase">Past (Locked)</span>
//         </button>
//       </nav>
//     </div>
//   );
// };

// interface AddInstallmentViewProps {
//   setInstallments: React.Dispatch<React.SetStateAction<Installment[]>>;
//   setStep: React.Dispatch<React.SetStateAction<Step>>;
//   installments: Installment[];
//   key?: string;
// }

// const AddInstallmentView = ({ setInstallments, setStep, installments }: AddInstallmentViewProps) => {
//   const [amount, setAmount] = useState('');
//   const [purpose, setPurpose] = useState('');

//   const save = () => {
//     if (amount && purpose) {
//       setInstallments([
//         {
//           id: Date.now().toString(),
//           amount: Number(amount),
//           purpose,
//           date: new Date().toLocaleDateString()
//         },
//         ...installments
//       ]);
//       setStep('dashboard');
//     }
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-md mx-auto space-y-6 p-4"
//     >
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-serif italic font-bold">New Installment</h2>
//         <button onClick={() => setStep('dashboard')} className="text-stone-400 font-bold">Cancel</button>
//       </div>

//       <Card className="space-y-6">
//         <div className="space-y-2 text-center">
//           <label className="text-sm font-medium text-stone-500 uppercase tracking-widest">Amount (₹)</label>
//           <input 
//             type="number" 
//             autoFocus
//             className="w-full text-5xl font-black text-center outline-none text-[#5A5A40]"
//             placeholder="0"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//         </div>

//         <div className="space-y-3">
//           <label className="text-sm font-medium text-stone-700">What is this for?</label>
//           <div className="grid grid-cols-2 gap-2">
//             {['Food', 'Seeds', 'Health', 'Travel', 'Debt', 'Other'].map(p => (
//               <button 
//                 key={p}
//                 onClick={() => setPurpose(p)}
//                 className={`p-3 rounded-xl border-2 transition-all font-medium ${purpose === p ? 'border-[#5A5A40] bg-stone-50 text-[#5A5A40]' : 'border-stone-100 text-stone-500'}`}
//               >
//                 {p}
//               </button>
//             ))}
//           </div>
//           <input 
//             type="text" 
//             placeholder="Or type purpose..."
//             className="w-full p-4 rounded-xl border-2 border-stone-100"
//             value={purpose}
//             onChange={(e) => setPurpose(e.target.value)}
//           />
//         </div>
//       </Card>

//       <Button onClick={save} className="w-full" disabled={!amount || !purpose}>
//         Log Installment <CheckCircle2 className="w-5 h-5" />
//       </Button>
//     </motion.div>
//   );
// };

// export default function App() {
//   const [step, setStep] = useState<Step>('disclaimer');
//   const [history, setHistory] = useState<Step[]>([]);
//   const [profile, setProfile] = useState<Profile>({ name: '', location: '' });
//   const [recall2024, setRecall2024] = useState<YearRecall>({ pendingStart: 0, advanceTaken: 0, monthsWorked: 0, arrearsRemaining: 0 });
//   const [recall2025, setRecall2025] = useState<YearRecall>({ pendingStart: 0, advanceTaken: 0, monthsWorked: 0, arrearsRemaining: 0 });
//   const [planning, setPlanning] = useState<PlanningData>({ plannedAdvance: 0, usePriorityPlan: false, priorityNeeds: [] });
//   const [installments, setInstallments] = useState<Installment[]>([]);
//   const [hasCompletedPast, setHasCompletedPast] = useState(false);
//   const [hasCompletedPlan, setHasCompletedPlan] = useState(false);

//   // Derived stats
//   const totalUsed = installments.reduce((sum, inst) => sum + inst.amount, 0);
//   const priorityTotal = planning.priorityNeeds.reduce((sum, need) => sum + need.amount, 0);
  
//   // Calculate average months to pay off based on past data
//   const avgAdvancePerMonth = ((recall2024.advanceTaken / (recall2024.monthsWorked || 1)) + (recall2025.advanceTaken / (recall2025.monthsWorked || 1))) / 2;
//   const estimatedMonths = planning.plannedAdvance > 0 ? Math.ceil(planning.plannedAdvance / (avgAdvancePerMonth || 10000)) : 0;
//   const arrears = recall2025.arrearsRemaining;
//   const totalDebt = planning.plannedAdvance + arrears;
//   const estimatedMonthsWithArrears = totalDebt > 0 ? Math.ceil(totalDebt / (avgAdvancePerMonth || 10000)) : 0;

//   const limit = planning.usePriorityPlan ? priorityTotal : (planning.plannedAdvance || 10000);
//   const usagePercent = (totalUsed / (limit || 1)) * 100;

//   const navigateTo = (next: Step) => {
//     setHistory(prev => [...prev, step]);
//     setStep(next);
//   };

//   const goBack = () => {
//     if (history.length > 0) {
//       const prev = history[history.length - 1];
//       setHistory(prevHistory => prevHistory.slice(0, -1));
//       setStep(prev);
//     }
//   };

//   const nextStep = () => {
//     if (step === 'disclaimer') navigateTo('profile');
//     else if (step === 'profile') navigateTo('training-story');
//     else if (step === 'training-story') navigateTo('training-quiz');
//     else if (step === 'training-quiz') navigateTo('training-staying-gauri');
//     else if (step === 'training-staying-gauri') navigateTo('training-staying-jagdish');
//     else if (step === 'training-staying-jagdish') navigateTo('training-prioritize');
//     else if (step === 'training-prioritize') navigateTo('recall-2024');
//     else if (step === 'recall-2024') navigateTo('recall-2025');
//     else if (step === 'recall-2025') {
//       setHasCompletedPast(true);
//       navigateTo('planning-1');
//     }
//     else if (step === 'planning-1') navigateTo('planning-2');
//     else if (step === 'planning-2') {
//       setHasCompletedPlan(true);
//       navigateTo('transition');
//     }
//     else if (step === 'transition') navigateTo('dashboard');
//     else if (step === 'dashboard') navigateTo('add-installment');
//   };

//   const viewTitles: Record<Step, string> = {
//     'disclaimer': 'Welcome',
//     'profile': 'Your Profile',
//     'recall-2024': 'Past Season 2024',
//     'recall-2025': 'Past Season 2025',
//     'planning-1': 'Advance Plan',
//     'planning-2': 'Priority Plan',
//     'training-story': 'Budgeting 101',
//     'training-quiz': 'Budgeting Quiz',
//     'training-staying-gauri': 'Gauri\'s Story',
//     'training-staying-jagdish': 'Jagdish\'s Story',
//     'training-prioritize': 'Prioritizing',
//     'transition': 'Ready to Track',
//     'dashboard': 'My Ledger',
//     'add-installment': 'New Entry'
//   };

//   return (
//     <div className="min-h-screen bg-[#f5f5f0] text-stone-900 font-sans selection:bg-emerald-100 pb-12">
//       <Header onBack={history.length > 0 ? goBack : undefined} title={viewTitles[step]} />
      
//       <AnimatePresence mode="wait">
//         {step === 'disclaimer' && <DisclaimerView key="disclaimer" onNext={nextStep} />}
//         {step === 'profile' && <ProfileView key="profile" profile={profile} setProfile={setProfile} onNext={nextStep} />}
//         {step === 'recall-2024' && <RecallView key="recall-2024" year="2024-2025" recall={recall2024} setRecall={setRecall2024} onNext={nextStep} />}
//         {step === 'recall-2025' && <RecallView key="recall-2025" year="2025-2026" recall={recall2025} setRecall={setRecall2025} onNext={nextStep} />}
//         {step === 'planning-1' && <Planning1View key="plan-1" planning={planning} setPlanning={setPlanning} onNext={nextStep} estimatedMonths={estimatedMonths} estimatedMonthsWithArrears={estimatedMonthsWithArrears} arrears={arrears} />}
//         {step === 'planning-2' && <Planning2View key="plan-2" planning={planning} setPlanning={setPlanning} onNext={nextStep} priorityTotal={priorityTotal} />}
//         {step === 'training-story' && <TrainingStoryView key="story" onNext={nextStep} />}
//         {step === 'training-quiz' && <TrainingQuizView key="quiz" onNext={nextStep} />}
//         {step === 'training-staying-gauri' && <TrainingStoryGauriView key="gauri" onNext={nextStep} />}
//         {step === 'training-staying-jagdish' && <TrainingStoryJagdishView key="jagdish" onNext={nextStep} />}
//         {step === 'training-prioritize' && <TrainingPrioritizeView key="prioritize" onNext={nextStep} />}
//         {step === 'transition' && <TransitionView key="transition" onNext={nextStep} />}
//         {step === 'dashboard' && <DashboardView key="dashboard" profile={profile} totalUsed={totalUsed} limit={limit} usagePercent={usagePercent} installments={installments} setStep={navigateTo} usePriorityPlan={planning.usePriorityPlan} />}
//         {step === 'add-installment' && <AddInstallmentView key="add" setInstallments={setInstallments} setStep={navigateTo} installments={installments} />}
//       </AnimatePresence>
//     </div>
//   );
// }



import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App