'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    const { toast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    const [addFlightOpen, setAddFlightOpen] = useState(false);
    const [editFlightOpen, setEditFlightOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [editStaffOpen, setEditStaffOpen] = useState(false);
    const [ticketEditOpen, setTicketEditOpen] = useState(false);

    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const [flightForm, setFlightForm] = useState({ from: '', to: '', date: '', time: '', plane: '', price: '' });
    const [newFlightPilotIds, setNewFlightPilotIds] = useState<number[]>([]);
    const [newFlightStewardessIds, setNewFlightStewardessIds] = useState<number[]>([]);
    const [statusValue, setStatusValue] = useState('В ожидании');
    const [assignStaffIds, setAssignStaffIds] = useState<number[]>([]);
    const [staffForm, setStaffForm] = useState({ name: '', role: 'Пилот', email: '', phone: '' });
    const [ticketStatus, setTicketStatus] = useState('Забронирован');

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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
                    <p className="text-gray-600">Управление рейсами, персоналом и билетами</p>
                </div>

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

                    <TabsContent value="flights" className="pt-6">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Управление рейсами</h2>
                                <Button onClick={() => { setFlightForm({ from: '', to: '', date: '', time: '', plane: '', price: '' }); setNewFlightPilotIds([]); setNewFlightStewardessIds([]); setAddFlightOpen(true); }}>
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
                                                    <Button variant="outline" size="sm" onClick={() => { setSelectedFlight(flight); setFlightForm({ from: flight.from, to: flight.to, date: flight.date, time: flight.time, plane: flight.plane, price: String((flight as any).price ?? '') }); setEditFlightOpen(true); }}>
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Изменить
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => { setSelectedFlight(flight); setStatusValue(flight.status); setStatusOpen(true); }}>
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

                    <TabsContent value="staff" className="pt-6">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Управление персоналом</h2>
                                <Button onClick={() => router.push('/admin/staff')}>
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
                                                    <Button variant="outline" size="sm" onClick={() => { setSelectedStaff(person); setStaffForm({ name: person.name, role: person.role, email: person.email || '', phone: person.phone || '' }); setEditStaffOpen(true); }}>
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Изменить
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => { setSelectedStaff(person); setAssignStaffIds([]); setAssignOpen(true); }}>
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

                    <TabsContent value="tickets" className="pt-6">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
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
                                                    <Button variant="outline" size="sm" onClick={() => { setSelectedTicket(ticket); setTicketStatus(ticket.status); setTicketEditOpen(true); }}>
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Изменить
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={async () => { await fetch(`/api/tickets/${ticket.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Отменён' }) }); toast({ title: 'Билет отменен' }); fetchDashboardData(); }}>
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

                <Dialog open={addFlightOpen} onOpenChange={setAddFlightOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="pb-6">
                            <DialogTitle className="text-xl">Добавить рейс</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 pt-2">
                            <div>
                                <Label>Откуда</Label>
                                <Input value={flightForm.from} onChange={e => setFlightForm({ ...flightForm, from: e.target.value })} />
                            </div>
                            <div>
                                <Label>Куда</Label>
                                <Input value={flightForm.to} onChange={e => setFlightForm({ ...flightForm, to: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Дата</Label>
                                    <Input type="date" value={flightForm.date} onChange={e => setFlightForm({ ...flightForm, date: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Время</Label>
                                    <Input type="time" value={flightForm.time} onChange={e => setFlightForm({ ...flightForm, time: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <Label>Самолёт</Label>
                                <Input value={flightForm.plane} onChange={e => setFlightForm({ ...flightForm, plane: e.target.value })} />
                            </div>
                            <div>
                                <Label>Цена</Label>
                                <Input 
                                    type="text" 
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={flightForm.price} 
                                    onChange={e => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setFlightForm({ ...flightForm, price: value });
                                    }} 
                                />
                            </div>

                            <div className="grid gap-2 pt-2">
                                <Label className="text-base font-medium">Пилоты (минимум 2)</Label>
                                <div className="max-h-40 overflow-auto p-3 border rounded-md space-y-2">
                                    {staff.filter(s => s.role === 'Пилот').map(p => (
                                        <label key={p.id} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={newFlightPilotIds.includes(p.id)}
                                                onChange={(e) => {
                                                    const set = new Set(newFlightPilotIds);
                                                    if (e.target.checked) set.add(p.id); else set.delete(p.id);
                                                    setNewFlightPilotIds(Array.from(set));
                                                }}
                                            />
                                            <span>{p.name}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-500">Выбрано: {newFlightPilotIds.length}</div>
                            </div>

                            <div className="grid gap-2 pt-2">
                                <Label className="text-base font-medium">Стюардессы (минимум 2)</Label>
                                <div className="max-h-40 overflow-auto p-3 border rounded-md space-y-2">
                                    {staff.filter(s => s.role === 'Стюардесса').map(st => (
                                        <label key={st.id} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={newFlightStewardessIds.includes(st.id)}
                                                onChange={(e) => {
                                                    const set = new Set(newFlightStewardessIds);
                                                    if (e.target.checked) set.add(st.id); else set.delete(st.id);
                                                    setNewFlightStewardessIds(Array.from(set));
                                                }}
                                            />
                                            <span>{st.name}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-500">Выбрано: {newFlightStewardessIds.length}</div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAddFlightOpen(false)}>Отмена</Button>
                            <Button onClick={async () => {
                                if (newFlightPilotIds.length < 2 || newFlightStewardessIds.length < 2) {
                                    toast({ title: 'Требуется минимум 2 пилота и 2 стюардессы' });
                                    return;
                                }
                                const crew = [...newFlightPilotIds, ...newFlightStewardessIds];
                                const res = await fetch('/api/flights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...flightForm, price: flightForm.price ? Number(flightForm.price) : null, crew }) });
                                if (res.ok) { toast({ title: 'Рейс создан' }); setAddFlightOpen(false); fetchDashboardData(); } else { const err = await res.json().catch(() => ({})); toast({ title: 'Ошибка', description: err?.error || 'Не удалось создать рейс' }); }
                            }}>Создать</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={editFlightOpen} onOpenChange={setEditFlightOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Изменить рейс #{selectedFlight?.id}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <div>
                                <Label>Откуда</Label>
                                <Input value={flightForm.from} onChange={e => setFlightForm({ ...flightForm, from: e.target.value })} />
                            </div>
                            <div>
                                <Label>Куда</Label>
                                <Input value={flightForm.to} onChange={e => setFlightForm({ ...flightForm, to: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Дата</Label>
                                    <Input type="date" value={flightForm.date} onChange={e => setFlightForm({ ...flightForm, date: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Время</Label>
                                    <Input type="time" value={flightForm.time} onChange={e => setFlightForm({ ...flightForm, time: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <Label>Самолёт</Label>
                                <Input value={flightForm.plane} onChange={e => setFlightForm({ ...flightForm, plane: e.target.value })} />
                            </div>
                            <div>
                                <Label>Цена</Label>
                                <Input 
                                    type="text" 
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={flightForm.price} 
                                    onChange={e => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setFlightForm({ ...flightForm, price: value });
                                    }} 
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditFlightOpen(false)}>Отмена</Button>
                            <Button onClick={async () => {
                                if (!selectedFlight) return;
                                const res = await fetch(`/api/flights/${selectedFlight.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...flightForm, price: flightForm.price === '' ? null : Number(flightForm.price) }) });
                                if (res.ok) { toast({ title: 'Рейс обновлен' }); setEditFlightOpen(false); fetchDashboardData(); } else { const err = await res.json().catch(() => ({})); toast({ title: 'Ошибка', description: err?.error || 'Не удалось обновить рейс' }); }
                            }}>Сохранить</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Изменить статус рейса #{selectedFlight?.id}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <Label>Статус</Label>
                            <Select value={statusValue} onValueChange={setStatusValue}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите статус" />
                                </SelectTrigger>
                                <SelectContent 
                                    className="!z-[102]"
                                    position="popper"
                                    sideOffset={4}
                                >
                                    <SelectItem value="В ожидании">В ожидании</SelectItem>
                                    <SelectItem value="В пути">В пути</SelectItem>
                                    <SelectItem value="Задержан">Задержан</SelectItem>
                                    <SelectItem value="Завершён">Завершён</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setStatusOpen(false)}>Отмена</Button>
                            <Button onClick={async () => {
                                if (!selectedFlight) return;
                                const res = await fetch(`/api/flights/${selectedFlight.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: statusValue }) });
                                if (res.ok) { toast({ title: 'Статус обновлен' }); setStatusOpen(false); fetchDashboardData(); } else { const err = await res.json().catch(() => ({})); toast({ title: 'Ошибка', description: err?.error || 'Не удалось обновить статус' }); }
                            }}>Сохранить</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Назначить {selectedStaff?.name} на рейс</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <Label>Выберите рейс</Label>
                            <Select value={selectedFlight ? String(selectedFlight.id) : ''} onValueChange={(v) => setSelectedFlight(flights.find(f => String(f.id) === v) || null)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите рейс" />
                                </SelectTrigger>
                                <SelectContent 
                                    className="!z-[102]"
                                    position="popper"
                                    sideOffset={4}
                                >
                                    {flights.map(f => (
                                        <SelectItem key={f.id} value={String(f.id)}>
                                            #{f.id} {f.from} → {f.to}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Label>Состав экипажа</Label>
                            <div className="max-h-48 overflow-auto space-y-2 p-2 border rounded-md">
                                {staff.map(s => (
                                    <label key={s.id} className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={assignStaffIds.includes(s.id) || (!!selectedFlight && selectedFlight.crew.includes(s.id)) || (selectedStaff?.id === s.id) || false} onChange={(e) => {
                                            const checked = e.target.checked;
                                            const base = new Set(assignStaffIds);
                                            if (checked) { base.add(s.id); } else { base.delete(s.id); }
                                            setAssignStaffIds(Array.from(base));
                                        }} />
                                        <span>{s.name} — {s.role}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAssignOpen(false)}>Отмена</Button>
                            <Button onClick={async () => {
                                if (!selectedFlight) { toast({ title: 'Выберите рейс' }); return; }
                                const finalIds = Array.from(new Set([...(selectedFlight.crew || []), ...(assignStaffIds || []), ...(selectedStaff ? [selectedStaff.id] : [])]));
                                const res = await fetch(`/api/flights/${selectedFlight.id}/crew`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ staffIds: finalIds }) });
                                if (res.ok) { toast({ title: 'Экипаж обновлен' }); setAssignOpen(false); fetchDashboardData(); } else { const err = await res.json().catch(() => ({})); toast({ title: 'Ошибка', description: err?.error || 'Не удалось обновить экипаж' }); }
                            }}>Сохранить</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={editStaffOpen} onOpenChange={setEditStaffOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Изменить сотрудника #{selectedStaff?.id}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <div>
                                <Label>ФИО</Label>
                                <Input value={staffForm.name} onChange={e => setStaffForm({ ...staffForm, name: e.target.value })} />
                            </div>
                            <div>
                                <Label>Должность</Label>
                                <Select value={staffForm.role} onValueChange={(v) => setStaffForm({ ...staffForm, role: v })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Выберите должность" />
                                    </SelectTrigger>
                                    <SelectContent 
                                        className="!z-[102]"
                                        position="popper"
                                        sideOffset={4}
                                    >
                                        <SelectItem value="Пилот">Пилот</SelectItem>
                                        <SelectItem value="Стюардесса">Стюардесса</SelectItem>
                                        <SelectItem value="Инженер">Инженер</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input type="email" value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} />
                            </div>
                            <div>
                                <Label>Телефон</Label>
                                <Input value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditStaffOpen(false)}>Отмена</Button>
                            <Button onClick={async () => {
                                if (!selectedStaff) return;
                                const res = await fetch(`/api/staff/${selectedStaff.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(staffForm) });
                                if (res.ok) { toast({ title: 'Сотрудник обновлен' }); setEditStaffOpen(false); fetchDashboardData(); } else { const err = await res.json().catch(() => ({})); toast({ title: 'Ошибка', description: err?.error || 'Не удалось обновить сотрудника' }); }
                            }}>Сохранить</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={ticketEditOpen} onOpenChange={setTicketEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Изменить билет #{selectedTicket?.id}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <Label>Статус</Label>
                            <Select value={ticketStatus} onValueChange={setTicketStatus}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите статус" />
                                </SelectTrigger>
                                <SelectContent 
                                    className="!z-[102]"
                                    position="popper"
                                    sideOffset={4}
                                >
                                    <SelectItem value="Забронирован">Забронирован</SelectItem>
                                    <SelectItem value="Оплачен">Оплачен</SelectItem>
                                    <SelectItem value="Отменён">Отменён</SelectItem>
                                    <SelectItem value="Использован">Использован</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setTicketEditOpen(false)}>Отмена</Button>
                            <Button onClick={async () => {
                                if (!selectedTicket) return;
                                const res = await fetch(`/api/tickets/${selectedTicket.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: ticketStatus }) });
                                if (res.ok) { toast({ title: 'Билет обновлен' }); setTicketEditOpen(false); fetchDashboardData(); } else { const err = await res.json().catch(() => ({})); toast({ title: 'Ошибка', description: err?.error || 'Не удалось обновить билет' }); }
                            }}>Сохранить</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}