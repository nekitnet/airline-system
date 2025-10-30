'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Flight {
    id: number;
    from: string;
    to: string;
    date: string;
    time: string;
    status: string;
    plane: string;
    crew: number[];
    price?: number;
}

export default function FlightDetailsPage() {
    const params = useParams();
    const flightId = useMemo(() => (params?.id ? parseInt(params.id as string) : NaN), [params]);
    const router = useRouter();
    const { toast } = useToast();

    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!flightId || Number.isNaN(flightId)) {
                router.push('/flights');
                return;
            }
            try {
                const res = await fetch('/api/flights');
                const data = await res.json();
                const found: Flight | undefined = (data.flights || []).find((f: Flight) => f.id === flightId);
                setFlight(found || null);
            } catch (e) {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [flightId, router]);

    const formatDateTime = (date: string, time: string) => {
        const dateObj = new Date(`${date}T${time}`);
        return dateObj.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'В ожидании':
                return 'bg-yellow-100 text-yellow-800';
            case 'В пути':
                return 'bg-blue-100 text-blue-800';
            case 'Задержан':
                return 'bg-red-100 text-red-800';
            case 'Завершён':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleBuy = async () => {
        if (!flight) return;
        const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (!userRaw) {
            router.push('/login');
            return;
        }
        const user = JSON.parse(userRaw);
        if (user.role !== 'passenger') {
            toast({ title: 'Доступ ограничен', description: 'Покупка доступна только пассажирам.' });
            return;
        }
        try {
            setBuying(true);
            const pRes = await fetch(`/api/passengers/user/${user.id}`);
            if (!pRes.ok) {
                toast({ title: 'Нет профиля пассажира', description: 'Заполните профиль пассажира в личном кабинете.' });
                router.push('/passenger');
                return;
            }
            const { passenger } = await pRes.json();
            const seat = `A${Math.floor(Math.random() * 100) + 1}`;
            const price = flight.price ?? 0;
            const tRes = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flightId: flight.id, passengerId: passenger.id, userId: user.id, seat, price }),
            });
            if (tRes.ok) {
                toast({ title: 'Билет забронирован', description: 'Перейдите в раздел "Мои билеты" для оплаты.' });
                router.push('/passenger');
            } else {
                const err = await tRes.json().catch(() => ({}));
                toast({ title: 'Не удалось оформить билет', description: err?.error || 'Попробуйте позже' });
            }
        } finally {
            setBuying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Plane className="h-12 w-12 text-sky-600 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-600">Загрузка данных рейса...</p>
                </div>
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-gray-600">Рейс не найден</p>
                    <Link href="/flights">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            К списку рейсов
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/flights">
                            <Button variant="ghost">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Назад
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="ghost">Главная</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">Рейс #{flight.id}: {flight.from} → {flight.to}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                    <Plane className="h-4 w-4 mr-1" /> {flight.plane}
                                </CardDescription>
                            </div>
                            <Badge className={getStatusColor(flight.status)}>{flight.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" /> {formatDateTime(flight.date, flight.time)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" /> Маршрут: {flight.from} - {flight.to}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Users className="h-4 w-4 mr-2" /> Экипаж: {flight.crew.length} человек
                            </div>
                            {typeof flight.price === 'number' && (
                                <div className="text-lg font-semibold text-sky-600">Цена: {flight.price.toLocaleString('ru-RU')} ₽</div>
                            )}
                            {flight.status === 'В ожидании' && (
                                <div className="pt-2">
                                    <Button onClick={handleBuy} disabled={buying}>{buying ? 'Оформление...' : 'Купить билет'}</Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}


