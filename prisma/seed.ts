import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Очистка данных для повторного сидирования в dev-среде
    await prisma.crewMember.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.flight.deleteMany();
    await prisma.passenger.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.user.deleteMany();
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
            date: '2025-10-31',
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
            date: '2025-11-01',
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
            date: '2025-11-02',
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
            date: '2025-11-03',
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
            date: '2025-11-04',
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
            date: '2025-11-05',
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
            date: '2025-11-06',
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
            date: '2025-11-07',
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
            date: '2025-11-08',
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
            date: '2025-11-09',
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
            date: '2025-11-10',
            time: '11:35',
            status: 'В ожидании',
            plane: 'Airbus A319',
            price: 9000,
        },
    });

    // Международные рейсы 2025
    const flight12 = await prisma.flight.create({
        data: {
            from: 'Москва',
            to: 'Стамбул',
            date: '2025-11-11',
            time: '13:20',
            status: 'В ожидании',
            plane: 'Airbus A321',
            price: 24000,
        },
    });

    const flight13 = await prisma.flight.create({
        data: {
            from: 'Москва',
            to: 'Дубай',
            date: '2025-11-12',
            time: '22:10',
            status: 'В ожидании',
            plane: 'Boeing 777',
            price: 42000,
        },
    });

    const flight14 = await prisma.flight.create({
        data: {
            from: 'Санкт-Петербург',
            to: 'Хельсинки',
            date: '2025-11-13',
            time: '08:50',
            status: 'В ожидании',
            plane: 'Embraer E190',
            price: 19000,
        },
    });

    const flight15 = await prisma.flight.create({
        data: {
            from: 'Казань',
            to: 'Ереван',
            date: '2025-11-14',
            time: '12:35',
            status: 'В ожидании',
            plane: 'Airbus A320',
            price: 21000,
        },
    });

    const flight16 = await prisma.flight.create({
        data: {
            from: 'Новосибирск',
            to: 'Астана',
            date: '2025-11-15',
            time: '07:05',
            status: 'В ожидании',
            plane: 'Boeing 737-800',
            price: 17000,
        },
    });

    const flight17 = await prisma.flight.create({
        data: {
            from: 'Владивосток',
            to: 'Токио',
            date: '2025-11-16',
            time: '09:15',
            status: 'В ожидании',
            plane: 'Boeing 787 Dreamliner',
            price: 52000,
        },
    });

    const flight18 = await prisma.flight.create({
        data: {
            from: 'Москва',
            to: 'Берлин',
            date: '2025-11-17',
            time: '16:45',
            status: 'В ожидании',
            plane: 'Airbus A320neo',
            price: 30000,
        },
    });

    const flight19 = await prisma.flight.create({
        data: {
            from: 'Сочи',
            to: 'Тбилиси',
            date: '2025-11-18',
            time: '20:25',
            status: 'В ожидании',
            plane: 'Boeing 737',
            price: 16000,
        },
    });

    const flight20 = await prisma.flight.create({
        data: {
            from: 'Екатеринбург',
            to: 'Бишкек',
            date: '2025-11-19',
            time: '06:30',
            status: 'В ожидании',
            plane: 'Airbus A319',
            price: 15000,
        },
    });

    // Дополнительные 20 рейсов (домашние и международные) после 2025-11-19
    const flight21 = await prisma.flight.create({
        data: { from: 'Москва', to: 'Париж', date: '2025-11-20', time: '12:10', status: 'В ожидании', plane: 'Airbus A321', price: 35000 },
    });
    const flight22 = await prisma.flight.create({
        data: { from: 'Санкт-Петербург', to: 'Рим', date: '2025-11-21', time: '09:55', status: 'В ожидании', plane: 'Boeing 737-800', price: 33000 },
    });
    const flight23 = await prisma.flight.create({
        data: { from: 'Казань', to: 'Ташкент', date: '2025-11-22', time: '07:25', status: 'В ожидании', plane: 'Airbus A320', price: 20000 },
    });
    const flight24 = await prisma.flight.create({
        data: { from: 'Новосибирск', to: 'Алматы', date: '2025-11-23', time: '06:40', status: 'В ожидании', plane: 'Boeing 737 MAX', price: 19000 },
    });
    const flight25 = await prisma.flight.create({
        data: { from: 'Екатеринбург', to: 'Минск', date: '2025-11-24', time: '17:15', status: 'В ожидании', plane: 'Embraer E190', price: 17000 },
    });
    const flight26 = await prisma.flight.create({
        data: { from: 'Сочи', to: 'Ереван', date: '2025-11-25', time: '19:20', status: 'В ожидании', plane: 'Airbus A319', price: 16000 },
    });
    const flight27 = await prisma.flight.create({
        data: { from: 'Москва', to: 'Анталья', date: '2025-11-26', time: '05:50', status: 'В ожидании', plane: 'Boeing 737', price: 27000 },
    });
    const flight28 = await prisma.flight.create({
        data: { from: 'Ростов-на-Дону', to: 'Москва', date: '2025-11-27', time: '08:10', status: 'В ожидании', plane: 'Airbus A320', price: 9000 },
    });
    const flight29 = await prisma.flight.create({
        data: { from: 'Уфа', to: 'Санкт-Петербург', date: '2025-11-28', time: '13:05', status: 'В ожидании', plane: 'Boeing 737-800', price: 11000 },
    });
    const flight30 = await prisma.flight.create({
        data: { from: 'Самара', to: 'Сочи', date: '2025-11-29', time: '21:15', status: 'В ожидании', plane: 'Airbus A321', price: 12000 },
    });
    const flight31 = await prisma.flight.create({
        data: { from: 'Москва', to: 'Баку', date: '2025-11-30', time: '11:30', status: 'В ожидании', plane: 'Airbus A320neo', price: 23000 },
    });
    const flight32 = await prisma.flight.create({
        data: { from: 'Санкт-Петербург', to: 'Тбилиси', date: '2025-12-01', time: '06:30', status: 'В ожидании', plane: 'Boeing 737', price: 20000 },
    });
    const flight33 = await prisma.flight.create({
        data: { from: 'Пермь', to: 'Москва', date: '2025-12-02', time: '08:45', status: 'В ожидании', plane: 'Embraer E190', price: 8000 },
    });
    const flight34 = await prisma.flight.create({
        data: { from: 'Красноярск', to: 'Екатеринбург', date: '2025-12-03', time: '07:00', status: 'В ожидании', plane: 'Boeing 737-800', price: 13000 },
    });
    const flight35 = await prisma.flight.create({
        data: { from: 'Москва', to: 'Тель-Авив', date: '2025-12-04', time: '23:10', status: 'В ожидании', plane: 'Airbus A321', price: 37000 },
    });
    const flight36 = await prisma.flight.create({
        data: { from: 'Владивосток', to: 'Сеул', date: '2025-12-05', time: '09:00', status: 'В ожидании', plane: 'Boeing 787 Dreamliner', price: 48000 },
    });
    const flight37 = await prisma.flight.create({
        data: { from: 'Омск', to: 'Новосибирск', date: '2025-12-06', time: '12:25', status: 'В ожидании', plane: 'Airbus A319', price: 7000 },
    });
    const flight38 = await prisma.flight.create({
        data: { from: 'Калининград', to: 'Москва', date: '2025-12-07', time: '18:50', status: 'В ожидании', plane: 'Airbus A320', price: 10000 },
    });
    const flight39 = await prisma.flight.create({
        data: { from: 'Москва', to: 'Лондон', date: '2025-12-08', time: '10:40', status: 'В ожидании', plane: 'Boeing 777', price: 45000 },
    });
    const flight40 = await prisma.flight.create({
        data: { from: 'Сочи', to: 'Минеральные Воды', date: '2025-12-09', time: '15:35', status: 'В ожидании', plane: 'Embraer E190', price: 6000 },
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
            // flight12
            { id: 1, flightId: flight12.id, staffId: pilot3.id },
            { id: 2, flightId: flight12.id, staffId: pilot4.id },
            { id: 3, flightId: flight12.id, staffId: stewardess1.id },
            { id: 4, flightId: flight12.id, staffId: stewardess3.id },
            // flight13
            { id: 1, flightId: flight13.id, staffId: pilot5.id },
            { id: 2, flightId: flight13.id, staffId: pilot1.id },
            { id: 3, flightId: flight13.id, staffId: stewardess2.id },
            { id: 4, flightId: flight13.id, staffId: stewardess5.id },
            // flight14
            { id: 1, flightId: flight14.id, staffId: pilot2.id },
            { id: 2, flightId: flight14.id, staffId: pilot3.id },
            { id: 3, flightId: flight14.id, staffId: stewardess4.id },
            { id: 4, flightId: flight14.id, staffId: stewardess1.id },
            // flight15
            { id: 1, flightId: flight15.id, staffId: pilot4.id },
            { id: 2, flightId: flight15.id, staffId: pilot5.id },
            { id: 3, flightId: flight15.id, staffId: stewardess5.id },
            { id: 4, flightId: flight15.id, staffId: stewardess2.id },
            // flight16
            { id: 1, flightId: flight16.id, staffId: pilot1.id },
            { id: 2, flightId: flight16.id, staffId: pilot2.id },
            { id: 3, flightId: flight16.id, staffId: stewardess3.id },
            { id: 4, flightId: flight16.id, staffId: stewardess4.id },
            // flight17
            { id: 1, flightId: flight17.id, staffId: pilot3.id },
            { id: 2, flightId: flight17.id, staffId: pilot4.id },
            { id: 3, flightId: flight17.id, staffId: stewardess1.id },
            { id: 4, flightId: flight17.id, staffId: stewardess5.id },
            // flight18
            { id: 1, flightId: flight18.id, staffId: pilot5.id },
            { id: 2, flightId: flight18.id, staffId: pilot1.id },
            { id: 3, flightId: flight18.id, staffId: stewardess2.id },
            { id: 4, flightId: flight18.id, staffId: stewardess3.id },
            // flight19
            { id: 1, flightId: flight19.id, staffId: pilot2.id },
            { id: 2, flightId: flight19.id, staffId: pilot3.id },
            { id: 3, flightId: flight19.id, staffId: stewardess4.id },
            { id: 4, flightId: flight19.id, staffId: stewardess1.id },
            // flight20
            { id: 1, flightId: flight20.id, staffId: pilot4.id },
            { id: 2, flightId: flight20.id, staffId: pilot5.id },
            { id: 3, flightId: flight20.id, staffId: stewardess5.id },
            { id: 4, flightId: flight20.id, staffId: stewardess2.id },
            // flight21
            { id: 1, flightId: flight21.id, staffId: pilot1.id },
            { id: 2, flightId: flight21.id, staffId: pilot2.id },
            { id: 3, flightId: flight21.id, staffId: stewardess1.id },
            { id: 4, flightId: flight21.id, staffId: stewardess2.id },
            // flight22
            { id: 1, flightId: flight22.id, staffId: pilot3.id },
            { id: 2, flightId: flight22.id, staffId: pilot4.id },
            { id: 3, flightId: flight22.id, staffId: stewardess3.id },
            { id: 4, flightId: flight22.id, staffId: stewardess4.id },
            // flight23
            { id: 1, flightId: flight23.id, staffId: pilot5.id },
            { id: 2, flightId: flight23.id, staffId: pilot1.id },
            { id: 3, flightId: flight23.id, staffId: stewardess5.id },
            { id: 4, flightId: flight23.id, staffId: stewardess2.id },
            // flight24
            { id: 1, flightId: flight24.id, staffId: pilot2.id },
            { id: 2, flightId: flight24.id, staffId: pilot3.id },
            { id: 3, flightId: flight24.id, staffId: stewardess1.id },
            { id: 4, flightId: flight24.id, staffId: stewardess3.id },
            // flight25
            { id: 1, flightId: flight25.id, staffId: pilot4.id },
            { id: 2, flightId: flight25.id, staffId: pilot5.id },
            { id: 3, flightId: flight25.id, staffId: stewardess4.id },
            { id: 4, flightId: flight25.id, staffId: stewardess5.id },
            // flight26
            { id: 1, flightId: flight26.id, staffId: pilot1.id },
            { id: 2, flightId: flight26.id, staffId: pilot2.id },
            { id: 3, flightId: flight26.id, staffId: stewardess2.id },
            { id: 4, flightId: flight26.id, staffId: stewardess4.id },
            // flight27
            { id: 1, flightId: flight27.id, staffId: pilot3.id },
            { id: 2, flightId: flight27.id, staffId: pilot4.id },
            { id: 3, flightId: flight27.id, staffId: stewardess1.id },
            { id: 4, flightId: flight27.id, staffId: stewardess5.id },
            // flight28
            { id: 1, flightId: flight28.id, staffId: pilot5.id },
            { id: 2, flightId: flight28.id, staffId: pilot1.id },
            { id: 3, flightId: flight28.id, staffId: stewardess2.id },
            { id: 4, flightId: flight28.id, staffId: stewardess3.id },
            // flight29
            { id: 1, flightId: flight29.id, staffId: pilot2.id },
            { id: 2, flightId: flight29.id, staffId: pilot3.id },
            { id: 3, flightId: flight29.id, staffId: stewardess3.id },
            { id: 4, flightId: flight29.id, staffId: stewardess1.id },
            // flight30
            { id: 1, flightId: flight30.id, staffId: pilot4.id },
            { id: 2, flightId: flight30.id, staffId: pilot5.id },
            { id: 3, flightId: flight30.id, staffId: stewardess2.id },
            { id: 4, flightId: flight30.id, staffId: stewardess4.id },
            // flight31
            { id: 1, flightId: flight31.id, staffId: pilot1.id },
            { id: 2, flightId: flight31.id, staffId: pilot2.id },
            { id: 3, flightId: flight31.id, staffId: stewardess1.id },
            { id: 4, flightId: flight31.id, staffId: stewardess5.id },
            // flight32
            { id: 1, flightId: flight32.id, staffId: pilot3.id },
            { id: 2, flightId: flight32.id, staffId: pilot4.id },
            { id: 3, flightId: flight32.id, staffId: stewardess3.id },
            { id: 4, flightId: flight32.id, staffId: stewardess4.id },
            // flight33
            { id: 1, flightId: flight33.id, staffId: pilot5.id },
            { id: 2, flightId: flight33.id, staffId: pilot1.id },
            { id: 3, flightId: flight33.id, staffId: stewardess5.id },
            { id: 4, flightId: flight33.id, staffId: stewardess2.id },
            // flight34
            { id: 1, flightId: flight34.id, staffId: pilot2.id },
            { id: 2, flightId: flight34.id, staffId: pilot3.id },
            { id: 3, flightId: flight34.id, staffId: stewardess1.id },
            { id: 4, flightId: flight34.id, staffId: stewardess3.id },
            // flight35
            { id: 1, flightId: flight35.id, staffId: pilot4.id },
            { id: 2, flightId: flight35.id, staffId: pilot5.id },
            { id: 3, flightId: flight35.id, staffId: stewardess4.id },
            { id: 4, flightId: flight35.id, staffId: stewardess5.id },
            // flight36
            { id: 1, flightId: flight36.id, staffId: pilot1.id },
            { id: 2, flightId: flight36.id, staffId: pilot2.id },
            { id: 3, flightId: flight36.id, staffId: stewardess2.id },
            { id: 4, flightId: flight36.id, staffId: stewardess4.id },
            // flight37
            { id: 1, flightId: flight37.id, staffId: pilot3.id },
            { id: 2, flightId: flight37.id, staffId: pilot4.id },
            { id: 3, flightId: flight37.id, staffId: stewardess1.id },
            { id: 4, flightId: flight37.id, staffId: stewardess5.id },
            // flight38
            { id: 1, flightId: flight38.id, staffId: pilot5.id },
            { id: 2, flightId: flight38.id, staffId: pilot1.id },
            { id: 3, flightId: flight38.id, staffId: stewardess2.id },
            { id: 4, flightId: flight38.id, staffId: stewardess3.id },
            // flight39
            { id: 1, flightId: flight39.id, staffId: pilot2.id },
            { id: 2, flightId: flight39.id, staffId: pilot3.id },
            { id: 3, flightId: flight39.id, staffId: stewardess3.id },
            { id: 4, flightId: flight39.id, staffId: stewardess1.id },
            // flight40
            { id: 1, flightId: flight40.id, staffId: pilot4.id },
            { id: 2, flightId: flight40.id, staffId: pilot5.id },
            { id: 3, flightId: flight40.id, staffId: stewardess2.id },
            { id: 4, flightId: flight40.id, staffId: stewardess4.id },
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