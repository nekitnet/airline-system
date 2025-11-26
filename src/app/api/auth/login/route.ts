import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Логин и пароль обязательны для заполнения' },
                { status: 400 }
            );
        }

        const user = await db.user.findUnique({
            where: { username }
        });

        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: 'Неверный логин или пароль' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            message: 'Вход выполнен успешно',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}