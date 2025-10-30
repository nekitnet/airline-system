import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const flightId = parseInt(params.id);
        if (isNaN(flightId)) {
            return NextResponse.json({ error: 'Неверный ID рейса' }, { status: 400 });
        }
        const { staffIds } = await request.json();
        if (!Array.isArray(staffIds)) {
            return NextResponse.json({ error: 'Ожидается массив staffIds' }, { status: 400 });
        }

        await db.crewMember.deleteMany({ where: { flightId } });
        if (staffIds.length > 0) {
            await db.crewMember.createMany({
                data: staffIds.map((staffId: number, idx: number) => ({
                    id: idx + 1,
                    flightId,
                    staffId,
                })),
            });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Ошибка назначения экипажа:', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}


