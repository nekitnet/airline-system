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
        const { name, passport, email, phone } = body || {};

        // Валидация: запрет российских номеров телефонов (+7)
        if (phone && (phone.startsWith('+7') || phone.startsWith('7 ') || phone.match(/^7\s*\(/))) {
            return NextResponse.json(
                { error: 'Российские номера телефонов не допускаются. Используйте белорусский формат: +375 (XX) XXX-XX-XX' },
                { status: 400 }
            );
        }

        const updated = await db.passenger.update({
            where: { id },
            data: {
                ...(name !== undefined ? { name } : {}),
                ...(passport !== undefined ? { passport } : {}),
                ...(email !== undefined ? { email } : {}),
                ...(phone !== undefined ? { phone } : {}),
            },
        });

        return NextResponse.json({ passenger: updated });
    } catch (error) {
        console.error('Ошибка обновления пассажира:', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}


