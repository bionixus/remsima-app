
"use client"

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Video, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
}

const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as any } }
}

const ARTICLES = [
    {
        id: '1',
        title: 'Self-Injection Guide for Remsima SC',
        description: 'Learn how to safely administer your Remsima SC dose at home with our step-by-step guide.',
        category: 'Guide',
        type: 'article',
        readTime: '8 min',
        image: '/images/injection-guide.jpg'
    },
    {
        id: '2',
        title: 'Managing Initial Side Effects',
        description: 'A comprehensive list of common side effects when switching from IV to SC and how to manage them.',
        category: 'Safety',
        type: 'article',
        readTime: '5 min',
        image: '/images/side-effects.jpg'
    },
    {
        id: '3',
        title: 'How Remsima SC Works',
        description: 'Watch this short animation to understand how the subcutaneous injection provides continuous relief.',
        category: 'Education',
        type: 'video',
        readTime: '3 min',
        image: '/images/how-it-works.jpg'
    }
]

export default function ArticlesPage() {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="container px-4 py-6 space-y-6"
        >
            <motion.header variants={item} className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Resources & Articles</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search articles, guides, FAQs..." className="pl-10 h-12 bg-secondary/50 border-none rounded-xl" />
                </div>
            </motion.header>

            {/* Categories */}
            <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Guides', 'Education', 'Safety', 'Lifestyle'].map((cat) => (
                    <motion.button
                        key={cat}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2 rounded-full border bg-background hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap font-medium text-sm"
                    >
                        {cat}
                    </motion.button>
                ))}
            </motion.div>

            {/* Articles Grid */}
            <div className="grid gap-6 pt-2">
                {ARTICLES.map((article) => (
                    <Link key={article.id} href={`/articles/${article.id}`}>
                        <motion.div variants={item}>
                            <Card className="overflow-hidden border-none bg-secondary/20 hover:bg-secondary/40 transition-colors group cursor-pointer hover:shadow-lg hover:scale-[1.01]">
                                <div className="aspect-video bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors" />
                                    {article.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-primary shadow-lg">
                                                <Video className="w-6 h-6 fill-primary" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                        {article.type === 'article' ? <FileText className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                                        {article.category}
                                    </div>
                                    <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 pt-1 text-muted-foreground">
                                        {article.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 border-t border-border/10 flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1 font-medium">
                                        <BookOpen className="w-3 h-3" />
                                        {article.readTime}
                                    </div>
                                    <span className="font-bold text-primary group-hover:underline">Read Now</span>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>
    )
}
