'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Mail,
    Phone,
    User,
    Search,
    Filter
} from 'lucide-react';

interface Staff {
    id: number;
    name: string;
    role: string;
    phone?: string;
    email?: string;
}

export default function StaffManagement() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: 'Пилот',
        email: '',
        phone: ''
    });
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selected, setSelected] = useState<Staff | null>(null);

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
        fetchStaff();
    }, [router]);

    useEffect(() => {
        filterStaff();
    }, [staff, searchTerm, roleFilter]);

    const fetchStaff = async () => {
        try {
            const response = await fetch('/api/staff');
            if (response.ok) {
                const data = await response.json();
                setStaff(data.staff || []);
            }
        } catch (error) {
            console.error('Ошибка при загрузке сотрудников:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterStaff = () => {
        let filtered = staff;

        if (searchTerm) {
            filtered = filtered.filter(person =>
                person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                person.phone?.includes(searchTerm)
            );
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter(person => person.role === roleFilter);
        }

        setFilteredStaff(filtered);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchStaff();
                setIsAddDialogOpen(false);
                setFormData({ name: '', role: 'Пилот', email: '', phone: '' });
            }
        } catch (error) {
            console.error('Ошибка при добавлении сотрудника:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
            return;
        }

        try {
            const response = await fetch(`/api/staff/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchStaff();
            }
        } catch (error) {
            console.error('Ошибка при удалении сотрудника:', error);
        }
    };

    const handleUpdate = async () => {
        if (!selected) return;
        try {
            const response = await fetch(`/api/staff/${selected.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                await fetchStaff();
                setIsEditDialogOpen(false);
                setSelected(null);
            }
        } catch (error) {
            console.error('Ошибка при обновлении сотрудника:', error);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Пилот':
                return 'bg-blue-100 text-blue-800';
            case 'Стюардесса':
                return 'bg-pink-100 text-pink-800';
            case 'Инженер':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Users className="h-12 w-12 text-sky-600 animate-pulse mx-auto mb-4" />
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
                            <Link href="/admin" className="flex items-center">
                                <Users className="h-8 w-8 text-sky-600 mr-3" />
                                <span className="text-xl font-bold text-gray-900">Управление персоналом</span>
                            </Link>
                            <Badge className="ml-3 bg-red-100 text-red-800">Администратор</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/admin">
                                <Button variant="ghost">Назад к панели</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Заголовок */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление сотрудниками</h1>
                    <p className="text-gray-600">Добавление, редактирование и управление персоналом авиакомпании</p>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-sky-600">{staff.length}</div>
                            <div className="text-sm text-gray-600">Всего сотрудников</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {staff.filter(s => s.role === 'Пилот').length}
                            </div>
                            <div className="text-sm text-gray-600">Пилотов</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-pink-600">
                                {staff.filter(s => s.role === 'Стюардесса').length}
                            </div>
                            <div className="text-sm text-gray-600">Стюардесс</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {staff.filter(s => s.role === 'Инженер').length}
                            </div>
                            <div className="text-sm text-gray-600">Инженеров</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Фильтры и поиск */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="h-5 w-5 mr-2" />
                            Поиск и фильтры
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="search">Поиск</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="search"
                                        placeholder="Имя, email, телефон..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Должность</Label>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Все должности" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Все должности</SelectItem>
                                        <SelectItem value="Пилот">Пилот</SelectItem>
                                        <SelectItem value="Стюардесса">Стюардесса</SelectItem>
                                        <SelectItem value="Инженер">Инженер</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Добавить сотрудника
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Добавление нового сотрудника</DialogTitle>
                                            <DialogDescription>
                                                Заполните информацию о новом сотруднике
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">ФИО</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    placeholder="Иванов Иван Иванович"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="role">Должность</Label>
                                                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Пилот">Пилот</SelectItem>
                                                        <SelectItem value="Стюардесса">Стюардесса</SelectItem>
                                                        <SelectItem value="Инженер">Инженер</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    placeholder="ivan@example.com"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Телефон</Label>
                                                <Input
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    placeholder="+7 (999) 123-45-67"
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <Button type="submit" className="flex-1">
                                                    Добавить
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsAddDialogOpen(false)}
                                                >
                                                    Отмена
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Список сотрудников */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredStaff.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Сотрудники не найдены</p>
                            <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
                        </div>
                    ) : (
                        filteredStaff.map((person) => (
                            <Card key={person.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{person.name}</CardTitle>
                                            <CardDescription>ID: {person.id}</CardDescription>
                                        </div>
                                        <Badge className={getRoleColor(person.role)}>
                                            {person.role}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {person.email && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="h-4 w-4 mr-2" />
                                                {person.email}
                                            </div>
                                        )}

                                        {person.phone && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="h-4 w-4 mr-2" />
                                                {person.phone}
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => {
                                                    setSelected(person);
                                                    setFormData({
                                                        name: person.name,
                                                        role: person.role,
                                                        email: person.email || '',
                                                        phone: person.phone || ''
                                                    });
                                                    setIsEditDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Изменить
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(person.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>
            {/* Диалог: Изменить сотрудника */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Изменить сотрудника #{selected?.id}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">ФИО</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Должность</Label>
                            <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Пилот">Пилот</SelectItem>
                                    <SelectItem value="Стюардесса">Стюардесса</SelectItem>
                                    <SelectItem value="Инженер">Инженер</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Телефон</Label>
                            <Input
                                id="edit-phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
                        <Button onClick={handleUpdate}>Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}