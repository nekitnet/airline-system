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

    // Дополнительные сотрудники
    const pilot2 = await prisma.staff.create({
        data: {
            name: 'Иванов Сергей Николаевич',
            role: 'Пилот',
            email: 'pilot2@airline.ru',
            phone: '+7 (999) 444-55-66',
        },
    });

    const pilot3 = await prisma.staff.create({
        data: {
            name: 'Алексеев Дмитрий Андреевич',
            role: 'Пилот',
            email: 'pilot3@airline.ru',
            phone: '+7 (999) 555-66-77',
        },
    });

    const pilot4 = await prisma.staff.create({
        data: {
            name: 'Никитин Павел Константинович',
            role: 'Пилот',
            email: 'pilot4@airline.ru',
            phone: '+7 (999) 666-77-88',
        },
    });

    const pilot5 = await prisma.staff.create({
        data: {
            name: 'Громов Алексей Викторович',
            role: 'Пилот',
            email: 'pilot5@airline.ru',
            phone: '+7 (999) 777-88-99',
        },
    });

    const stewardess2 = await prisma.staff.create({
        data: {
            name: 'Ковалёва Мария Сергеевна',
            role: 'Стюардесса',
            email: 'stewardess2@airline.ru',
            phone: '+7 (999) 888-99-00',
        },
    });

    const stewardess3 = await prisma.staff.create({
        data: {
            name: 'Романова Елена Александровна',
            role: 'Стюардесса',
            email: 'stewardess3@airline.ru',
            phone: '+7 (999) 000-11-22',
        },
    });

    const stewardess4 = await prisma.staff.create({
        data: {
            name: 'Смирнова Ольга Дмитриевна',
            role: 'Стюардесса',
            email: 'stewardess4@airline.ru',
            phone: '+7 (999) 111-22-44',
        },
    });

    const stewardess5 = await prisma.staff.create({
        data: {
            name: 'Ильина Наталья Викторовна',
            role: 'Стюардесса',
            email: 'stewardess5@airline.ru',
            phone: '+7 (999) 222-44-55',
        },
    });

    const engineer2 = await prisma.staff.create({
        data: {
            name: 'Сорокин Игорь Павлович',
            role: 'Инженер',
            email: 'engineer2@airline.ru',
            phone: '+7 (999) 333-55-66',
        },
    });

    // Создаем рейсы
    const flight1 = await prisma.flight.create({
        data: {
            from: 'Москва',
            to: 'Сочи',
            date: '2025-01-15',
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
            date: '2025-02-20',
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
            date: '2025-03-10',
            time: '15:45',
            status: 'В пути',
            plane: 'Airbus A321',
            price: 18000,
        },
    });

    const flight4 = await prisma.flight.create({
        data: {
            from: 'Казань',
            to: 'Новосибирск',
            date: '2025-04-05',
            time: '07:15',
            status: 'В ожидании',
            plane: 'Boeing 737 MAX',
            price: 20000,
        },
    });

    const flight5 = await prisma.flight.create({
        data: {
            from: 'Сочи',
            to: 'Москва',
            date: '2025-05-22',
            time: '18:20',
            status: 'В ожидании',
            plane: 'Airbus A320neo',
            price: 15500,
        },
    });

    const flight6 = await prisma.flight.create({
        data: {
            from: 'Самара',
            to: 'Санкт-Петербург',
            date: '2025-06-12',
            time: '10:40',
            status: 'В ожидании',
            plane: 'Boeing 757',
            price: 17500,
        },
    });

    // Новые рейсы, начиная с 2025-10-31
    const flight7 = await prisma.flight.create({
        data: {
            from: 'Москва',
            to: 'Калининград',
            date: '2025-10-31',
            time: '14:10',
            status: 'В ожидании',
            plane: 'Airbus A320',
            price: 16000,
        },
    });

    const flight8 = await prisma.flight.create({
        data: {
            from: 'Сочи',
            to: 'Казань',
            date: '2025-11-02',
            time: '08:25',
            status: 'В ожидании',
            plane: 'Boeing 737-800',
            price: 17000,
        },
    });

    const flight9 = await prisma.flight.create({
        data: {
            from: 'Екатеринбург',
            to: 'Москва',
            date: '2025-11-15',
            time: '19:00',
            status: 'В ожидании',
            plane: 'Airbus A321',
            price: 18500,
        },
    });

    const flight10 = await prisma.flight.create({
        data: {
            from: 'Новосибирск',
            to: 'Санкт-Петербург',
            date: '2025-12-01',
            time: '06:50',
            status: 'В ожидании',
            plane: 'Boeing 737 MAX',
            price: 22000,
        },
    });

    const flight11 = await prisma.flight.create({
        data: {
            from: 'Краснодар',
            to: 'Сочи',
            date: '2025-12-20',
            time: '11:35',
            status: 'В ожидании',
            plane: 'Airbus A319',
            price: 9000,
        },
    });

    // Назначаем экипажи на рейсы
    // Назначаем экипажи (на каждом рейсе минимум 2 пилота и стюардессы)
    await prisma.crewMember.createMany({
        data: [
            // flight1
            { id: 1, flightId: flight1.id, staffId: pilot1.id },
            { id: 2, flightId: flight1.id, staffId: pilot2.id },
            { id: 3, flightId: flight1.id, staffId: stewardess1.id },
            { id: 4, flightId: flight1.id, staffId: stewardess2.id },
            // flight2
            { id: 1, flightId: flight2.id, staffId: pilot3.id },
            { id: 2, flightId: flight2.id, staffId: pilot4.id },
            { id: 3, flightId: flight2.id, staffId: stewardess3.id },
            { id: 4, flightId: flight2.id, staffId: stewardess4.id },
            // flight3
            { id: 1, flightId: flight3.id, staffId: pilot5.id },
            { id: 2, flightId: flight3.id, staffId: pilot1.id },
            { id: 3, flightId: flight3.id, staffId: stewardess5.id },
            { id: 4, flightId: flight3.id, staffId: stewardess2.id },
            { id: 5, flightId: flight3.id, staffId: engineer1.id },
            // flight4
            { id: 1, flightId: flight4.id, staffId: pilot2.id },
            { id: 2, flightId: flight4.id, staffId: pilot3.id },
            { id: 3, flightId: flight4.id, staffId: stewardess1.id },
            { id: 4, flightId: flight4.id, staffId: stewardess3.id },
            // flight5
            { id: 1, flightId: flight5.id, staffId: pilot4.id },
            { id: 2, flightId: flight5.id, staffId: pilot5.id },
            { id: 3, flightId: flight5.id, staffId: stewardess4.id },
            { id: 4, flightId: flight5.id, staffId: stewardess5.id },
            // flight6
            { id: 1, flightId: flight6.id, staffId: pilot1.id },
            { id: 2, flightId: flight6.id, staffId: pilot2.id },
            { id: 3, flightId: flight6.id, staffId: stewardess2.id },
            { id: 4, flightId: flight6.id, staffId: stewardess4.id },
            // flight7
            { id: 1, flightId: flight7.id, staffId: pilot3.id },
            { id: 2, flightId: flight7.id, staffId: pilot4.id },
            { id: 3, flightId: flight7.id, staffId: stewardess1.id },
            { id: 4, flightId: flight7.id, staffId: stewardess5.id },
            // flight8
            { id: 1, flightId: flight8.id, staffId: pilot5.id },
            { id: 2, flightId: flight8.id, staffId: pilot1.id },
            { id: 3, flightId: flight8.id, staffId: stewardess2.id },
            { id: 4, flightId: flight8.id, staffId: stewardess4.id },
            // flight9
            { id: 1, flightId: flight9.id, staffId: pilot2.id },
            { id: 2, flightId: flight9.id, staffId: pilot3.id },
            { id: 3, flightId: flight9.id, staffId: stewardess3.id },
            { id: 4, flightId: flight9.id, staffId: stewardess1.id },
            // flight10
            { id: 1, flightId: flight10.id, staffId: pilot4.id },
            { id: 2, flightId: flight10.id, staffId: pilot5.id },
            { id: 3, flightId: flight10.id, staffId: stewardess2.id },
            { id: 4, flightId: flight10.id, staffId: stewardess3.id },
            // flight11
            { id: 1, flightId: flight11.id, staffId: pilot1.id },
            { id: 2, flightId: flight11.id, staffId: pilot2.id },
            { id: 3, flightId: flight11.id, staffId: stewardess4.id },
            { id: 4, flightId: flight11.id, staffId: stewardess5.id },
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