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
        const { status } = await request.json();
        if (!status) {
            return NextResponse.json({ error: 'Не указан статус' }, { status: 400 });
        }

        const ticket = await db.ticket.update({
            where: { id },
            data: { status },
            include: { flight: true, passenger: true },
        });
        return NextResponse.json({ ticket });
    } catch (error) {
        console.error('Ошибка обновления билета:', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}


