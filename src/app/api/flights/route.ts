import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const flights = await db.flight.findMany({
            include: {
                crew: {
                    include: {
                        staff: true
                    }
                },
                tickets: {
                    include: {
                        passenger: true
                    }
                }
            }
        });

        // Форматируем данные для фронтенда
        const formattedFlights = flights.map(flight => ({
            ...flight,
            crew: flight.crew.map(cm => cm.staff.id)
        }));

        return NextResponse.json({ flights: formattedFlights });
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