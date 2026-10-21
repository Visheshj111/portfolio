import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CardRotateProps {
    children: React.ReactNode;
    onSendToBack: () => void;
    sensitivity: number;
    disableDrag?: boolean;
}

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false }: CardRotateProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [60, -60]);
    const rotateY = useTransform(x, [-100, 100], [-60, 60]);

    function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
        if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
            onSendToBack();
        } else {
            x.set(0);
            y.set(0);
        }
    }

    if (disableDrag) {
        return (
            <motion.div className="absolute inset-0 cursor-pointer" style={{ x: 0, y: 0 }}>
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            className="absolute inset-0 cursor-grab"
            style={{ x, y, rotateX, rotateY }}
            drag
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dragElastic={0.6}
            whileTap={{ cursor: 'grabbing' }}
            onDragEnd={handleDragEnd}
        >
            {children}
        </motion.div>
    );
}

interface StackProps {
    randomRotation?: boolean;
    sensitivity?: number;
    sendToBackOnClick?: boolean;
    cards?: React.ReactNode[];
    animationConfig?: { stiffness: number; damping: number };
    autoplay?: boolean;
    autoplayDelay?: number;
    pauseOnHover?: boolean;
    mobileClickOnly?: boolean;
    mobileBreakpoint?: number;
}

export default function Stack({
    randomRotation = false,
    sensitivity = 200,
    cards = [],
    animationConfig = { stiffness: 260, damping: 20 },
    sendToBackOnClick = false,
    autoplay = false,
    autoplayDelay = 3000,
    pauseOnHover = false,
    mobileClickOnly = false,
    mobileBreakpoint = 768
}: StackProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < mobileBreakpoint);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [mobileBreakpoint]);

    const shouldDisableDrag = mobileClickOnly && isMobile;
    const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

    const [stack, setStack] = useState<{ id: number; content: React.ReactNode }[]>(() => {
        if (cards.length) {
            return cards.map((content, index) => ({ id: index + 1, content }));
        } else {
            return [
                {
                    id: 1,
                    content: (
                        <Image
                            src="/playnear/screenshot-1.png"
                            alt="Screenshot 1"
                            fill
                            quality={100}
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-cover pointer-events-none"
                        />
                    )
                },
                {
                    id: 2,
                    content: (
                        <Image
                            src="/playnear/screenshot-2.png"
                            alt="Screenshot 2"
                            fill
                            quality={100}
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-cover pointer-events-none"
                        />
                    )
                },
                {
                    id: 3,
                    content: (
                        <Image
                            src="/playnear/screenshot-3.png"
                            alt="Screenshot 3"
                            fill
                            quality={100}
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-cover pointer-events-none"
                        />
                    )
                },
                {
                    id: 4,
                    content: (
                        <Image
                            src="/playnear/screenshot-4.png"
                            alt="Screenshot 4"
                            fill
                            quality={100}
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-cover pointer-events-none"
                        />
                    )
                }
            ];
        }
    });

    useEffect(() => {
        if (cards.length) {
            setStack(cards.map((content, index) => ({ id: index + 1, content })));
        }
    }, [cards]);

    const [rotations, setRotations] = useState<Record<number, number>>({});

    useEffect(() => {
        if (randomRotation) {
            setRotations(prev => {
                const newRotations = { ...prev };
                stack.forEach(card => {
                    if (newRotations[card.id] === undefined) {
                        newRotations[card.id] = Math.random() * 10 - 5;
                    }
                });
                return newRotations;
            });
        }
    }, [stack, randomRotation]);

    const sendToBack = (id: number) => {
        setStack(prev => {
            const newStack = [...prev];
            const index = newStack.findIndex(card => card.id === id);
            const [card] = newStack.splice(index, 1);
            newStack.unshift(card);
            return newStack;
        });
    };

    useEffect(() => {
        if (autoplay && stack.length > 1 && !isPaused) {
            const interval = setInterval(() => {
                const topCardId = stack[stack.length - 1].id;
                sendToBack(topCardId);
            }, autoplayDelay);

            return () => clearInterval(interval);
        }
    }, [autoplay, autoplayDelay, stack, isPaused]);

    return (
        <div
            className="relative w-full h-full"
            style={{
                perspective: 600
            }}
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            {stack.map((card, index) => {
                const cardRotation = randomRotation ? (rotations[card.id] || 0) : 0;
                return (
                    <CardRotate
                        key={card.id}
                        onSendToBack={() => sendToBack(card.id)}
                        sensitivity={sensitivity}
                        disableDrag={shouldDisableDrag}
                    >
                        <motion.div
                            className="rounded-2xl overflow-hidden w-full h-full absolute inset-0 bg-background border border-foreground/10"
                            onClick={() => shouldEnableClick && sendToBack(card.id)}
                            style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                            animate={{
                                rotateZ: (stack.length - index - 1) * 4 + cardRotation,
                                scale: 1 + index * 0.06 - stack.length * 0.06,
                                transformOrigin: '90% 90%'
                            }}
                            initial={false}
                            transition={{
                                type: 'spring',
                                stiffness: animationConfig.stiffness,
                                damping: animationConfig.damping
                            }}
                        >
                            {card.content}
                        </motion.div>
                    </CardRotate>
                );
            })}
        </div>
    );
}
