'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Plane,
    Users,
    Ticket,
    Settings,
    LogOut,
    Plus,
    Edit,
    Trash2,
    Calendar,
    MapPin,
    Clock
} from 'lucide-react';

interface Flight {
    id: number;
    from: string;
    to: string;
    date: string;
    time: string;
    status: string;
    plane: string;
    crew: number[];
}

interface Staff {
    id: number;
    name: string;
    role: string;
    phone?: string;
    email?: string;
}

interface Ticket {
    id: number;
    flightId: number;
    passengerId: number;
    seat: string;
    price: number;
    status: string;
    passenger: {
        name: string;
    };
    flight: {
        from: string;
        to: string;
        date: string;
        time: string;
    };
}

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'admin') {
            router.push('/');
            return;
        }

        setUser(parsedUser);
        fetchDashboardData();
    }, [router]);

    const fetchDashboardData = async () => {
        try {
            const [flightsRes, staffRes, ticketsRes] = await Promise.all([
                fetch('/api/flights'),
                fetch('/api/staff'),
                fetch('/api/tickets')
            ]);

            if (flightsRes.ok) {
                const flightsData = await flightsRes.json();
                setFlights(flightsData.flights || []);
            }

            if (staffRes.ok) {
                const staffData = await staffRes.json();
                setStaff(staffData.staff || []);
            }

            if (ticketsRes.ok) {
                const ticketsData = await ticketsRes.json();
                setTickets(ticketsData.tickets || []);
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
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
                            <Badge className="ml-3 bg-red-100 text-red-800">Администратор</Badge>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
                    <p className="text-gray-600">Управление рейсами, персоналом и билетами</p>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-sky-600">{flights.length}</div>
                            <div className="text-sm text-gray-600">Всего рейсов</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-green-600">{staff.length}</div>
                            <div className="text-sm text-gray-600">Сотрудников</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-blue-600">{tickets.length}</div>
                            <div className="text-sm text-gray-600">Билетов продано</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {flights.filter(f => f.status === 'В пути').length}
                            </div>
                            <div className="text-sm text-gray-600">Рейсов в пути</div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="flights" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="flights">Рейсы</TabsTrigger>
                        <TabsTrigger value="staff">Сотрудники</TabsTrigger>
                        <TabsTrigger value="tickets">Билеты</TabsTrigger>
                    </TabsList>

                    {/* Рейсы */}
                    <TabsContent value="flights">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Управление рейсами</h2>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Добавить рейс
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {flights.map((flight) => (
                                    <Card key={flight.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        {flight.from} → {flight.to}
                                                    </CardTitle>
                                                    <CardDescription>Рейс #{flight.id}</CardDescription>
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
                                                    <Plane className="h-4 w-4 mr-2" />
                                                    {flight.plane}
                                                </div>

                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    Экипаж: {flight.crew.length} человек
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Изменить
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        Изменить статус
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Сотрудники */}
                    <TabsContent value="staff">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Управление персоналом</h2>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Добавить сотрудника
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {staff.map((person) => (
                                    <Card key={person.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{person.name}</CardTitle>
                                                    <CardDescription>{person.role}</CardDescription>
                                                </div>
                                                <Badge variant="outline">
                                                    ID: {person.id}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {person.email && (
                                                    <div className="text-sm text-gray-600">
                                                        Email: {person.email}
                                                    </div>
                                                )}
                                                {person.phone && (
                                                    <div className="text-sm text-gray-600">
                                                        Телефон: {person.phone}
                                                    </div>
                                                )}

                                                <div className="flex gap-2 pt-2">
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Изменить
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        Назначить на рейс
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Билеты */}
                    <TabsContent value="tickets">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Управление билетами</h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {tickets.map((ticket) => (
                                    <Card key={ticket.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        Билет #{ticket.id}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Пассажир: {ticket.passenger.name}
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
                                                    <Ticket className="h-4 w-4 mr-2" />
                                                    Место: {ticket.seat}
                                                </div>

                                                <div className="text-lg font-semibold text-sky-600">
                                                    {ticket.price.toLocaleString('ru-RU')} ₽
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Изменить
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Отменить
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}