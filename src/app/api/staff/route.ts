import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const staff = await db.staff.findMany({
            include: {
                crew: {
                    include: {
                        flight: true
                    }
                }
            }
        });

        return NextResponse.json({ staff });
    } catch (error) {
        console.error('Ошибка получения сотрудников:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, role, email, phone } = await request.json();

        if (!name || !role) {
            return NextResponse.json(
                { error: 'Имя и должность обязательны для заполнения' },
                { status: 400 }
            );
        }

        if (email) {
            const existingStaff = await db.staff.findUnique({
                where: { email }
            });

            if (existingStaff) {
                return NextResponse.json(
                    { error: 'Сотрудник с таким email уже существует' },
                    { status: 400 }
                );
            }
        }

        const staff = await db.staff.create({
            data: {
                name,
                role,
                email: email || null,
                phone: phone || null
            }
        });

        return NextResponse.json({
            message: 'Сотрудник успешно добавлен',
            staff
        });
    } catch (error) {
        console.error('Ошибка добавления сотрудника:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}