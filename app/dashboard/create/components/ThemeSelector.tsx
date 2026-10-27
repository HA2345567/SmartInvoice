'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';

interface ThemeSelectorProps {
    invoiceData: any;
    setInvoiceData: (data: any) => void;
    themeSchemes: any;
}

export const ThemeSelector = React.memo(({ invoiceData, setInvoiceData, themeSchemes }: ThemeSelectorProps) => {
    const themes = (['ultra-luxury', 'microsoft', 'amazon', 'financial', 'creative-agency', 'professional-services'] as const);

    const updateTheme = (theme: string) => {
        setInvoiceData((prev: any) => ({
            ...prev,
            theme,
            customColors: themeSchemes[theme]
        }));
    };

    const updateColor = (key: string, value: string) => {
        setInvoiceData((prev: any) => ({
            ...prev,
            customColors: { ...prev.customColors, [key]: value }
        }));
    };

    return (
        <Card className="card-green-mist animate-slide-in">
            <CardHeader>
                <CardTitle className="text-white flex items-center text-lg">
                    <Sparkles className="w-5 h-5 mr-2 text-green-primary" />
                    Theme & Colors
                </CardTitle>
                <CardDescription className="text-green-muted text-xs">Customize the visual appearance of your invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {themes.map((theme) => (
                        <div
                            key={theme}
                            className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:scale-[1.02] ${invoiceData.theme === theme
                                ? 'border-green-primary bg-green-primary/10'
                                : 'border-gray-700 hover:border-green-primary/50'
                                }`}
                            onClick={() => updateTheme(theme)}
                        >
                            <div className="space-y-2">
                                <div className="flex space-x-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeSchemes[theme].primary }} />
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeSchemes[theme].secondary }} />
                                </div>
                                <span className="text-[10px] font-medium text-white capitalize block truncate">
                                    {theme.replace('-', ' ')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(invoiceData.customColors).map(([key, value]: [string, any]) => (
                        <div key={key} className="space-y-1.5">
                            <Label className="text-white text-xs capitalize">{key}</Label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={value}
                                    onChange={(e) => updateColor(key, e.target.value)}
                                    className="w-8 h-8 rounded border border-gray-600 bg-transparent cursor-pointer"
                                />
                                <Input
                                    value={value}
                                    onChange={(e) => updateColor(key, e.target.value)}
                                    className="input-green text-[10px] h-8"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
});

ThemeSelector.displayName = 'ThemeSelector';
