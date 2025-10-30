import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const { name, role, email, phone } = await request.json();

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Неверный ID сотрудника' },
                { status: 400 }
            );
        }

        const staff = await db.staff.update({
            where: { id },
            data: {
                name,
                role,
                email: email || null,
                phone: phone || null
            }
        });

        return NextResponse.json({
            message: 'Сотрудник успешно обновлен',
            staff
        });
    } catch (error) {
        console.error('Ошибка обновления сотрудника:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Неверный ID сотрудника' },
                { status: 400 }
            );
        }

        await db.staff.delete({
            where: { id }
        });

        return NextResponse.json({
            message: 'Сотрудник успешно удален'
        });
    } catch (error) {
        console.error('Ошибка удаления сотрудника:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}