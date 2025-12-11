import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.crewMember.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.flight.deleteMany();
    await prisma.passenger.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.user.deleteMany();
    const adminUser = await prisma.user.create({
        data: {
            username: 'admin',
            password: 'admin123',
            role: 'admin',
        },
    });

    const passengerUser = await prisma.user.create({
        data: {
            username: 'ivanov',
            password: '1234',
            role: 'passenger',
        },
    });

    const passenger = await prisma.passenger.create({
        data: {
            name: 'Иванов Иван Иванович',
            passport: '1234 567890',
            email: 'ivanov@example.com',
            phone: '+375 (29) 123-45-67',
            userId: passengerUser.id,
        },
    });

    const pilot1 = await prisma.staff.create({
        data: {
            name: 'Петров Петр Петрович',
            role: 'Пилот',
            email: 'pilot1@airline.ru',
            phone: '+375 (29) 111-22-33',
        },
    });

    const stewardess1 = await prisma.staff.create({
        data: {
            name: 'Сидорова Анна Викторовна',
            role: 'Стюардесса',
            email: 'stewardess1@airline.ru',
            phone: '+375 (29) 222-33-44',
        },
    });

    const engineer1 = await prisma.staff.create({
        data: {
            name: 'Кузнецов Михаил Сергеевич',
            role: 'Инженер',
            email: 'engineer1@airline.ru',
            phone: '+375 (29) 333-44-55',
        },
    });

    const pilot2 = await prisma.staff.create({
        data: {
            name: 'Иванов Сергей Николаевич',
            role: 'Пилот',
            email: 'pilot2@airline.ru',
            phone: '+375 (29) 444-55-66',
        },
    });

    const pilot3 = await prisma.staff.create({
        data: {
            name: 'Алексеев Дмитрий Андреевич',
            role: 'Пилот',
            email: 'pilot3@airline.ru',
            phone: '+375 (29) 555-66-77',
        },
    });

    const pilot4 = await prisma.staff.create({
        data: {
            name: 'Никитин Павел Константинович',
            role: 'Пилот',
            email: 'pilot4@airline.ru',
            phone: '+375 (29) 666-77-88',
        },
    });

    const pilot5 = await prisma.staff.create({
        data: {
            name: 'Громов Алексей Викторович',
            role: 'Пилот',
            email: 'pilot5@airline.ru',
            phone: '+375 (29) 777-88-99',
        },
    });

    const stewardess2 = await prisma.staff.create({
        data: {
            name: 'Ковалёва Мария Сергеевна',
            role: 'Стюардесса',
            email: 'stewardess2@airline.ru',
            phone: '+375 (29) 888-99-00',
        },
    });

    const stewardess3 = await prisma.staff.create({
        data: {
            name: 'Романова Елена Александровна',
            role: 'Стюардесса',
            email: 'stewardess3@airline.ru',
            phone: '+375 (29) 000-11-22',
        },
    });

    const stewardess4 = await prisma.staff.create({
        data: {
            name: 'Смирнова Ольга Дмитриевна',
            role: 'Стюардесса',
            email: 'stewardess4@airline.ru',
            phone: '+375 (29) 111-22-44',
        },
    });

    const stewardess5 = await prisma.staff.create({
        data: {
            name: 'Ильина Наталья Викторовна',
            role: 'Стюардесса',
            email: 'stewardess5@airline.ru',
            phone: '+375 (29) 222-44-55',
        },
    });

    const engineer2 = await prisma.staff.create({
        data: {
            name: 'Сорокин Игорь Павлович',
            role: 'Инженер',
            email: 'engineer2@airline.ru',
            phone: '+375 (29) 333-55-66',
        },
    });

    const flightData = [
        { to: 'Стамбул', date: '2025-12-10', time: '12:00', status: 'В ожидании', plane: 'Airbus A320', price: 550 },
        { to: 'Варшава', date: '2025-12-11', time: '09:30', status: 'В ожидании', plane: 'Boeing 737', price: 450 },
        { to: 'Дубай', date: '2025-12-12', time: '15:45', status: 'В пути', plane: 'Airbus A321', price: 700 },
        { to: 'Тбилиси', date: '2025-12-13', time: '07:15', status: 'В ожидании', plane: 'Boeing 737 MAX', price: 780 },
        { to: 'Москва', date: '2025-12-14', time: '18:20', status: 'В ожидании', plane: 'Airbus A320neo', price: 600 },
        { to: 'Париж', date: '2025-12-15', time: '10:40', status: 'В ожидании', plane: 'Boeing 757', price: 850 },
        { to: 'Берлин', date: '2025-12-16', time: '14:10', status: 'В ожидании', plane: 'Airbus A320', price: 620 },
        { to: 'Астана', date: '2025-12-17', time: '08:25', status: 'В ожидании', plane: 'Boeing 737-800', price: 680 },
        { to: 'Рим', date: '2025-12-18', time: '19:00', status: 'В ожидании', plane: 'Airbus A321', price: 720 },
        { to: 'Лондон', date: '2025-12-19', time: '06:50', status: 'В ожидании', plane: 'Boeing 737 MAX', price: 890 },
        { to: 'Вильнюс', date: '2025-12-20', time: '11:35', status: 'В ожидании', plane: 'Airbus A319', price: 350 },
        { to: 'Каир', date: '2025-12-21', time: '13:20', status: 'В ожидании', plane: 'Airbus A321', price: 950 },
        { to: 'Нью-Йорк', date: '2025-12-22', time: '22:10', status: 'В ожидании', plane: 'Boeing 777', price: 1500 },
        { to: 'Хельсинки', date: '2025-12-23', time: '08:50', status: 'В ожидании', plane: 'Embraer E190', price: 570 },
        { to: 'Ереван', date: '2025-12-24', time: '12:35', status: 'В ожидании', plane: 'Airbus A320', price: 790 },
        { to: 'Ташкент', date: '2025-12-25', time: '07:05', status: 'В ожидании', plane: 'Boeing 737-800', price: 680 },
        { to: 'Пекин', date: '2025-12-26', time: '09:15', status: 'В ожидании', plane: 'Boeing 787 Dreamliner', price: 1800 },
        { to: 'Франкфурт', date: '2025-12-27', time: '16:45', status: 'В ожидании', plane: 'Airbus A320neo', price: 750 },
        { to: 'Батуми', date: '2025-12-28', time: '20:25', status: 'В ожидании', plane: 'Boeing 737', price: 630 },
        { to: 'Бишкек', date: '2025-12-29', time: '06:30', status: 'В ожидании', plane: 'Airbus A319', price: 590 },
        { to: 'Амстердам', date: '2025-12-30', time: '12:10', status: 'В ожидании', plane: 'Airbus A321', price: 810 },
        { to: 'Барселона', date: '2025-12-31', time: '09:55', status: 'В ожидании', plane: 'Boeing 737-800', price: 920 },
        { to: 'Дели', date: '2026-01-01', time: '07:25', status: 'В ожидании', plane: 'Airbus A320', price: 770 },
        { to: 'Алматы', date: '2026-01-02', time: '06:40', status: 'В ожидании', plane: 'Boeing 737 MAX', price: 760 },
        { to: 'Прага', date: '2026-01-03', time: '17:15', status: 'В ожидании', plane: 'Embraer E190', price: 650 },
        { to: 'Вена', date: '2026-01-04', time: '19:20', status: 'В ожидании', plane: 'Airbus A319', price: 620 },
        { to: 'Шарм-эш-Шейх', date: '2026-01-05', time: '05:50', status: 'В ожидании', plane: 'Boeing 737', price: 1050 },
        { to: 'Санкт-Петербург', date: '2026-01-06', time: '08:10', status: 'В ожидании', plane: 'Airbus A320', price: 380 },
        { to: 'Мюнхен', date: '2026-01-07', time: '13:05', status: 'В ожидании', plane: 'Boeing 737-800', price: 550 },
        { to: 'Кишинев', date: '2026-01-08', time: '21:15', status: 'В ожидании', plane: 'Airbus A321', price: 470 },
        { to: 'Баку', date: '2026-01-09', time: '11:30', status: 'В ожидании', plane: 'Airbus A320neo', price: 800 },
        { to: 'Рига', date: '2026-01-10', time: '06:30', status: 'В ожидании', plane: 'Boeing 737', price: 500 },
        { to: 'Калининград', date: '2026-01-11', time: '08:45', status: 'В ожидании', plane: 'Embraer E190', price: 330 },
        { to: 'София', date: '2026-01-12', time: '07:00', status: 'В ожидании', plane: 'Boeing 737-800', price: 580 },
        { to: 'Тель-Авив', date: '2026-01-13', time: '23:10', status: 'В ожидании', plane: 'Airbus A321', price: 1100 },
        { to: 'Сеул', date: '2026-01-14', time: '09:00', status: 'В ожидании', plane: 'Boeing 787 Dreamliner', price: 1650 },
        { to: 'Анкара', date: '2026-01-15', time: '12:25', status: 'В ожидании', plane: 'Airbus A319', price: 430 },
        { to: 'Вроцлав', date: '2026-01-16', time: '18:50', status: 'В ожидании', plane: 'Airbus A320', price: 400 },
        { to: 'Торонто', date: '2026-01-17', time: '10:40', status: 'В ожидании', plane: 'Boeing 777', price: 1550 },
        { to: 'Афины', date: '2026-01-18', time: '15:35', status: 'В ожидании', plane: 'Embraer E190', price: 520 },
    ];

    const flights = await Promise.all(
        flightData.map((flight) =>
            prisma.flight.create({
                data: {
                    from: 'Минск',
                    ...flight,
                },
            })
        )
    );

    const [
        flight1,
        flight2,
        flight3,
        flight4,
        flight5,
        flight6,
        flight7,
        flight8,
        flight9,
        flight10,
        flight11,
        flight12,
        flight13,
        flight14,
        flight15,
        flight16,
        flight17,
        flight18,
        flight19,
        flight20,
        flight21,
        flight22,
        flight23,
        flight24,
        flight25,
        flight26,
        flight27,
        flight28,
        flight29,
        flight30,
        flight31,
        flight32,
        flight33,
        flight34,
        flight35,
        flight36,
        flight37,
        flight38,
        flight39,
        flight40,
    ] = flights;

    await prisma.crewMember.createMany({
        data: [
            { id: 1, flightId: flight1.id, staffId: pilot1.id },
            { id: 2, flightId: flight1.id, staffId: pilot2.id },
            { id: 3, flightId: flight1.id, staffId: stewardess1.id },
            { id: 4, flightId: flight1.id, staffId: stewardess2.id },
            { id: 1, flightId: flight2.id, staffId: pilot3.id },
            { id: 2, flightId: flight2.id, staffId: pilot4.id },
            { id: 3, flightId: flight2.id, staffId: stewardess3.id },
            { id: 4, flightId: flight2.id, staffId: stewardess4.id },
            { id: 1, flightId: flight3.id, staffId: pilot5.id },
            { id: 2, flightId: flight3.id, staffId: pilot1.id },
            { id: 3, flightId: flight3.id, staffId: stewardess5.id },
            { id: 4, flightId: flight3.id, staffId: stewardess2.id },
            { id: 5, flightId: flight3.id, staffId: engineer1.id },
            { id: 1, flightId: flight4.id, staffId: pilot2.id },
            { id: 2, flightId: flight4.id, staffId: pilot3.id },
            { id: 3, flightId: flight4.id, staffId: stewardess1.id },
            { id: 4, flightId: flight4.id, staffId: stewardess3.id },
            { id: 1, flightId: flight5.id, staffId: pilot4.id },
            { id: 2, flightId: flight5.id, staffId: pilot5.id },
            { id: 3, flightId: flight5.id, staffId: stewardess4.id },
            { id: 4, flightId: flight5.id, staffId: stewardess5.id },
            { id: 1, flightId: flight6.id, staffId: pilot1.id },
            { id: 2, flightId: flight6.id, staffId: pilot2.id },
            { id: 3, flightId: flight6.id, staffId: stewardess2.id },
            { id: 4, flightId: flight6.id, staffId: stewardess4.id },
            { id: 1, flightId: flight7.id, staffId: pilot3.id },
            { id: 2, flightId: flight7.id, staffId: pilot4.id },
            { id: 3, flightId: flight7.id, staffId: stewardess1.id },
            { id: 4, flightId: flight7.id, staffId: stewardess5.id },
            { id: 1, flightId: flight8.id, staffId: pilot5.id },
            { id: 2, flightId: flight8.id, staffId: pilot1.id },
            { id: 3, flightId: flight8.id, staffId: stewardess2.id },
            { id: 4, flightId: flight8.id, staffId: stewardess4.id },
            { id: 1, flightId: flight9.id, staffId: pilot2.id },
            { id: 2, flightId: flight9.id, staffId: pilot3.id },
            { id: 3, flightId: flight9.id, staffId: stewardess3.id },
            { id: 4, flightId: flight9.id, staffId: stewardess1.id },
            { id: 1, flightId: flight10.id, staffId: pilot4.id },
            { id: 2, flightId: flight10.id, staffId: pilot5.id },
            { id: 3, flightId: flight10.id, staffId: stewardess2.id },
            { id: 4, flightId: flight10.id, staffId: stewardess3.id },
            { id: 1, flightId: flight11.id, staffId: pilot1.id },
            { id: 2, flightId: flight11.id, staffId: pilot2.id },
            { id: 3, flightId: flight11.id, staffId: stewardess4.id },
            { id: 4, flightId: flight11.id, staffId: stewardess5.id },
            { id: 1, flightId: flight12.id, staffId: pilot3.id },
            { id: 2, flightId: flight12.id, staffId: pilot4.id },
            { id: 3, flightId: flight12.id, staffId: stewardess1.id },
            { id: 4, flightId: flight12.id, staffId: stewardess3.id },
            { id: 1, flightId: flight13.id, staffId: pilot5.id },
            { id: 2, flightId: flight13.id, staffId: pilot1.id },
            { id: 3, flightId: flight13.id, staffId: stewardess2.id },
            { id: 4, flightId: flight13.id, staffId: stewardess5.id },
            { id: 1, flightId: flight14.id, staffId: pilot2.id },
            { id: 2, flightId: flight14.id, staffId: pilot3.id },
            { id: 3, flightId: flight14.id, staffId: stewardess4.id },
            { id: 4, flightId: flight14.id, staffId: stewardess1.id },
            { id: 1, flightId: flight15.id, staffId: pilot4.id },
            { id: 2, flightId: flight15.id, staffId: pilot5.id },
            { id: 3, flightId: flight15.id, staffId: stewardess5.id },
            { id: 4, flightId: flight15.id, staffId: stewardess2.id },
            { id: 1, flightId: flight16.id, staffId: pilot1.id },
            { id: 2, flightId: flight16.id, staffId: pilot2.id },
            { id: 3, flightId: flight16.id, staffId: stewardess3.id },
            { id: 4, flightId: flight16.id, staffId: stewardess4.id },
            { id: 1, flightId: flight17.id, staffId: pilot3.id },
            { id: 2, flightId: flight17.id, staffId: pilot4.id },
            { id: 3, flightId: flight17.id, staffId: stewardess1.id },
            { id: 4, flightId: flight17.id, staffId: stewardess5.id },
            { id: 1, flightId: flight18.id, staffId: pilot5.id },
            { id: 2, flightId: flight18.id, staffId: pilot1.id },
            { id: 3, flightId: flight18.id, staffId: stewardess2.id },
            { id: 4, flightId: flight18.id, staffId: stewardess3.id },
            { id: 1, flightId: flight19.id, staffId: pilot2.id },
            { id: 2, flightId: flight19.id, staffId: pilot3.id },
            { id: 3, flightId: flight19.id, staffId: stewardess4.id },
            { id: 4, flightId: flight19.id, staffId: stewardess1.id },
            { id: 1, flightId: flight20.id, staffId: pilot4.id },
            { id: 2, flightId: flight20.id, staffId: pilot5.id },
            { id: 3, flightId: flight20.id, staffId: stewardess5.id },
            { id: 4, flightId: flight20.id, staffId: stewardess2.id },
            { id: 1, flightId: flight21.id, staffId: pilot1.id },
            { id: 2, flightId: flight21.id, staffId: pilot2.id },
            { id: 3, flightId: flight21.id, staffId: stewardess1.id },
            { id: 4, flightId: flight21.id, staffId: stewardess2.id },
            { id: 1, flightId: flight22.id, staffId: pilot3.id },
            { id: 2, flightId: flight22.id, staffId: pilot4.id },
            { id: 3, flightId: flight22.id, staffId: stewardess3.id },
            { id: 4, flightId: flight22.id, staffId: stewardess4.id },
            { id: 1, flightId: flight23.id, staffId: pilot5.id },
            { id: 2, flightId: flight23.id, staffId: pilot1.id },
            { id: 3, flightId: flight23.id, staffId: stewardess5.id },
            { id: 4, flightId: flight23.id, staffId: stewardess2.id },
            { id: 1, flightId: flight24.id, staffId: pilot2.id },
            { id: 2, flightId: flight24.id, staffId: pilot3.id },
            { id: 3, flightId: flight24.id, staffId: stewardess1.id },
            { id: 4, flightId: flight24.id, staffId: stewardess3.id },
            { id: 1, flightId: flight25.id, staffId: pilot4.id },
            { id: 2, flightId: flight25.id, staffId: pilot5.id },
            { id: 3, flightId: flight25.id, staffId: stewardess4.id },
            { id: 4, flightId: flight25.id, staffId: stewardess5.id },
            { id: 1, flightId: flight26.id, staffId: pilot1.id },
            { id: 2, flightId: flight26.id, staffId: pilot2.id },
            { id: 3, flightId: flight26.id, staffId: stewardess2.id },
            { id: 4, flightId: flight26.id, staffId: stewardess4.id },
            { id: 1, flightId: flight27.id, staffId: pilot3.id },
            { id: 2, flightId: flight27.id, staffId: pilot4.id },
            { id: 3, flightId: flight27.id, staffId: stewardess1.id },
            { id: 4, flightId: flight27.id, staffId: stewardess5.id },
            { id: 1, flightId: flight28.id, staffId: pilot5.id },
            { id: 2, flightId: flight28.id, staffId: pilot1.id },
            { id: 3, flightId: flight28.id, staffId: stewardess2.id },
            { id: 4, flightId: flight28.id, staffId: stewardess3.id },
            { id: 1, flightId: flight29.id, staffId: pilot2.id },
            { id: 2, flightId: flight29.id, staffId: pilot3.id },
            { id: 3, flightId: flight29.id, staffId: stewardess3.id },
            { id: 4, flightId: flight29.id, staffId: stewardess1.id },
            { id: 1, flightId: flight30.id, staffId: pilot4.id },
            { id: 2, flightId: flight30.id, staffId: pilot5.id },
            { id: 3, flightId: flight30.id, staffId: stewardess2.id },
            { id: 4, flightId: flight30.id, staffId: stewardess4.id },
            { id: 1, flightId: flight31.id, staffId: pilot1.id },
            { id: 2, flightId: flight31.id, staffId: pilot2.id },
            { id: 3, flightId: flight31.id, staffId: stewardess1.id },
            { id: 4, flightId: flight31.id, staffId: stewardess5.id },
            { id: 1, flightId: flight32.id, staffId: pilot3.id },
            { id: 2, flightId: flight32.id, staffId: pilot4.id },
            { id: 3, flightId: flight32.id, staffId: stewardess3.id },
            { id: 4, flightId: flight32.id, staffId: stewardess4.id },
            { id: 1, flightId: flight33.id, staffId: pilot5.id },
            { id: 2, flightId: flight33.id, staffId: pilot1.id },
            { id: 3, flightId: flight33.id, staffId: stewardess5.id },
            { id: 4, flightId: flight33.id, staffId: stewardess2.id },
            { id: 1, flightId: flight34.id, staffId: pilot2.id },
            { id: 2, flightId: flight34.id, staffId: pilot3.id },
            { id: 3, flightId: flight34.id, staffId: stewardess1.id },
            { id: 4, flightId: flight34.id, staffId: stewardess3.id },
            { id: 1, flightId: flight35.id, staffId: pilot4.id },
            { id: 2, flightId: flight35.id, staffId: pilot5.id },
            { id: 3, flightId: flight35.id, staffId: stewardess4.id },
            { id: 4, flightId: flight35.id, staffId: stewardess5.id },
            { id: 1, flightId: flight36.id, staffId: pilot1.id },
            { id: 2, flightId: flight36.id, staffId: pilot2.id },
            { id: 3, flightId: flight36.id, staffId: stewardess2.id },
            { id: 4, flightId: flight36.id, staffId: stewardess4.id },
            { id: 1, flightId: flight37.id, staffId: pilot3.id },
            { id: 2, flightId: flight37.id, staffId: pilot4.id },
            { id: 3, flightId: flight37.id, staffId: stewardess1.id },
            { id: 4, flightId: flight37.id, staffId: stewardess5.id },
            { id: 1, flightId: flight38.id, staffId: pilot5.id },
            { id: 2, flightId: flight38.id, staffId: pilot1.id },
            { id: 3, flightId: flight38.id, staffId: stewardess2.id },
            { id: 4, flightId: flight38.id, staffId: stewardess3.id },
            { id: 1, flightId: flight39.id, staffId: pilot2.id },
            { id: 2, flightId: flight39.id, staffId: pilot3.id },
            { id: 3, flightId: flight39.id, staffId: stewardess3.id },
            { id: 4, flightId: flight39.id, staffId: stewardess1.id },
            { id: 1, flightId: flight40.id, staffId: pilot4.id },
            { id: 2, flightId: flight40.id, staffId: pilot5.id },
            { id: 3, flightId: flight40.id, staffId: stewardess2.id },
            { id: 4, flightId: flight40.id, staffId: stewardess4.id },
        ],
    });

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