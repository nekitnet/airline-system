import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Неверный ID' }, { status: 400 });
        }
        const body = await request.json();
        const { from, to, date, time, status, plane, price } = body || {};
        const flight = await db.flight.update({
            where: { id },
            data: {
                ...(from !== undefined ? { from } : {}),
                ...(to !== undefined ? { to } : {}),
                ...(date !== undefined ? { date } : {}),
                ...(time !== undefined ? { time } : {}),
                ...(status !== undefined ? { status } : {}),
                ...(plane !== undefined ? { plane } : {}),
                ...(price !== undefined ? { price } : {}),
            },
        });
        return NextResponse.json({ flight });
    } catch (error) {
        console.error('Ошибка обновления рейса:', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}


