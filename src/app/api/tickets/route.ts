import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const tickets = await db.ticket.findMany({
            include: {
                flight: true,
                passenger: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        return NextResponse.json({ tickets });
    } catch (error) {
        console.error('Ошибка получения билетов:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { flightId, passengerId, userId, seat, price, status } = await request.json();

        if (!flightId || !passengerId || !userId || !seat || !price) {
            return NextResponse.json(
                { error: 'Все поля обязательны для заполнения' },
                { status: 400 }
            );
        }

        const existingTicket = await db.ticket.findFirst({
            where: {
                flightId,
                seat
            }
        });

        if (existingTicket) {
            return NextResponse.json(
                { error: 'Это место уже занято' },
                { status: 400 }
            );
        }

        const ticket = await db.ticket.create({
            data: {
                flightId,
                passengerId,
                userId,
                seat,
                price,
                status: status || 'Забронирован'
            },
            include: {
                flight: true,
                passenger: true
            }
        });

        return NextResponse.json({
            message: 'Билет успешно создан',
            ticket
        });
    } catch (error) {
        console.error('Ошибка создания билета:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}