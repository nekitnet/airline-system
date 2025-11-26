import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { username, password, role } = await request.json();

        if (!username || !password || !role) {
            return NextResponse.json(
                { error: 'Все поля обязательны для заполнения' },
                { status: 400 }
            );
        }

        const existingUser = await db.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Пользователь с таким логином уже существует' },
                { status: 400 }
            );
        }

        const user = await db.user.create({
            data: {
                username,
                password,
                role
            }
        });

        return NextResponse.json({
            message: 'Пользователь успешно зарегистрирован',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}