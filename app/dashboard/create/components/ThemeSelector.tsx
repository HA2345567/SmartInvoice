'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Sparkles, Crown, Check, Palette, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface ThemeSelectorProps {
    invoiceData: any;
    setInvoiceData: (data: any) => void;
    themeSchemes: any;
}

interface ThemeMeta {
    id: string;
    name: string;
    tagline: string;
    category: string;
    primary: string;
    secondary: string;
    accent: string;
    headerStyle: string;
    accentGradient?: string;
    googleDots?: string[];
    badgeText: string;
}

const THEME_PREVIEWS: Record<string, ThemeMeta> = {
    luxury: {
        id: 'luxury',
        name: 'Luxury Editorial',
        tagline: 'Bespoke Haute',
        category: 'Haute Facturation',
        primary: '#111111',
        secondary: '#777777',
        accent: '#B89B5E',
        headerStyle: 'bg-zinc-900 border-b border-[#B89B5E]/60',
        accentGradient: 'from-amber-950/30 via-zinc-900 to-black',
        badgeText: 'Haute',
    },
    apple: {
        id: 'apple',
        name: 'Apple',
        tagline: 'Cupertino Executive',
        category: 'Ultra-Luxury',
        primary: '#1D1D1F',
        secondary: '#86868B',
        accent: '#0071E3',
        headerStyle: 'bg-zinc-800/80 border-b border-zinc-700/60',
        accentGradient: 'from-zinc-900 to-zinc-800',
        badgeText: 'Signature',
    },
    minimal: {
        id: 'minimal',
        name: 'Minimal',
        tagline: 'Swiss Editorial',
        category: 'Timeless Monolith',
        primary: '#09090B',
        secondary: '#52525B',
        accent: '#A1A1AA',
        headerStyle: 'bg-black border-b border-zinc-800',
        accentGradient: 'from-zinc-950 to-black',
        badgeText: 'Modernist',
    },
    stripe: {
        id: 'stripe',
        name: 'Stripe',
        tagline: 'Fintech Prestige',
        category: 'SaaS Leader',
        primary: '#635BFF',
        secondary: '#0A2540',
        accent: '#00D4B2',
        headerStyle: 'bg-gradient-to-r from-[#635BFF] via-[#736BFF] to-[#00D4B2]',
        accentGradient: 'from-indigo-950/50 via-zinc-900 to-zinc-950',
        badgeText: 'Fintech',
    },
    google: {
        id: 'google',
        name: 'Google',
        tagline: 'Material Horizon',
        category: 'Enterprise Tech',
        primary: '#1A73E8',
        secondary: '#5F6368',
        accent: '#34A853',
        headerStyle: 'bg-[#1A73E8]',
        accentGradient: 'from-blue-950/40 via-zinc-900 to-zinc-950',
        googleDots: ['#1A73E8', '#EA4335', '#FBBC05', '#34A853'],
        badgeText: 'Material',
    },
    shopify: {
        id: 'shopify',
        name: 'Shopify',
        tagline: 'Boutique Emerald',
        category: 'Prestige Retail',
        primary: '#008060',
        secondary: '#2C3E50',
        accent: '#5C6AC4',
        headerStyle: 'bg-gradient-to-r from-[#008060] to-[#059669]',
        accentGradient: 'from-emerald-950/40 via-zinc-900 to-zinc-950',
        badgeText: 'Commerce',
    },
    amazon: {
        id: 'amazon',
        name: 'Amazon',
        tagline: 'Obsidian & Gold',
        category: 'Cloud Global',
        primary: '#FF9900',
        secondary: '#232F3E',
        accent: '#146EB4',
        headerStyle: 'bg-[#232F3E] border-b-2 border-[#FF9900]',
        accentGradient: 'from-amber-950/30 via-zinc-900 to-zinc-950',
        badgeText: 'Obsidian',
    },
    microsoft: {
        id: 'microsoft',
        name: 'Microsoft',
        tagline: 'Fluent Corporate',
        category: 'Fortune 500',
        primary: '#0078D4',
        secondary: '#505050',
        accent: '#107C41',
        headerStyle: 'bg-[#0078D4]',
        accentGradient: 'from-sky-950/40 via-zinc-900 to-zinc-950',
        badgeText: 'Corporate',
    },
    custom: {
        id: 'custom',
        name: 'Custom',
        tagline: 'Bespoke Atelier',
        category: 'Full Creative',
        primary: '#8B5CF6',
        secondary: '#EC4899',
        accent: '#06B6D4',
        headerStyle: 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400',
        accentGradient: 'from-purple-950/40 via-zinc-900 to-zinc-950',
        badgeText: 'Atelier',
    },
};

export const ThemeSelector = React.memo(({ invoiceData, setInvoiceData, themeSchemes }: ThemeSelectorProps) => {
    const [showPaletteStudio, setShowPaletteStudio] = useState(false);

    const themes = ([
        'luxury',
        'apple',
        'stripe',
        'minimal',
        'shopify',
        'amazon',
        'google',
        'microsoft',
        'custom'
    ] as const);

    const updateTheme = (theme: string) => {
        const colors = themeSchemes[theme] || invoiceData.customColors;
        setInvoiceData((prev: any) => ({
            ...prev,
            theme,
            customColors: colors
        }));
    };

    const updateColor = (key: string, value: string) => {
        setInvoiceData((prev: any) => ({
            ...prev,
            customColors: { ...prev.customColors, [key]: value }
        }));
    };

    const resetToThemeDefaults = () => {
        const currentTheme = invoiceData.theme || 'apple';
        if (themeSchemes[currentTheme]) {
            setInvoiceData((prev: any) => ({
                ...prev,
                customColors: { ...themeSchemes[currentTheme] }
            }));
        }
    };

    const colorLabels: Record<string, { label: string; role: string }> = {
        primary: { label: 'Primary Brand', role: 'Headers, logo & main titles' },
        secondary: { label: 'Secondary Tone', role: 'Labels, metadata & accents' },
        accent: { label: 'Highlight Accent', role: 'Totals, links & callouts' },
        background: { label: 'Canvas Paper', role: 'Invoice surface tint' },
    };

    return (
        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818] overflow-hidden">
            <CardHeader className="p-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <CardTitle className="text-lg font-normal tracking-tight text-white flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span>Design Themes</span>
                            <span className="ml-2 text-[10px] uppercase font-mono tracking-wider text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                                9 Palettes
                            </span>
                        </CardTitle>
                        <CardDescription className="text-xs text-white/40 mt-0.5">
                            Select an executive layout & typography theme to style your invoice
                        </CardDescription>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowPaletteStudio(prev => !prev)}
                        className="inline-flex items-center self-start sm:self-auto gap-1.5 px-3 py-1.5 text-xs font-normal rounded-full bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white border border-white/10 transition-colors"
                    >
                        <Palette className="w-3.5 h-3.5 text-white/50" />
                        <span>Palette Studio</span>
                        {showPaletteStudio ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-0">
                {/* 8 Bespoke Luxury Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {themes.map((theme) => {
                        const meta = THEME_PREVIEWS[theme] || {
                            id: theme,
                            name: theme,
                            tagline: 'Executive Style',
                            category: 'Bespoke',
                            primary: themeSchemes[theme]?.primary || '#4F46E5',
                            secondary: themeSchemes[theme]?.secondary || '#06B6D4',
                            accent: '#10B981',
                            headerStyle: 'bg-zinc-800',
                            badgeText: 'Custom',
                        };

                        const isSelected = invoiceData.theme === theme;
                        const dynamicPrimary = themeSchemes[theme]?.primary || meta.primary;
                        const dynamicSecondary = themeSchemes[theme]?.secondary || meta.secondary;
                        const dynamicAccent = themeSchemes[theme]?.accent || meta.accent;

                        return (
                            <div
                                key={theme}
                                role="button"
                                tabIndex={0}
                                aria-label={`Select ${meta.name} theme`}
                                onClick={() => updateTheme(theme)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        updateTheme(theme);
                                    }
                                }}
                                className={`group relative cursor-pointer rounded-xl border transition-all duration-300 overflow-hidden flex flex-col p-3 select-none ${isSelected
                                    ? 'border-emerald-400/90 bg-gradient-to-b from-emerald-500/15 via-zinc-900/95 to-zinc-950 shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-400/50 -translate-y-0.5'
                                    : 'border-zinc-800/90 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 hover:border-zinc-600/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40'
                                    }`}
                            >
                                {/* Active Floating Status Pill */}
                                {isSelected && (
                                    <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-emerald-500 text-black text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md shadow-emerald-500/30 animate-in fade-in zoom-in-90 duration-200">
                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        <span>Active</span>
                                    </div>
                                )}

                                {/* Category Chip (when not selected) */}
                                {!isSelected && (
                                    <span className="absolute top-2.5 right-2.5 z-10 text-[9px] font-semibold text-zinc-400 bg-zinc-800/80 border border-zinc-700/50 px-2 py-0.5 rounded-full">
                                        {meta.badgeText}
                                    </span>
                                )}

                                {/* Luxury Mini Invoice Canvas Preview */}
                                <div className="relative w-full h-[72px] rounded-lg bg-zinc-950/90 border border-zinc-800/80 p-2 overflow-hidden shadow-inner flex flex-col justify-between mb-3 transition-colors group-hover:border-zinc-700/90">
                                    {/* Top Header Strip matching Brand */}
                                    <div className={`-mx-2 -mt-2 h-2 ${meta.headerStyle}`} />

                                    {/* Top Row: Logo & Invoice Title Skeleton */}
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className="w-3 h-3 rounded-[3px] flex items-center justify-center text-[6px] font-bold text-white shadow-sm"
                                                style={{ backgroundColor: dynamicPrimary }}
                                            >
                                                INV
                                            </div>
                                            <div className="w-10 h-1.5 rounded-full bg-zinc-700/60" />
                                        </div>

                                        {/* Google 4-dots or brand badge */}
                                        {meta.googleDots ? (
                                            <div className="flex items-center space-x-0.5">
                                                {meta.googleDots.map((dotColor, i) => (
                                                    <span
                                                        key={i}
                                                        className="w-1.5 h-1.5 rounded-full"
                                                        style={{ backgroundColor: dotColor }}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div
                                                className="px-1.5 py-0.2 rounded text-[7px] font-mono font-bold"
                                                style={{
                                                    backgroundColor: `${dynamicPrimary}25`,
                                                    color: dynamicAccent || dynamicPrimary
                                                }}
                                            >
                                                #1042
                                            </div>
                                        )}
                                    </div>

                                    {/* Middle Mock Line Items */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="w-14 h-1.5 rounded-full bg-zinc-700/50" />
                                            <div className="w-6 h-1.5 rounded-full bg-zinc-600/40" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="w-10 h-1 rounded-full bg-zinc-800/70" />
                                            <div className="w-5 h-1 rounded-full bg-zinc-800/70" />
                                        </div>
                                    </div>

                                    {/* Bottom Total Mock Line */}
                                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                                        <div className="w-8 h-1 rounded-full bg-zinc-600/40" />
                                        <div
                                            className="w-8 h-1.5 rounded-full shadow-sm"
                                            style={{ backgroundColor: dynamicAccent || dynamicPrimary }}
                                        />
                                    </div>
                                </div>

                                {/* Typography & Swatch Footer */}
                                <div className="flex items-end justify-between mt-auto">
                                    <div className="space-y-0.5 pr-2 min-w-0">
                                        <h4 className="text-xs font-bold text-white tracking-wide truncate">
                                            {meta.name}
                                        </h4>
                                        <p className="text-[10px] text-zinc-400 font-medium truncate">
                                            {meta.tagline}
                                        </p>
                                    </div>

                                    {/* Polished Jewel Color Swatches */}
                                    <div className="flex -space-x-1 items-center bg-zinc-950/80 px-1.5 py-1 rounded-full border border-zinc-800 shadow-sm flex-shrink-0">
                                        <div
                                            className="w-3 h-3 rounded-full ring-1 ring-black/60 shadow-sm transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: dynamicPrimary }}
                                            title={`Primary: ${dynamicPrimary}`}
                                        />
                                        <div
                                            className="w-3 h-3 rounded-full ring-1 ring-black/60 shadow-sm transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: dynamicSecondary }}
                                            title={`Secondary: ${dynamicSecondary}`}
                                        />
                                        {dynamicAccent && (
                                            <div
                                                className="w-3 h-3 rounded-full ring-1 ring-black/60 shadow-sm transition-transform group-hover:scale-110"
                                                style={{ backgroundColor: dynamicAccent }}
                                                title={`Accent: ${dynamicAccent}`}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bespoke Color Palette Studio Drawer */}
                {showPaletteStudio && (
                    <div className="pt-4 border-t border-zinc-800/80 space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold text-white tracking-wide uppercase">
                                    Bespoke Color Studio
                                </span>
                                <span className="text-[10px] text-zinc-400 font-normal">
                                    (Fine-tune hexadecimal brand values)
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={resetToThemeDefaults}
                                className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                <span>Reset to Theme Defaults</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                            {Object.entries(invoiceData.customColors || {}).map(([key, value]: [string, any]) => {
                                const info = colorLabels[key] || {
                                    label: key.charAt(0).toUpperCase() + key.slice(1),
                                    role: 'Visual element styling'
                                };

                                return (
                                    <div
                                        key={key}
                                        className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 space-y-2.5 shadow-inner"
                                    >
                                        <div className="flex items-center justify-between">
                                            <Label className="text-white text-xs font-bold">
                                                {info.label}
                                            </Label>
                                            <span className="text-[9px] font-mono text-zinc-400">
                                                {String(value).toUpperCase()}
                                            </span>
                                        </div>

                                        <p className="text-[10px] text-zinc-400 leading-tight">
                                            {info.role}
                                        </p>

                                        <div className="flex items-center space-x-2 pt-1">
                                            {/* Luxury Circular Color Orb */}
                                            <div className="relative group/orb flex-shrink-0 cursor-pointer">
                                                <input
                                                    type="color"
                                                    value={value || '#000000'}
                                                    onChange={(e) => updateColor(key, e.target.value)}
                                                    className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer z-10"
                                                />
                                                <div
                                                    className="w-8 h-8 rounded-full border-2 border-zinc-700/80 shadow-md group-hover/orb:scale-105 transition-transform flex items-center justify-center overflow-hidden"
                                                    style={{ backgroundColor: value }}
                                                >
                                                    <div className="w-full h-full bg-gradient-to-tr from-black/20 via-transparent to-white/30 rounded-full" />
                                                </div>
                                            </div>

                                            <Input
                                                value={value || ''}
                                                onChange={(e) => updateColor(key, e.target.value)}
                                                placeholder="#FFFFFF"
                                                className="input-green text-[11px] font-mono h-8 uppercase tracking-wider bg-zinc-900/90 border-zinc-700/80 text-white"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

ThemeSelector.displayName = 'ThemeSelector';
