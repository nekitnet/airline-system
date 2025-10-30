import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Создаем пользователей
    const adminUser = await prisma.user.create({
        data: {
            username: 'admin',
            password: 'admin123', // В реальном приложении нужно хешировать пароли
            role: 'admin',
        },
    });

    const passengerUser = await prisma.user.create({
        data: {
            username: 'ivanov',
            password: '1234', // В реальном приложении нужно хешировать пароли
            role: 'passenger',
        },
    });

    // Создаем пассажира
    const passenger = await prisma.passenger.create({
        data: {
            name: 'Иванов Иван Иванович',
            passport: '1234 567890',
            email: 'ivanov@example.com',
            phone: '+7 (999) 123-45-67',
            userId: passengerUser.id,
        },
    });

    // Создаем сотрудников
    const pilot1 = await prisma.staff.create({
        data: {
            name: 'Петров Петр Петрович',
            role: 'Пилот',
            email: 'pilot1@airline.ru',
            phone: '+7 (999) 111-22-33',
        },
    });

    const stewardess1 = await prisma.staff.create({
        data: {
            name: 'Сидорова Анна Викторовна',
            role: 'Стюардесса',
            email: 'stewardess1@airline.ru',
            phone: '+7 (999) 222-33-44',
        },
    });

    const engineer1 = await prisma.staff.create({
        data: {
            name: 'Кузнецов Михаил Сергеевич',
            role: 'Инженер',
            email: 'engineer1@airline.ru',
            phone: '+7 (999) 333-44-55',
        },
    });

    // Создаем рейсы
    const flight1 = await prisma.flight.create({
        data: {
            from: 'Москва',
            to: 'Сочи',
            date: '2024-12-25',
            time: '12:00',
            status: 'В ожидании',
            plane: 'Airbus A320',
            price: 15000,
        },
    });

    const flight2 = await prisma.flight.create({
        data: {
            from: 'Санкт-Петербург',
            to: 'Краснодар',
            date: '2024-12-26',
            time: '09:30',
            status: 'В ожидании',
            plane: 'Boeing 737',
            price: 12000,
        },
    });

    const flight3 = await prisma.flight.create({
        data: {
            from: 'Москва',
            to: 'Екатеринбург',
            date: '2024-12-25',
            time: '15:45',
            status: 'В пути',
            plane: 'Airbus A321',
            price: 18000,
        },
    });

    // Назначаем экипажи на рейсы
    await prisma.crewMember.createMany({
        data: [
            { id: 1, flightId: flight1.id, staffId: pilot1.id },
            { id: 2, flightId: flight1.id, staffId: stewardess1.id },
            { id: 3, flightId: flight2.id, staffId: pilot1.id },
            { id: 4, flightId: flight3.id, staffId: engineer1.id },
        ],
    });

    // Создаем билеты
    await prisma.ticket.create({
        data: {
            flightId: flight1.id,
            passengerId: passenger.id,
            userId: passengerUser.id,
            seat: '12A',
            price: 15000,
            status: 'Оплачен',
        },
    });

    console.log('База данных успешно заполнена начальными данными!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });