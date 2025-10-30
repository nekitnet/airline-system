'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Ticket, User, Mail, Phone, CreditCard, Calendar, MapPin, LogOut } from 'lucide-react';

interface Passenger {
    id: number;
    name: string;
    passport: string;
    email: string;
    phone: string;
    userId: number;
}

interface Ticket {
    id: number;
    flightId: number;
    passengerId: number;
    seat: string;
    price: number;
    status: string;
    flight: {
        id: number;
        from: string;
        to: string;
        date: string;
        time: string;
        status: string;
        plane: string;
    };
}

export default function PassengerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [passenger, setPassenger] = useState<Passenger | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'passenger') {
            router.push('/');
            return;
        }

        setUser(parsedUser);
        fetchPassengerData(parsedUser.id);
        fetchTickets(parsedUser.id);
    }, [router]);

    const fetchPassengerData = async (userId: number) => {
        try {
            const response = await fetch(`/api/passengers/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setPassenger(data.passenger);
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных пассажира:', error);
        }
    };

    const fetchTickets = async (userId: number) => {
        try {
            const response = await fetch(`/api/tickets/passenger/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setTickets(data.tickets || []);
            }
        } catch (error) {
            console.error('Ошибка при загрузке билетов:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Забронирован':
                return 'bg-blue-100 text-blue-800';
            case 'Оплачен':
                return 'bg-green-100 text-green-800';
            case 'Отменён':
                return 'bg-red-100 text-red-800';
            case 'Использован':
                return 'bg-gray-100 text-gray-800';
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Plane className="h-12 w-12 text-sky-600 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-600">Загрузка...</p>
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
                            <Link href="/flights">
                                <Button variant="ghost">Рейсы</Button>
                            </Link>
                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Выйти
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Заголовок */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Личный кабинет пассажира</h1>
                    <p className="text-gray-600">Управление вашими билетами и личными данными</p>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Мой профиль</TabsTrigger>
                        <TabsTrigger value="tickets">Мои билеты</TabsTrigger>
                    </TabsList>

                    {/* Профиль */}
                    <TabsContent value="profile">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Основная информация */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <User className="h-5 w-5 mr-2" />
                                        Личная информация
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {passenger ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">ФИО</p>
                                                    <p className="font-medium">{passenger.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Паспорт</p>
                                                    <p className="font-medium">{passenger.passport}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-medium flex items-center">
                                                        <Mail className="h-4 w-4 mr-1" />
                                                        {passenger.email}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Телефон</p>
                                                    <p className="font-medium flex items-center">
                                                        <Phone className="h-4 w-4 mr-1" />
                                                        {passenger.phone}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <Button variant="outline">Редактировать профиль</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Загрузка данных...</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Статистика */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Статистика</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-sky-600">{tickets.length}</div>
                                            <div className="text-sm text-gray-600">Всего билетов</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {tickets.filter(t => t.status === 'Оплачен').length}
                                            </div>
                                            <div className="text-sm text-gray-600">Оплачено</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {tickets.filter(t => t.status === 'Забронирован').length}
                                            </div>
                                            <div className="text-sm text-gray-600">Забронировано</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Билеты */}
                    <TabsContent value="tickets">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Мои билеты</h2>
                                <Link href="/flights">
                                    <Button>
                                        <Ticket className="h-4 w-4 mr-2" />
                                        Купить билет
                                    </Button>
                                </Link>
                            </div>

                            {tickets.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg mb-2">У вас пока нет билетов</p>
                                        <p className="text-gray-400 mb-4">Перейдите к списку рейсов для покупки</p>
                                        <Link href="/flights">
                                            <Button>Посмотреть рейсы</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {tickets.map((ticket) => (
                                        <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-lg">
                                                            Билет #{ticket.id}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Рейс #{ticket.flight.id}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge className={getStatusColor(ticket.status)}>
                                                        {ticket.status}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 mr-2" />
                                                        {ticket.flight.from} → {ticket.flight.to}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        {formatDateTime(ticket.flight.date, ticket.flight.time)}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Plane className="h-4 w-4 mr-2" />
                                                        {ticket.flight.plane}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <CreditCard className="h-4 w-4 mr-2" />
                                                        Место: {ticket.seat}
                                                    </div>

                                                    <div className="text-lg font-semibold text-sky-600">
                                                        {ticket.price.toLocaleString('ru-RU')} ₽
                                                    </div>

                                                    <div className="flex gap-2 pt-2">
                                                        <Button variant="outline" size="sm" className="flex-1">
                                                            Подробнее
                                                        </Button>
                                                        {ticket.status === 'Забронирован' && (
                                                            <Button size="sm" className="flex-1">
                                                                Оплатить
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}