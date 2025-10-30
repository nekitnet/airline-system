import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { name, passport, email, phone, userId } = await request.json();

        if (!name || !passport || !email || !phone || !userId) {
            return NextResponse.json(
                { error: 'Все поля обязательны для заполнения' },
                { status: 400 }
            );
        }

        // Проверяем, существует ли пассажир с таким паспортом
        const existingPassenger = await db.passenger.findUnique({
            where: { passport }
        });

        if (existingPassenger) {
            return NextResponse.json(
                { error: 'Пассажир с таким номером паспорта уже существует' },
                { status: 400 }
            );
        }

        // Создаем пассажира
        const passenger = await db.passenger.create({
            data: {
                name,
                passport,
                email,
                phone,
                userId
            }
        });

        return NextResponse.json({
            message: 'Пассажир успешно создан',
            passenger
        });
    } catch (error) {
        console.error('Ошибка создания пассажира:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}