'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Users, Ticket, Shield, Clock, MapPin } from 'lucide-react';

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const user = localStorage.getItem('user');
                if (user) {
                    const parsedUser = JSON.parse(user);
                    setIsLoggedIn(true);
                    setUserRole(parsedUser.role || '');
                }
            } catch (error) {
                console.error('Ошибка при чтении localStorage:', error);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Plane className="h-8 w-8 text-sky-600 mr-3" />
                            <span className="text-xl font-bold text-gray-900">Система Авиакомпания</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/flights">
                                <Button variant="ghost">Рейсы</Button>
                            </Link>
                            {isLoggedIn ? (
                                <>
                                    <Link href={userRole === 'admin' ? '/admin' : '/passenger'}>
                                        <Button>Личный кабинет</Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            if (typeof window !== 'undefined') {
                                                localStorage.removeItem('user');
                                            }
                                            setIsLoggedIn(false);
                                            setUserRole('');
                                        }}
                                    >
                                        Выйти
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost">Войти</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button>Регистрация</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <section className="relative bg-gradient-to-r from-sky-600 to-blue-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Добро пожаловать в Систему Авиакомпания
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 text-sky-100">
                                Современная система управления полетами и бронирования билетов
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/flights">
                                    <Button size="lg" variant="secondary" className="bg-white text-sky-600 hover:bg-gray-100">
                                        <Ticket className="mr-2 h-5 w-5" />
                                        Посмотреть рейсы
                                    </Button>
                                </Link>
                                {!isLoggedIn && (
                                    <Link href="/register">
                                        <Button size="lg" variant="secondary" className="bg-sky-500 text-white hover:bg-sky-600 border-2 border-white">
                                            <Users className="mr-2 h-5 w-5" />
                                            Зарегистрироваться
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Возможности нашей системы
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Комплексное решение для управления авиакомпанией с удобным интерфейсом
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <Plane className="h-12 w-12 text-sky-600 mb-4" />
                                    <CardTitle>Управление рейсами</CardTitle>
                                    <CardDescription>
                                        Полный контроль над расписанием полетов, статусами и назначением экипажей
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Создавайте, редактируйте и отслеживайте рейсы в реальном времени
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <Ticket className="h-12 w-12 text-sky-600 mb-4" />
                                    <CardTitle>Бронирование билетов</CardTitle>
                                    <CardDescription>
                                        Удобная система покупки и управления авиабилетами онлайн
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Пассажиры могут легко выбирать рейсы и оформлять билеты
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <Users className="h-12 w-12 text-sky-600 mb-4" />
                                    <CardTitle>Управление персоналом</CardTitle>
                                    <CardDescription>
                                        Полный учет сотрудников авиакомпании и их назначение на рейсы
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Управляйте пилотами, стюардессами и другим персоналом
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <Shield className="h-12 w-12 text-sky-600 mb-4" />
                                    <CardTitle>Безопасность</CardTitle>
                                    <CardDescription>
                                        Надежная система аутентификации и разграничения прав доступа
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Разные уровни доступа для пассажиров и администраторов
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <Clock className="h-12 w-12 text-sky-600 mb-4" />
                                    <CardTitle>Отслеживание статусов</CardTitle>
                                    <CardDescription>
                                        Мониторинг статусов рейсов в реальном времени
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Информация о задержках, вылетах и прибытиях
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <MapPin className="h-12 w-12 text-sky-600 mb-4" />
                                    <CardTitle>Маршруты</CardTitle>
                                    <CardDescription>
                                        Управление маршрутами и направлениями полетов
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Гибкая система управления авиамаршрутами
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-sky-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Наша система в цифрах
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-sky-600 mb-2">100+</div>
                                <div className="text-gray-600">Ежедневных рейсов</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-sky-600 mb-2">50+</div>
                                <div className="text-gray-600">Направлений</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-sky-600 mb-2">1000+</div>
                                <div className="text-gray-600">Сотрудников</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-sky-600 mb-2">99.9%</div>
                                <div className="text-gray-600">Доступность</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <Plane className="h-8 w-8 text-sky-400 mr-3" />
                                <span className="text-xl font-bold">Система Авиакомпания</span>
                            </div>
                            <p className="text-gray-400">
                                Современная система управления авиакомпанией
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/flights" className="hover:text-white">Список рейсов</Link></li>
                                <li><Link href="/register" className="hover:text-white">Регистрация</Link></li>
                                <li><Link href="/login" className="hover:text-white">Вход</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Поддержка</h3>
                            <p className="text-gray-400">
                                Круглосуточная поддержка клиентов<br />
                                Телефон: +7 (800) 123-45-67<br />
                                Email: support@airline.ru
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 Система Авиакомпания. Все права защищены.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}