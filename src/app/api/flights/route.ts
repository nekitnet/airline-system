import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const flights = await db.flight.findMany({
            select: {
                id: true,
                from: true,
                to: true,
                date: true,
                time: true,
                status: true,
                plane: true,
                price: true,
                crew: { select: { staffId: true } },
            },
            where: {
                // только будущие/актуальные даты
                date: { gte: '2025-10-31' }
            },
            orderBy: [{ date: 'asc' }, { time: 'asc' }],
            take: 100
        });

        const formattedFlights = flights.map((flight) => ({
            id: flight.id,
            from: flight.from,
            to: flight.to,
            date: flight.date,
            time: flight.time,
            status: flight.status,
            plane: flight.plane,
            price: flight.price ?? undefined,
            crew: flight.crew.map((c) => c.staffId),
        }));

        return NextResponse.json({ flights: formattedFlights }, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
        console.error('Ошибка получения рейсов:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { from, to, date, time, status, plane, price, crew } = await request.json();

        if (!from || !to || !date || !time || !plane) {
            return NextResponse.json(
                { error: 'Обязательные поля должны быть заполнены' },
                { status: 400 }
            );
        }

        // Создаем рейс
        const flight = await db.flight.create({
            data: {
                from,
                to,
                date,
                time,
                status: status || 'В ожидании',
                plane,
                price: price || null
            }
        });

        // Если указан экипаж, добавляем его
        if (crew && crew.length > 0) {
            await db.crewMember.createMany({
                data: crew.map((staffId: number, index: number) => ({
                    id: index + 1,
                    flightId: flight.id,
                    staffId
                }))
            });
        }

        return NextResponse.json({
            message: 'Рейс успешно создан',
            flight
        });
    } catch (error) {
        console.error('Ошибка создания рейса:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}