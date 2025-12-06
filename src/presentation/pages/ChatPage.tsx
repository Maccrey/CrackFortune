import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFortuneContext } from '../context/FortuneContext';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface ChatSession {
    date: string;
    startTime: number;
    totalTimeUsed: number; // seconds
}

const CHAT_TIME_LIMIT = 180; // 3 minutes in seconds
const STORAGE_KEY = 'fortunecrack:chat_session';

const ChatPage: React.FC = () => {
    const { t, language } = useLanguage();
    const { fortune, user } = useFortuneContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [remainingTime, setRemainingTime] = useState(CHAT_TIME_LIMIT);
    const [isTimeOver, setIsTimeOver] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sessionRef = useRef<ChatSession | null>(null);
    const timerRef = useRef<number | null>(null);

    // Initialize session
    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (stored) {
            const session: ChatSession = JSON.parse(stored);
            if (session.date === today) {
                sessionRef.current = session;
                const timeUsed = session.totalTimeUsed + Math.floor((Date.now() - session.startTime) / 1000);
                const remaining = Math.max(0, CHAT_TIME_LIMIT - timeUsed);
                setRemainingTime(remaining);
                setIsTimeOver(remaining === 0);
            } else {
                // New day, reset session
                const newSession: ChatSession = {
                    date: today,
                    startTime: Date.now(),
                    totalTimeUsed: 0
                };
                sessionRef.current = newSession;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
            }
        } else {
            // First time, create session
            const newSession: ChatSession = {
                date: today,
                startTime: Date.now(),
                totalTimeUsed: 0
            };
            sessionRef.current = newSession;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        }

        // Initial welcome message
        const welcomeMsg: Message = {
            id: '1',
            text: t('chat_welcome'),
            sender: 'ai',
            timestamp: new Date()
        };
        setMessages([welcomeMsg]);
    }, [t]);

    // Timer countdown
    useEffect(() => {
        if (isTimeOver) return;

        timerRef.current = window.setInterval(() => {
            setRemainingTime(prev => {
                const next = prev - 1;
                if (next <= 0) {
                    setIsTimeOver(true);
                    // Update session in localStorage
                    if (sessionRef.current) {
                        sessionRef.current.totalTimeUsed = CHAT_TIME_LIMIT;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionRef.current));
                    }
                    return 0;
                }
                return next;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            // Save current time used
            if (sessionRef.current && !isTimeOver) {
                const timeUsed = CHAT_TIME_LIMIT - remainingTime;
                sessionRef.current.totalTimeUsed = timeUsed;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionRef.current));
            }
        };
    }, [isTimeOver, remainingTime]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isTimeOver || isTyping) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Build system prompt based on fortune and language (fortune teller persona)
            const systemPrompts = {
                ko: `당신은 50년 경력의 노련한 점술가입니다. 고풍스럽고 신비로운 말투로 운세를 풀이합니다. "~하시게", "~다네", "~하겠구만" 같은 점쟁이 특유의 말투를 사용하세요.

[오늘의 운세]
${fortune ? `요약: ${fortune.summary}
상세: ${fortune.fullText}
길한 색: ${fortune.color}` : '아직 쿠키를 깨지 않았구만. 먼저 오늘의 운세를 확인하고 오시게.'}

**말투 예시:**
- "음... 자네의 사주를 보니 말이야..."
- "오늘은 재물운이 상승하는 기운이 보이는구만"
- "조심하시게. 오후에는..."
- "걱정 말게. 길운이 함께하고 있으니..."

사용자의 운세와 관련된 질문에만 점쟁이 말투로 답변하세요. 다른 주제는 "그것은 점을 볼 수 있는 영역이 아니니라..." 같이 정중히 거절하고 운세 상담으로 유도하세요.`,

                ja: `あなたは50年の経験を持つベテランの占い師です。古風で神秘的な口調で運勢を占います。占い師特有の丁寧で落ち着いた話し方を使ってください。

[今日の運勢]
${fortune ? `要約: ${fortune.summary}
詳細: ${fortune.fullText}
吉祥色: ${fortune.color}` : 'まだクッキーを割っていませんね。まず今日の運勢を確認してきてください。'}

**口調の例:**
- "ふむ...あなたの星回りを見ると..."
- "今日は金運が上昇する気配がありますよ"
- "お気をつけください。午後には..."
- "ご安心を。吉運が共にあります..."

ユーザーの運勢に関連する質問にのみ占い師の口調で答えてください。他のトピックは「それは占いの領域ではございません...」のように丁重に断り、運勢相談に誘導してください。`,

                en: `You are a seasoned fortune teller with 50 years of experience. Speak in a mystical, wise, and slightly cryptic manner, as a traditional fortune teller would.

[Today's Fortune]
${fortune ? `Summary: ${fortune.summary}
Details: ${fortune.fullText}
Lucky Color: ${fortune.color}` : 'You haven not cracked the cookie yet, my dear. Please check your fortune first.'}

**Speech examples:**
- "Ah... I see in your stars..."
- "The wealth energy is rising today, child..."
- "Be cautious... in the afternoon..."
- "Fear not, for fortune smiles upon you..."

Only answer questions related to the user's fortune using a fortune teller's voice. Politely decline other topics saying "That is beyond the realm of my sight..." and guide back to fortune consultation.`
            };

            const systemPrompt = systemPrompts[user?.locale || language] || systemPrompts.en;

            // Call Gemini API (using same endpoint as fortune generation)
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `${systemPrompt}\n\nUser question: ${inputValue}` }]
                        }
                    ],
                    generationConfig: { temperature: 0.8 }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || t('chat_typing');

            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newAiMessage]);
        } catch (error) {
            console.error('[ChatPage] Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md z-10">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 font-mystical">
                        {t('chat_title')}
                    </h2>
                    <div className={`text-sm font-mono ${remainingTime < 60 ? 'text-red-400 animate-pulse' : 'text-yellow-300'}`}>
                        ⏱️ {t('chat_time_remaining')}: {formatTime(remainingTime)}
                    </div>
                </div>
                {fortune && (
                    <div className="mt-2 text-xs text-gray-400">
                        {t('chat_fortune_context')}: {fortune.summary}
                    </div>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                ? 'bg-purple-600 text-white rounded-tr-none'
                                : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white/5 text-gray-400 text-xs p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                <span className="ml-1">{t('chat_typing')}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={isTimeOver ? t('chat_time_over') : t('chat_placeholder')}
                        disabled={isTimeOver}
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping || isTimeOver}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors flex items-center justify-center aspect-square"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Time Over Overlay */}
            <AnimatePresence>
                {isTimeOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/10 border border-white/20 p-8 rounded-2xl text-center max-w-md mx-4"
                        >
                            <div className="text-4xl mb-4">⏰</div>
                            <h3 className="text-xl font-bold text-white mb-2">{t('chat_time_over')}</h3>
                            <p className="text-gray-300 text-sm mb-6">{t('chat_time_over_message')}</p>
                            <Link
                                to="/"
                                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors"
                            >
                                {t('btn_open_another')}
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatPage;
