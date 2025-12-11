'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, User, Lock, Mail, Phone, CreditCard } from 'lucide-react';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'passenger',
        name: '',
        email: '',
        phone: '',
        passport: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        try {
            const userResponse = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    role: formData.role
                }),
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.error || 'Ошибка регистрации');
            }

            const userData = await userResponse.json();

            if (formData.role === 'passenger') {
                const passengerResponse = await fetch('/api/passengers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        passport: formData.passport,
                        email: formData.email,
                        phone: formData.phone,
                        userId: userData.user.id
                    }),
                });

                if (!passengerResponse.ok) {
                    throw new Error('Ошибка при создании профиля пассажира');
                }
            }

            localStorage.setItem('user', JSON.stringify(userData.user));

            router.push(formData.role === 'admin' ? '/admin' : '/passenger');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4" suppressHydrationWarning>
                        <Plane className="h-12 w-12 text-sky-600 mr-3" suppressHydrationWarning />
                        <h1 className="text-3xl font-bold text-gray-900">Система Авиакомпания</h1>
                    </div>
                    <p className="text-gray-600">Создайте новый аккаунт</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Регистрация</CardTitle>
                        <CardDescription>
                            Заполните форму для создания нового аккаунта
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Основная информация</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Логин</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" suppressHydrationWarning />
                                        <Input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Введите логин"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Пароль</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" suppressHydrationWarning />
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="Введите пароль"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" suppressHydrationWarning />
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                placeholder="Подтвердите пароль"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {formData.role === 'passenger' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Личная информация</h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="name">Полное имя</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" suppressHydrationWarning />
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Иванов Иван Иванович"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" suppressHydrationWarning />
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="ivan@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Телефон</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" suppressHydrationWarning />
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="+375444546311"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="passport">Номер паспорта</Label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" suppressHydrationWarning />
                                            <Input
                                                id="passport"
                                                name="passport"
                                                type="text"
                                                placeholder="1234 567890"
                                                value={formData.passport}
                                                onChange={handleChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Уже есть аккаунт?{' '}
                                <Link href="/login" className="text-sky-600 hover:text-sky-700 font-medium">
                                    Войдите
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}