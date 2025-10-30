'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Ticket, User, Mail, Phone, CreditCard, Calendar, MapPin, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    const { toast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [passenger, setPassenger] = useState<Passenger | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', passport: '', email: '', phone: '' });
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

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

    const openEdit = () => {
        if (!passenger) return;
        setEditForm({ name: passenger.name, passport: passenger.passport, email: passenger.email, phone: passenger.phone });
        setIsEditOpen(true);
    };

    const saveEdit = async () => {
        if (!passenger) return;
        try {
            const res = await fetch(`/api/passengers/${passenger.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                const data = await res.json();
                setPassenger(data.passenger);
                setIsEditOpen(false);
                toast({ title: 'Профиль обновлен' });
            } else {
                const err = await res.json().catch(() => ({}));
                toast({ title: 'Ошибка обновления', description: err?.error || 'Попробуйте позже' });
            }
        } catch {
            toast({ title: 'Ошибка сети', description: 'Не удалось сохранить изменения' });
        }
    };

    const payTicket = async (ticketId: number) => {
        try {
            const res = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Оплачен' }),
            });
            if (res.ok) {
                const { ticket } = await res.json();
                setTickets(prev => prev.map(t => (t.id === ticket.id ? { ...t, status: ticket.status } : t)));
                toast({ title: 'Оплата прошла успешно' });
            } else {
                const err = await res.json().catch(() => ({}));
                toast({ title: 'Не удалось оплатить', description: err?.error || 'Попробуйте позже' });
            }
        } catch {
            toast({ title: 'Ошибка', description: 'Не удалось выполнить оплату' });
        }
    };

    const openDetails = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setDetailsOpen(true);
    };

    const copyBookingCode = async () => {
        if (!selectedTicket) return;
        try {
            await navigator.clipboard.writeText(`TICKET-${selectedTicket.id}-${selectedTicket.seat}`);
            toast({ title: 'Код брони скопирован' });
        } catch {
            toast({ title: 'Не удалось скопировать код' });
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
                                                <Button variant="outline" onClick={openEdit}>Редактировать профиль</Button>
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
                                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openDetails(ticket)}>
                                                            Подробнее
                                                        </Button>
                                                        {ticket.status === 'Забронирован' && (
                                                            <Button size="sm" className="flex-1" onClick={() => payTicket(ticket.id)}>
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

                {/* Диалог редактирования профиля */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Редактировать профиль</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">ФИО</Label>
                                <Input id="name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="passport">Паспорт</Label>
                                <Input id="passport" value={editForm.passport} onChange={e => setEditForm({ ...editForm, passport: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Телефон</Label>
                                <Input id="phone" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Отмена</Button>
                            <Button onClick={saveEdit}>Сохранить</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Диалог подробностей билета */}
                <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Билет #{selectedTicket?.id}</DialogTitle>
                        </DialogHeader>
                        {selectedTicket && (
                            <div className="space-y-3">
                                <div className="text-sm text-gray-700">Маршрут: {selectedTicket.flight.from} → {selectedTicket.flight.to}</div>
                                <div className="text-sm text-gray-700">Вылет: {formatDateTime(selectedTicket.flight.date, selectedTicket.flight.time)}</div>
                                <div className="text-sm text-gray-700">Самолёт: {selectedTicket.flight.plane}</div>
                                <div className="text-sm text-gray-700">Место: {selectedTicket.seat}</div>
                                <div className="text-sm text-gray-700">Статус: {selectedTicket.status}</div>
                                <div className="text-sm font-semibold text-sky-700">Цена: {selectedTicket.price.toLocaleString('ru-RU')} ₽</div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" onClick={copyBookingCode}>Скопировать код брони</Button>
                                    <Button onClick={() => { setDetailsOpen(false); router.push(`/flights/${selectedTicket.flight.id}`); }}>Открыть детали рейса</Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}