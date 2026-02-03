'use client';

import React, { useCallback, useState } from 'react';
import { Upload, FileText, Scan, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone'; // Assuming usage, but will implement without external dep if needed to keep it simple or use standar inputs
// Actually, standard input is safer if I don't want to install more deps, but standard drag and drop is fine.
// I'll implement a custom drop zone to avoid 'react-dropzone' dependency if not already installed, 
// checking package.json first might be good, but standard HTML5 DnD is easy.
// Package.json showed no react-dropzone. I'll stick to standard HTML5 DnD.

interface AiExpenseDropzoneProps {
    onFilesSelected: (files: File[]) => void;
    isScanning?: boolean;
}

export function AiExpenseDropzone({ onFilesSelected, isScanning }: AiExpenseDropzoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [scannedFiles, setScannedFiles] = useState<string[]>([]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            processFiles(files);
        }
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            processFiles(files);
        }
    }, []);

    const processFiles = (files: File[]) => {
        setScannedFiles(files.map(f => f.name));
        onFilesSelected(files);
        // We'll keep the scannedFiles state for the overlay while the parent is scanning
    };

    // Clear scanned files when parent finishes scanning
    React.useEffect(() => {
        if (!isScanning) {
            setScannedFiles([]);
        }
    }, [isScanning]);

    return (
        <div className="w-full">
            <div
                className={cn(
                    "relative w-full h-64 rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden group cursor-pointer",
                    isDragActive
                        ? "border-green-500 bg-green-500/10 scale-[1.01]"
                        : "border-white/10 hover:border-green-500/30 hover:bg-black/40 bg-black/20"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('expense-upload')?.click()}
            >
                <input
                    type="file"
                    id="expense-upload"
                    className="hidden"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileInput}
                />

                {/* Scanning Effect Overlay */}
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
                        >
                            <div className="relative w-full max-w-md h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-green-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />
                            </div>

                            {/* Scanning Laser Line */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-[2px] bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] z-30"
                                initial={{ top: "0%" }}
                                animate={{ top: "100%" }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                            />

                            <p className="text-green-400 font-mono text-sm animate-pulse flex items-center gap-2">
                                <Scan className="w-4 h-4" />
                                ANALYZING RECEIPTS WITH AI...
                            </p>
                            <div className="mt-2 text-xs text-gray-400 flex flex-col items-center">
                                {scannedFiles.map((f, i) => (
                                    <span key={i} className="flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> {f}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Default Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
                        isDragActive ? "bg-green-500 text-white shadow-xl shadow-green-500/20" : "bg-white/5 text-gray-400 group-hover:text-green-400 group-hover:bg-green-500/10"
                    )}>
                        <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Upload Receipts</h3>
                    <p className="text-sm text-gray-400 max-w-xs text-center">
                        Drag & drop or click to upload.
                        <br />
                        <span className="text-green-500/80">AI will automatically extract details & categorize.</span>
                    </p>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/10 group-hover:border-green-500/50 transition-colors rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/10 group-hover:border-green-500/50 transition-colors rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/10 group-hover:border-green-500/50 transition-colors rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/10 group-hover:border-green-500/50 transition-colors rounded-br-lg" />
            </div>
        </div>
    );
}
