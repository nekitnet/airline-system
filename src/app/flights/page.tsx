'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plane, Search, Filter, MapPin, Clock, Calendar, Users } from 'lucide-react';

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

export default function Flights() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [fromFilter, setFromFilter] = useState('');
    const [toFilter, setToFilter] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        fetchFlights();
    }, []);

    useEffect(() => {
        filterFlights();
    }, [flights, searchTerm, statusFilter, fromFilter, toFilter]);

    const fetchFlights = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch('/api/flights', { signal: controller.signal, cache: 'no-store' });
            if (!response.ok) throw new Error('Не удалось получить список рейсов');
            const data = await response.json();
            setFlights(data.flights || []);
        } catch (error) {
            console.error('Ошибка при загрузке рейсов:', error);
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
        }
    };

    const filterFlights = () => {
        let filtered = flights;

        // Поиск по тексту
        if (searchTerm) {
            filtered = filtered.filter(flight =>
                flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                flight.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                flight.plane.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Фильтр по статусу
        if (statusFilter !== 'all') {
            filtered = filtered.filter(flight => flight.status === statusFilter);
        }

        // Фильтр по отправлению
        if (fromFilter) {
            filtered = filtered.filter(flight =>
                flight.from.toLowerCase().includes(fromFilter.toLowerCase())
            );
        }

        // Фильтр по назначению
        if (toFilter) {
            filtered = filtered.filter(flight =>
                flight.to.toLowerCase().includes(toFilter.toLowerCase())
            );
        }

        setFilteredFlights(filtered);
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

    const formatDateTime = (date: string, time: string) => {
        const dateObj = new Date(`${date}T${time}`);
        return dateObj.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleBuy = async (flight: Flight) => {
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
        } catch (e) {
            toast({ title: 'Ошибка', description: 'Не удалось выполнить операцию.' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Plane className="h-12 w-12 text-sky-600 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-600">Загрузка рейсов...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
            {/* Навигация */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <Plane className="h-8 w-8 text-sky-600 mr-3" />
                                <span className="text-xl font-bold text-gray-900">Система Авиакомпания</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button variant="ghost">Главная</Button>
                            </Link>
                            <Link href="/login">
                                <Button>Войти</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Заголовок */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Список рейсов</h1>
                    <p className="text-gray-600">Просмотр и поиск доступных авиарейсов</p>
                </div>

                {/* Фильтры */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="h-5 w-5 mr-2" />
                            Фильтры и поиск
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="search">Поиск</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="search"
                                        placeholder="Город, самолет..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="from">Откуда</Label>
                                <Input
                                    id="from"
                                    placeholder="Город вылета"
                                    value={fromFilter}
                                    onChange={(e) => setFromFilter(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="to">Куда</Label>
                                <Input
                                    id="to"
                                    placeholder="Город прилета"
                                    value={toFilter}
                                    onChange={(e) => setToFilter(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Статус</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Все статусы" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Все статусы</SelectItem>
                                        <SelectItem value="В ожидании">В ожидании</SelectItem>
                                        <SelectItem value="В пути">В пути</SelectItem>
                                        <SelectItem value="Задержан">Задержан</SelectItem>
                                        <SelectItem value="Завершён">Завершён</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                        setFromFilter('');
                                        setToFilter('');
                                    }}
                                    className="w-full"
                                >
                                    Сбросить
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Список рейсов */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredFlights.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Рейсы не найдены</p>
                            <p className="text-gray-400">Попробуйте изменить параметры фильтрации</p>
                        </div>
                    ) : (
                        filteredFlights.map((flight) => (
                            <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">
                                                {flight.from} → {flight.to}
                                            </CardTitle>
                                            <CardDescription className="flex items-center mt-1">
                                                <Plane className="h-4 w-4 mr-1" />
                                                {flight.plane}
                                            </CardDescription>
                                        </div>
                                        <Badge className={getStatusColor(flight.status)}>
                                            {flight.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {formatDateTime(flight.date, flight.time)}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Маршрут: {flight.from} - {flight.to}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="h-4 w-4 mr-2" />
                                            Экипаж: {flight.crew.length} человек
                                        </div>

                                        {flight.price && (
                                            <div className="text-lg font-semibold text-sky-600">
                                                от {flight.price.toLocaleString('ru-RU')} ₽
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <Link href={`/flights/${flight.id}`} className="flex-1">
                                                <Button className="w-full">Подробнее</Button>
                                            </Link>
                                            {flight.status === 'В ожидании' && (
                                                <Button variant="outline" onClick={() => handleBuy(flight)}>
                                                    Купить билет
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Статистика */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-sky-600">{flights.length}</div>
                            <div className="text-sm text-gray-600">Всего рейсов</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {flights.filter(f => f.status === 'В ожидании').length}
                            </div>
                            <div className="text-sm text-gray-600">В ожидании</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {flights.filter(f => f.status === 'В пути').length}
                            </div>
                            <div className="text-sm text-gray-600">В пути</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {flights.filter(f => f.status === 'Завершён').length}
                            </div>
                            <div className="text-sm text-gray-600">Завершено</div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}