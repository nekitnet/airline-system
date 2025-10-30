import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { userld: string } }
) {
    try {
        const userId = parseInt(params.userld);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: 'Неверный ID пользователя' },
                { status: 400 }
            );
        }

        const tickets = await db.ticket.findMany({
            where: { userId },
            include: {
                flight: true,
                passenger: true
            }
        });

        return NextResponse.json({ tickets });
    } catch (error) {
        console.error('Ошибка получения билетов пассажира:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}