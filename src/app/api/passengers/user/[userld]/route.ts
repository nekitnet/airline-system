import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = parseInt(params.userId);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: 'Неверный ID пользователя' },
                { status: 400 }
            );
        }

        const passenger = await db.passenger.findUnique({
            where: { userId }
        });

        if (!passenger) {
            return NextResponse.json(
                { error: 'Пассажир не найден' },
                { status: 404 }
            );
        }

        return NextResponse.json({ passenger });
    } catch (error) {
        console.error('Ошибка получения пассажира:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}